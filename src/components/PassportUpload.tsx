import { useState } from 'react';
import { Upload } from 'lucide-react';

interface PassportUploadProps {
  onImageUpload: (image: string | null, file: File | null) => void;
}

export function PassportUpload({ onImageUpload }: PassportUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload(result, file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageUpload(null, null);
    }
  };

  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="w-32 h-40 border-2 border-dashed border-green-500 rounded-lg overflow-hidden mb-2">
        {preview ? (
          <img src={preview} alt="Passport" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-green-500">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-xs text-center">Upload Passport Photo</span>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="passport-upload"
      />
      <label
        htmlFor="passport-upload"
        className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-all text-sm"
      >
        {preview ? 'Change Photo' : 'Upload Photo'}
      </label>
    </div>
  );
}