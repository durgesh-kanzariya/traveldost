const pool = require('../config/db');

const Checklist = {
    findAllByUserId: async (userId, tripId = null) => {
        let query = `
            SELECT ci.id, ci.item_name as label, ci.is_checked as checked, cc.trip_id 
            FROM checklist_items ci
            JOIN custom_checklists cc ON ci.checklist_id = cc.id
            WHERE cc.user_id = $1
        `;
        const values = [userId];

        if (tripId) {
            query += ' AND cc.trip_id = $2';
            values.push(tripId);
        } else {
            query += ' AND cc.trip_id IS NULL';
        }

        query += ' ORDER BY ci.id ASC';
        const result = await pool.query(query, values);
        return result.rows;
    },

    create: async (userId, label, tripId = null) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            let findQuery = 'SELECT id FROM custom_checklists WHERE user_id = $1';
            let findValues = [userId];
            if (tripId) {
                findQuery += ' AND trip_id = $2';
                findValues.push(tripId);
            } else {
                findQuery += ' AND trip_id IS NULL';
            }

            let listResult = await client.query(findQuery, findValues);
            let checklistId;

            if (listResult.rows.length === 0) {
                const createListQuery = 'INSERT INTO custom_checklists (trip_id, user_id) VALUES ($1, $2) RETURNING id';
                const createListResult = await client.query(createListQuery, [tripId, userId]);
                checklistId = createListResult.rows[0].id;
            } else {
                checklistId = listResult.rows[0].id;
            }

            const itemQuery = 'INSERT INTO checklist_items (checklist_id, item_name, is_checked) VALUES ($1, $2, $3) RETURNING id, item_name as label, is_checked as checked';
            const itemResult = await client.query(itemQuery, [checklistId, label, false]);

            await client.query('COMMIT');

            const newItem = itemResult.rows[0];
            newItem.trip_id = tripId;
            return newItem;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    update: async (id, userId, checked) => {
        const query = `
            UPDATE checklist_items
            SET is_checked = $1, updated_at = CURRENT_TIMESTAMP
            FROM custom_checklists
            WHERE checklist_items.checklist_id = custom_checklists.id
              AND checklist_items.id = $2
              AND custom_checklists.user_id = $3
        `;
        await pool.query(query, [checked, id, userId]);
        return { message: 'Updated' };
    },

    delete: async (id, userId) => {
        const query = `
            DELETE FROM checklist_items
            USING custom_checklists
            WHERE checklist_items.checklist_id = custom_checklists.id
              AND checklist_items.id = $1
              AND custom_checklists.user_id = $2
        `;
        await pool.query(query, [id, userId]);
        return { message: 'Deleted' };
    }
};

module.exports = Checklist;
