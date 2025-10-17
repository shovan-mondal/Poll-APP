
import React, { useRef } from 'react';

interface ImageUploaderProps {
  index: number;
  option: { caption: string; image: string | null };
  onChange: (index: number, option: { caption: string; image: string | null }) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ index, option, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(index, { ...option, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...option, caption: e.target.value });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
      <div className="flex items-center space-x-4">
        <div 
          className="w-24 h-24 rounded-md bg-gray-700 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-500 hover:border-cyan-500"
          onClick={triggerFileInput}
        >
          {option.image ? (
            <img src={option.image} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-sm text-center">Tap to add image</span>
          )}
        </div>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
        <input
          type="text"
          value={option.caption}
          onChange={handleCaptionChange}
          placeholder={`Option ${index + 1} Caption`}
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
    </div>
  );
};

export default ImageUploader;
