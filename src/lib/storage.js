const STORAGE_KEYS = {
    USER: 'allergy_diary_user',
    HISTORY: 'allergy_diary_history',
    THEME: 'allergy_diary_theme',
};

export const saveUser = (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
};

export const addToHistory = (scanResult) => {
    const history = getHistory();
    const newHistory = [scanResult, ...history];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
};

export const getHistory = () => {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
};

export const saveTheme = (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
};
