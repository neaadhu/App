import React from 'react';
import { Settings, Calculator } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Settings className="w-8 h-8 text-blue-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Scorpio Sealings Pvt Ltd</h1>
              <p className="text-blue-200 text-sm">RTJ Gasket Price Calculator</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6" />
            <span className="text-lg font-semibold">Professional Quotation System</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;