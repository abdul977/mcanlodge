import { Check } from 'lucide-react';

interface AcceptanceFormProps {
  accepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
}

export function AcceptanceForm({ accepted, onAcceptChange }: AcceptanceFormProps) {
  return (
    <div className="mb-8">
      <div className="bg-green-50 p-4 rounded-lg">
        <label className="flex items-start cursor-pointer">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => onAcceptChange(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              I hereby declare that:
            </p>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                I have read and understood all the rules and regulations of MCAN FCT Chapter
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                I agree to abide by all the rules and regulations during my stay
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                I understand that violation of any rules may result in eviction from the lodge
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                All information provided in this form is accurate and true
              </li>
            </ul>
          </div>
        </label>
      </div>
    </div>
  );
}