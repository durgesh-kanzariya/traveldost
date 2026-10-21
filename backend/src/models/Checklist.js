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

            if (tripId) {
                const tripCheck = await client.query(
                    'SELECT id FROM trips WHERE id = $1 AND user_id = $2 FOR KEY SHARE',
                    [tripId, userId]
                );
                if (tripCheck.rowCount === 0) {
                    const error = new Error('Trip not found');
                    error.statusCode = 404;
                    throw error;
                }
            }

            let checklistId;
            if (tripId) {
                const upsertQuery = `
                    INSERT INTO custom_checklists (trip_id, user_id)
                    VALUES ($1, $2)
                    ON CONFLICT (user_id, trip_id) WHERE trip_id IS NOT NULL
                    DO UPDATE SET user_id = EXCLUDED.user_id
                    RETURNING id
                `;
                const listResult = await client.query(upsertQuery, [tripId, userId]);
                checklistId = listResult.rows[0].id;
            } else {
                const upsertQuery = `
                    INSERT INTO custom_checklists (trip_id, user_id)
                    VALUES (NULL, $1)
                    ON CONFLICT (user_id) WHERE trip_id IS NULL
                    DO UPDATE SET user_id = EXCLUDED.user_id
                    RETURNING id
                `;
                const listResult = await client.query(upsertQuery, [userId]);
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
        const result = await pool.query(query, [checked, id, userId]);
        if (result.rowCount === 0) {
            const err = new Error('Checklist item not found');
            err.statusCode = 404;
            throw err;
        }
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
        const result = await pool.query(query, [id, userId]);
        if (result.rowCount === 0) {
            const err = new Error('Checklist item not found');
            err.statusCode = 404;
            throw err;
        }
        return { message: 'Deleted' };
    }
};

module.exports = Checklist;
