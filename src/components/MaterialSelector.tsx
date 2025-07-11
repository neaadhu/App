import React from 'react';
import { Info } from 'lucide-react';

interface MaterialSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const materials = [
  { code: 'SS304', name: 'Stainless Steel 304', density: 8.0, basePrice: 450 },
  { code: 'SS316', name: 'Stainless Steel 316', density: 8.0, basePrice: 650 },
  { code: 'SS316L', name: 'Stainless Steel 316L', density: 8.0, basePrice: 680 },
  { code: 'CS', name: 'Carbon Steel', density: 7.85, basePrice: 120 },
  { code: 'INCONEL625', name: 'Inconel 625', density: 8.44, basePrice: 2800 },
  { code: 'MONEL400', name: 'Monel 400', density: 8.83, basePrice: 1200 },
];

const MaterialSelector: React.FC<MaterialSelectorProps> = ({ value, onChange }) => {
  const selectedMaterial = materials.find(m => m.code === value);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Material Grade
        <div className="inline-flex items-center ml-2 group relative">
          <Info className="w-4 h-4 text-blue-500 cursor-help" />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
            Select the material grade for your RTJ gasket
          </div>
        </div>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="">Select Material Grade</option>
        {materials.map((material) => (
          <option key={material.code} value={material.code}>
            {material.code} - {material.name}
          </option>
        ))}
      </select>
      {selectedMaterial && (
        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
          <p><strong>Density:</strong> {selectedMaterial.density} g/cm³</p>
          <p><strong>Base Price:</strong> ₹{selectedMaterial.basePrice}/kg</p>
        </div>
      )}
    </div>
  );
};

export { materials };
export default MaterialSelector;