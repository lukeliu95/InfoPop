import React, { useState } from 'react';

interface SearchCardProps {
  onSearch: (companyName: string, companyAddress: string) => void;
  isLoading: boolean;
}

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const SearchCard: React.FC<SearchCardProps> = ({ onSearch, isLoading }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(companyName, companyAddress);
  };

  return (
    <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tighter mb-4">
            Company Information Screener
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">
            Enter a company name and our AI will find its official website and summarize key information for you.
        </p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <label htmlFor="company-name" className="sr-only">
              Company Name
            </label>
            <input
              type="text"
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name (e.g., Apple Inc.)"
              required
              className="block w-full px-4 py-3 text-slate-900 bg-white/70 border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
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
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
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