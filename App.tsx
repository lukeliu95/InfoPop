import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchCard } from './components/SearchCard';
import { ResultCard } from './components/ResultCard';
import { fetchCompanyInfo } from './services/geminiService';
import type { CompanyInfo } from './types';

const App: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (companyName: string, companyAddress: string) => {
    if (!companyName) {
      setError("Company name is required.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setCompanyInfo(null);

    try {
      const result = await fetchCompanyInfo(companyName, companyAddress);
      setCompanyInfo(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
            <SearchCard onSearch={handleSearch} isLoading={isLoading} />
            <div className="mt-12">
                <ResultCard result={companyInfo} isLoading={isLoading} error={error} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;