import { supabase } from '../lib/supabase';

/**
 * Utility to fix admin authentication issues
 * This script helps recreate admin users properly in Supabase Auth
 */

interface AdminUser {
  email: string;
  password: string;
}

// Default admin users that should exist
const ADMIN_USERS: AdminUser[] = [
  {
    email: 'admin@mcanlodge.com',
    password: 'mcanamir2024' // You should change this password after setup
  },
  {
    email: 'amir2024@mcan.com',
    password: 'mcanamir2024'
  }
];

/**
 * Check if a user exists in Supabase Auth
 */
async function checkUserExistsInAuth(email: string): Promise<boolean> {
  try {
    // Try to sign in with a dummy password to check if user exists
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-check-123' // This will fail but tell us if user exists
    });

    if (!signInError) {
      // If no error, user exists and password was correct (unlikely with dummy password)
      await supabase.auth.signOut(); // Sign out immediately
      return true;
    }

    // Check the error message to determine if user exists
    const errorMessage = signInError.message.toLowerCase();

    // If error mentions invalid credentials, user exists but password is wrong
    if (errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('invalid email or password') ||
        errorMessage.includes('wrong password')) {
      return true;
    }

    // If error mentions user not found, email not confirmed, etc., user doesn't exist or isn't confirmed
    if (errorMessage.includes('user not found') ||
        errorMessage.includes('email not confirmed') ||
        errorMessage.includes('signup disabled')) {
      return false;
    }

    // For other errors, assume user doesn't exist
    return false;
  } catch (error) {
    console.warn('Error checking if user exists:', error);
    return false;
  }
}

/**
 * Create admin user in Supabase Auth
 */
async function createAdminUserInAuth(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Creating admin user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Don't redirect
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      // Check if user already exists
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log(`User ${email} already exists`);
        return { success: true };
      }

      console.error(`Failed to create user ${email}:`, error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log(`Successfully created user: ${email}`);

      // If email confirmations are enabled, the user might need to confirm their email
      if (!data.session && data.user.email_confirmed_at === null) {
        console.log(`User ${email} created but needs email confirmation`);

        // For admin users, we'll try to manually confirm them if possible
        // Note: This might not work depending on Supabase settings
        try {
          // Try to sign in immediately to test if confirmation is required
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInError && signInError.message.includes('email not confirmed')) {
            console.warn(`User ${email} requires email confirmation. Please check email or configure Supabase to disable email confirmations for admin users.`);
          } else if (!signInError) {
            // Sign out immediately after successful test
            await supabase.auth.signOut();
          }
        } catch (testError) {
          console.warn('Could not test user login:', testError);
        }
      }

      // Ensure user is in admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert([{ email }], { onConflict: 'email' });

      if (adminError) {
        console.warn(`Warning: Could not add ${email} to admin_users table:`, adminError.message);
      }

      return { success: true };
    }

    return { success: false, error: 'User creation returned no user data' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error creating user ${email}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Fix admin authentication by ensuring admin users exist in Supabase Auth
 */
export async function fixAdminAuth(): Promise<{ success: boolean; message: string }> {
  console.log('Starting admin authentication fix...');
  
  try {
    const results = [];
    
    for (const adminUser of ADMIN_USERS) {
      console.log(`Checking user: ${adminUser.email}`);
      
      const userExists = await checkUserExistsInAuth(adminUser.email);
      
      if (!userExists) {
        console.log(`User ${adminUser.email} not found in auth, creating...`);
        const result = await createAdminUserInAuth(adminUser.email, adminUser.password);
        results.push({ email: adminUser.email, ...result });
      } else {
        console.log(`User ${adminUser.email} already exists in auth`);
        results.push({ email: adminUser.email, success: true, skipped: true });
      }
    }

    const failedUsers = results.filter(r => !r.success);
    const createdUsers = results.filter(r => r.success && !r.skipped);
    const skippedUsers = results.filter(r => r.success && r.skipped);

    let message = 'Admin authentication fix completed.\n';
    
    if (createdUsers.length > 0) {
      message += `Created ${createdUsers.length} admin user(s): ${createdUsers.map(u => u.email).join(', ')}\n`;
    }
    
    if (skippedUsers.length > 0) {
      message += `Skipped ${skippedUsers.length} existing user(s): ${skippedUsers.map(u => u.email).join(', ')}\n`;
    }
    
    if (failedUsers.length > 0) {
      message += `Failed to create ${failedUsers.length} user(s): ${failedUsers.map(u => `${u.email} (${u.error})`).join(', ')}\n`;
      return { success: false, message };
    }

    message += '\nYou should now be able to log in with the admin credentials.';
    return { success: true, message };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error during admin auth fix:', errorMessage);
    return { 
      success: false, 
      message: `Failed to fix admin authentication: ${errorMessage}` 
    };
  }
}

/**
 * Test admin login
 */
export async function testAdminLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, message: `Login failed: ${error.message}` };
    }

    if (data.user) {
      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        return { success: false, message: 'User is not an admin' };
      }

      await supabase.auth.signOut();
      return { success: true, message: 'Admin login successful' };
    }

    return { success: false, message: 'Login returned no user data' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message: `Login test failed: ${errorMessage}` };
  }
}
