import React from 'react';

const NavLink: React.FC<{ href: string; children: React.ReactNode; }> = ({ href, children }) => (
  <a
    href={href}
    className={`px-3 py-2 text-sm font-medium transition-colors text-slate-600 hover:text-slate-900`}
  >
    {children}
  </a>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="#" className="flex items-center space-x-3">
              <span className="font-bold text-2xl text-slate-800 tracking-tight">
                InfoPop
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink href="#">Screener</NavLink>
              <NavLink href="#">Our Data</NavLink>
              <NavLink href="#">Pricing</NavLink>
              <NavLink href="#">Contact</NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};