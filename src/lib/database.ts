import { supabase, Application } from './supabase';

// Application operations
export const applicationService = {
  // Create a new application (public access)
  async create(applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<{ data: Application | null; error: any }> {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();

    return { data, error };
  },

  // Get all applications (admin only)
  async getAll(): Promise<{ data: Application[] | null; error: any }> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Get application by reference number (public access for status checking)
  async getByReferenceNumber(referenceNumber: string): Promise<{ data: Application | null; error: any }> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('reference_number', referenceNumber)
      .single();

    return { data, error };
  },

  // Update application status (admin only)
  async updateStatus(id: string, status: Application['status']): Promise<{ data: Application | null; error: any }> {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Get application statistics (admin only)
  async getStats(): Promise<{ data: { total: number; pending: number; approved: number; rejected: number } | null; error: any }> {
    const { data, error } = await supabase
      .from('applications')
      .select('status');

    if (error) {
      return { data: null, error };
    }

    const stats = {
      total: data.length,
      pending: data.filter(app => app.status === 'Pending').length,
      approved: data.filter(app => app.status === 'Approved').length,
      rejected: data.filter(app => app.status === 'Rejected').length,
    };

    return { data: stats, error: null };
  },

  // Get applications by user email (for user dashboard)
  async getByUserEmail(email: string): Promise<{ data: Application[] | null; error: any }> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    return { data, error };
  }
};

// Authentication operations
export const authService = {
  // Create admin user (for initial setup)
  async createAdminUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      // Add to admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([{ email }]);

      if (adminError) {
        console.error('Failed to add to admin_users:', adminError);
      }
    }

    return { data, error };
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Check if user is admin
  async isAdmin(email: string): Promise<{ isAdmin: boolean; error: any }> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      return { isAdmin: false, error };
    }

    return { isAdmin: !!data, error: null };
  },

  // Create regular user (for user registration)
  async createUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { data, error };
  },

  // Sign in for regular users (no admin check)
  async signInUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }
};

// Utility functions
export const generateReferenceNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MCAN-${timestamp.slice(-6)}-${random}`;
};
