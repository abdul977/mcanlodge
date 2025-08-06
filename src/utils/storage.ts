export interface FormSubmission {
  referenceNumber: string;
  fullName: string;
  email: string;
  submissionDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  passportPreview: string | null;
  formData: Record<string, string>;
}

const STORAGE_KEY = 'mcan_submissions';

export const saveSubmission = (formData: Record<string, string>, passportPreview: string | null): void => {
  const submissions: FormSubmission[] = getSubmissions();
  
  const newSubmission: FormSubmission = {
    referenceNumber: formData.referenceNumber,
    fullName: formData.fullName,
    email: formData.email,
    submissionDate: new Date().toISOString(),
    status: 'Pending',
    passportPreview,
    formData
  };

  submissions.unshift(newSubmission); // Add new submission at the beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};

export const getSubmissions = (): FormSubmission[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getSubmissionStats = () => {
  const submissions = getSubmissions();
  return {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'Pending').length,
    approved: submissions.filter(s => s.status === 'Approved').length,
    rejected: submissions.filter(s => s.status === 'Rejected').length
  };
};

export const updateSubmissionStatus = (referenceNumber: string, status: FormSubmission['status']) => {
  const submissions = getSubmissions();
  const index = submissions.findIndex(s => s.referenceNumber === referenceNumber);
  
  if (index !== -1) {
    submissions[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};