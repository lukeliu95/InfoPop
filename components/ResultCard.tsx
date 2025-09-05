import React from 'react';
import type { CompanyInfo } from '../types';

interface ResultCardProps {
  result: CompanyInfo | null;
  isLoading: boolean;
  error: string | null;
}

const ResultSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-8 p-2">
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
    </div>
    <hr className="border-slate-200"/>
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="h-5 bg-slate-200 rounded w-full"></div>
      <div className="h-5 bg-slate-200 rounded w-5/6"></div>
    </div>
    <hr className="border-slate-200"/>
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="h-5 bg-slate-200 rounded w-full"></div>
      <div className="h-5 bg-slate-200 rounded w-full"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
    </div>
  </div>
);

const ResultSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{title}</h3>
    <div className="text-slate-700 leading-relaxed text-base">{children}</div>
  </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({ result, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <ResultSkeleton />;
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-red-800">Query Failed</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="text-center py-10 text-slate-400">
            <p>Results will be displayed here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <ResultSection title="Official URL">
          <a href={result.company_url} target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-black break-all underline decoration-dotted">
            {result.company_url}
          </a>
        </ResultSection>
        <hr className="border-slate-200"/>
        <ResultSection title="Summary">
          <p>{result.summary}</p>
        </ResultSection>
        <hr className="border-slate-200"/>
        <ResultSection title="Detailed Overview">
          <p className="whitespace-pre-wrap">{result.overview}</p>
        </ResultSection>
      </div>
    );
  };
  
  return (
    <div>
        {renderContent()}
    </div>
  );
};