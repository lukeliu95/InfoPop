import React, { useState, useRef } from 'react';
import { extractInfoFromImage } from '../services/geminiService';

interface SearchCardProps {
  onSearch: (companyName: string, companyAddress: string) => void;
  isLoading: boolean;
}

const SpinnerIcon: React.FC<{className?: string}> = ({ className = "-ml-1 mr-3 h-5 w-5 text-slate-600" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l1.414-1.414a1 1 0 01.707-.293H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        <path fillRule="evenodd" d="M10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);


export const SearchCard: React.FC<SearchCardProps> = ({ onSearch, isLoading }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(companyName, companyAddress);
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setExtractError(null);

    try {
        const base64String = await fileToBase64(file);
        const result = await extractInfoFromImage(base64String, file.type);
        
        if (result.company_name) {
            setCompanyName(result.company_name);
        }
        if (result.company_address) {
            setCompanyAddress(result.company_address);
        }

    } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setExtractError(message);
        setTimeout(() => setExtractError(null), 5000);
    } finally {
        setIsExtracting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };


  return (
    <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tighter mb-4">
            Company Information Screener
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">
            Enter a company name, or use your camera to scan a business card. Our AI will find its official website and summarize key information for you.
        </p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <label htmlFor="company-name" className="sr-only">
              Company Name
            </label>
            <div className="relative">
                <input
                  type="text"
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name (e.g., Apple Inc.)"
                  required
                  className="block w-full px-4 py-3 text-slate-900 bg-white/70 border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                        type="button"
                        onClick={handleIconClick}
                        disabled={isExtracting || isLoading}
                        className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 rounded-full disabled:cursor-not-allowed disabled:text-slate-300"
                        aria-label="Upload an image or use camera"
                    >
                       {isExtracting ? <SpinnerIcon className="h-5 w-5 text-slate-500" /> : <CameraIcon />}
                    </button>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture="environment"
            />
          </div>
          <div>
            <label htmlFor="company-address" className="sr-only">
              Company Address (Optional)
            </label>
            <input
              type="text"
              id="company-address"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Company Address (Optional)"
              className="block w-full px-4 py-3 text-slate-900 bg-white/70 border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
            />
          </div>
          {extractError && <p className="text-sm text-red-600">{`Image processing failed: ${extractError}`}</p>}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isExtracting}
              className="w-full sm:w-auto sm:px-10 flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-slate-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 mx-auto"
            >
              {isLoading ? <SpinnerIcon /> : null}
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};