import { Users } from 'lucide-react';

interface NextOfKinProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NextOfKin({ formData, onChange }: NextOfKinProps) {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        Next of Kin Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="nextOfKinName"
            value={formData.nextOfKinName}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="nextOfKinAddress"
            value={formData.nextOfKinAddress}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number 1</label>
          <input
            type="tel"
            name="nextOfKinPhone1"
            value={formData.nextOfKinPhone1}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number 2</label>
          <input
            type="tel"
            name="nextOfKinPhone2"
            value={formData.nextOfKinPhone2}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );
}