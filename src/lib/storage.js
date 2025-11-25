const STORAGE_KEYS = {
    CURRENT_USER: 'allergy_diary_current_user',
    USERS: 'allergy_diary_users', // Stores array of all registered users
    HISTORY: 'allergy_diary_history',
    THEME: 'allergy_diary_theme',
};

// --- User Session Management ---

export const saveUser = (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// --- User Registration & Auth ---

export const getRegisteredUsers = () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
};

export const registerUser = (newUser) => {
    const users = getRegisteredUsers();

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        throw new Error('Email already registered.');
    }

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Auto-login after registration
    saveUser(newUser);
};

export const loginUser = (email, password) => {
    const users = getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        throw new Error('User not found.');
    }

    if (user.password !== password) {
        throw new Error('Incorrect password.');
    }

    saveUser(user);
    return user;
};

export const resetPassword = (email, newPassword) => {
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
        throw new Error('User not found.');
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const updateUserProfile = (updatedUser) => {
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Always update current session
    saveUser(updatedUser);
};

export const clearAllUsers = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.HISTORY); // Optional: clear history too?
};

// --- Other Storage ---

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
