import React from 'react';
import { Info } from 'lucide-react';

interface RTJSizeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const rtjSizes = [
  { code: 'R11', od: 34.9, id: 15.7, groove: 'Octagonal' },
  { code: 'R12', od: 42.9, id: 20.6, groove: 'Octagonal' },
  { code: 'R13', od: 50.8, id: 26.7, groove: 'Octagonal' },
  { code: 'R14', od: 57.2, id: 31.8, groove: 'Octagonal' },
  { code: 'R15', od: 63.5, id: 37.3, groove: 'Octagonal' },
  { code: 'R16', od: 69.9, id: 42.9, groove: 'Octagonal' },
  { code: 'R17', od: 76.2, id: 48.3, groove: 'Octagonal' },
  { code: 'R18', od: 88.9, id: 60.3, groove: 'Octagonal' },
  { code: 'R19', od: 101.6, id: 73.0, groove: 'Octagonal' },
  { code: 'R20', od: 114.3, id: 85.7, groove: 'Octagonal' },
  { code: 'R23', od: 139.7, id: 111.1, groove: 'Octagonal' },
  { code: 'R26', od: 168.3, id: 139.7, groove: 'Octagonal' },
  { code: 'R27', od: 177.8, id: 149.2, groove: 'Octagonal' },
  { code: 'R31', od: 215.9, id: 187.3, groove: 'Octagonal' },
  { code: 'R35', od: 254.0, id: 225.4, groove: 'Octagonal' },
  { code: 'R37', od: 279.4, id: 250.8, groove: 'Octagonal' },
  { code: 'R42', od: 323.8, id: 295.3, groove: 'Octagonal' },
  { code: 'R46', od: 368.3, id: 339.7, groove: 'Octagonal' },
  { code: 'R50', od: 419.1, id: 390.5, groove: 'Octagonal' },
];

const RTJSizeSelector: React.FC<RTJSizeSelectorProps> = ({ value, onChange }) => {
  const selectedSize = rtjSizes.find(s => s.code === value);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        RTJ Gasket Size
        <div className="inline-flex items-center ml-2 group relative">
          <Info className="w-4 h-4 text-blue-500 cursor-help" />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
            Standard RTJ gasket sizes as per ASME B16.20
          </div>
        </div>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="">Select RTJ Size</option>
        {rtjSizes.map((size) => (
          <option key={size.code} value={size.code}>
            {size.code} - OD: {size.od}mm, ID: {size.id}mm
          </option>
        ))}
      </select>
      {selectedSize && (
        <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
          <p><strong>Outer Diameter:</strong> {selectedSize.od} mm</p>
          <p><strong>Inner Diameter:</strong> {selectedSize.id} mm</p>
          <p><strong>Groove Type:</strong> {selectedSize.groove}</p>
        </div>
      )}
    </div>
  );
};

export { rtjSizes };
export default RTJSizeSelector;