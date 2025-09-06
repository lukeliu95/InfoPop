import React from 'react';
import type { CompanyInfo } from '../types';

interface ResultCardProps {
  result: CompanyInfo | null;
  isLoading: boolean;
  error: string | null;
}

const ResultSkeleton: React.FC = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="animate-pulse">
            <div className="px-4 py-5 sm:px-6">
                <div className="h-6 bg-slate-200 rounded w-3/5 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-2/5"></div>
            </div>
            <div className="border-t border-slate-200">
                <div className="divide-y divide-slate-200">
                    {/* Skeleton for introduction */}
                    <div className="px-4 py-5 sm:px-6">
                        <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
                        <div className="space-y-2 mt-2">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                        </div>
                    </div>

                    {/* Skeleton for details list */}
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="px-4 py-4 sm:px-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                                <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const InfoItem: React.FC<{ label: string; value?: string | null; children?: React.ReactNode }> = ({ label, value, children }) => {
  const content = children || value;
  if (!content || content === '-') {
    return null;
  }
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0 break-words">{content}</dd>
    </div>
  );
};


export const ResultCard: React.FC<ResultCardProps> = ({ result, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <ResultSkeleton />;
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Query Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-white">
            <h2 className="text-xl leading-6 font-bold text-slate-900">
                {result.company_name}
            </h2>
            {result.furigana && result.furigana !== '-' && <p className="mt-1 max-w-2xl text-sm text-slate-500">{result.furigana}</p>}
        </div>
        <div className="border-t border-slate-200">
            <dl className="divide-y divide-slate-200">
                {result.introduction && result.introduction !== '-' && (
                    <div className="px-4 py-5 sm:px-6">
                        <dt className="text-base font-semibold text-slate-900">Company Introduction</dt>
                        <dd className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{result.introduction}</dd>
                    </div>
                )}
                <div className="px-4 sm:px-6">
                    <InfoItem label="URL">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-black break-all underline decoration-dotted">
                            {result.url}
                        </a>
                    </InfoItem>
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Address" value={result.address} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Industry" value={result.industry} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Representative" value={result.representative_name} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Founded" value={result.founded_date} />
                </div>
                 <div className="px-4 sm:px-6">
                    <InfoItem label="Capital" value={result.capital} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Employees" value={result.employee_count} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Phone Number" value={result.phone_number} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Listing Status" value={result.listing_status} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Stock Code" value={result.stock_code} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Corporate Number" value={result.corporate_number} />
                </div>
                <div className="px-4 sm:px-6">
                    <InfoItem label="Invoice Number" value={result.invoice_registration_number} />
                </div>
            </dl>
        </div>
      </div>
    );
  };
  
  return (
    <div>
        {renderContent()}
    </div>
  );
};