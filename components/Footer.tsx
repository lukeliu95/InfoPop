import React from 'react';

// Manually update these values to reflect the latest GitHub version and commit date.
const GITHUB_VERSION = 'v0.5';
const GITHUB_TIMESTAMP = '2025-09-06';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>
          InfoPop Screener &copy; {new Date().getFullYear()} | Version: {GITHUB_VERSION} ({GITHUB_TIMESTAMP})
        </p>
      </div>
    </footer>
  );
};