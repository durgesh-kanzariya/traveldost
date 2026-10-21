/**
 * Hardened auth storage utility.
 * Stores access tokens and session data exclusively in sessionStorage (or memory)
 * to prevent permanent retention on disk and mitigate offline credential exfiltration.
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const NATIVE_LANG_KEY = 'nativeLanguage';

export const getAuthToken = () => {
    try {
        return sessionStorage.getItem(TOKEN_KEY) || null;
    } catch {
        return null;
    }
};

export const setAuthToken = (token) => {
    try {
        sessionStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
        console.error('Failed to save auth token to sessionStorage:', e);
    }
};

export const removeAuthToken = () => {
    try {
        sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {
        console.error('Failed to remove auth token:', e);
    }
};

export const getStoredUser = () => {
    try {
        const raw = sessionStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const setStoredUser = (user) => {
    try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
        console.error('Failed to save user data:', e);
    }
};

export const clearAuth = () => {
    try {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(NATIVE_LANG_KEY);
    } catch (e) {
        console.error('Failed to clear auth state:', e);
    }
};
