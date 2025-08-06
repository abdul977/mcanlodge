import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttcapwgcfadajcoljuuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2Fwd2djZmFkYWpjb2xqdXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMDA3NzIsImV4cCI6MjA1Mzg3Njc3Mn0.htrkudTGkcjeUKcPHTjnmT_fkFWpE-YfChMRhtDlUpA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Application {
  id: string;
  reference_number: string;
  full_name: string;
  email: string;
  mobile_number: string;
  call_up_number: string;
  state_of_origin: string;
  lga: string;
  gender: string;
  date_of_birth: string;
  marital_status: string;
  mcan_reg_no: string;
  institution: string;
  blood_group: string;
  genotype: string;
  allergies?: string;
  disabilities?: string;
  emergency_name: string;
  emergency_address: string;
  emergency_phone1: string;
  emergency_phone2?: string;
  next_of_kin_name: string;
  next_of_kin_address: string;
  next_of_kin_phone1: string;
  next_of_kin_phone2?: string;
  passport_photo_url?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
