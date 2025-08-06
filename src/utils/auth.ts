import { authService } from '../lib/database';

interface AuthUtils {
  isAuthenticated: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  isAdmin: (email: string) => Promise<boolean>;
}

export const auth: AuthUtils = {
  isAuthenticated: async () => {
    const { session } = await authService.getSession();
    return !!session;
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Check if user is admin
        const { isAdmin } = await authService.isAdmin(data.user.email || '');
        if (!isAdmin) {
          await authService.signOut();
          return { success: false, error: 'Access denied. Admin privileges required.' };
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  logout: async () => {
    await authService.signOut();
  },

  getCurrentUser: async () => {
    const { user } = await authService.getUser();
    return user;
  },

  isAdmin: async (email: string) => {
    const { isAdmin } = await authService.isAdmin(email);
    return isAdmin;
  }
};
