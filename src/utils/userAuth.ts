import { authService } from '../lib/database';

interface UserAuthUtils {
  isAuthenticated: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: any }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
}

export const userAuth: UserAuthUtils = {
  isAuthenticated: async () => {
    const { session } = await authService.getSession();
    return !!session;
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await authService.signInUser(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // For regular users, we don't check admin privileges
        // Just ensure they have a valid session
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  register: async (email: string, password: string) => {
    try {
      const { data, error } = await authService.createUser(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  },

  logout: async () => {
    await authService.signOut();
  },

  getCurrentUser: async () => {
    const { user } = await authService.getUser();
    return user;
  }
};
