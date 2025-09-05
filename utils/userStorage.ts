import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@app_users';
const CURRENT_USER_KEY = '@current_user';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this should be hashed
}

export interface UserSession {
  id: string;
  username: string;
  email: string;
}

// Get all stored users
export const getStoredUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting stored users:', error);
    return [];
  }
};

// Save a new user account
export const saveUser = async (user: Omit<User, 'id'>): Promise<User> => {
  try {
    const users = await getStoredUsers();
    
    // Check if user already exists
    const existingUserByUsername = users.find(u => u.username === user.username);
    if (existingUserByUsername) {
      throw new Error(`Username '${user.username}' already exists. Please choose a different username.`);
    }
    
    const existingUserByEmail = users.find(u => u.email === user.email);
    if (existingUserByEmail) {
      throw new Error(`An account with email '${user.email}' already exists. Please use a different email or try logging in.`);
    }
    
    const newUser: User = {
      ...user,
      id: Date.now().toString(), // Simple ID generation
    };
    
    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    
    return newUser;
  } catch (error) {
    console.error('Error saving user:', error);
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error; // Re-throw user-friendly errors
    }
    throw new Error('Failed to create account. Please check your device storage and try again.');
  }
};

// Validate user credentials
export const validateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const users = await getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  } catch (error) {
    console.error('Error validating user:', error);
    return null;
  }
};

// Save current user session
export const saveCurrentUser = async (user: UserSession): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user session:', error);
    throw new Error('Failed to save login session. Please try logging in again.');
  }
};

// Get current user session
export const getCurrentUser = async (): Promise<UserSession | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout user (clear current session)
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out user:', error);
    throw new Error('Failed to logout. Please close the app and try again.');
  }
};

// Clear all stored data (for testing purposes)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([USERS_KEY, CURRENT_USER_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};