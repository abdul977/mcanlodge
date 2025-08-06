import { Contact } from 'lucide-react';

interface EmergencyContactProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmergencyContact({ formData, onChange }: EmergencyContactProps) {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
        <Contact className="w-5 h-5 mr-2" />
        Emergency Contact
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="emergencyName"
            value={formData.emergencyName}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="emergencyAddress"
            value={formData.emergencyAddress}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number 1</label>
          <input
            type="tel"
            name="emergencyPhone1"
            value={formData.emergencyPhone1}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number 2</label>
          <input
            type="tel"
            name="emergencyPhone2"
            value={formData.emergencyPhone2}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );
}