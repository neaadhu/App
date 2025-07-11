import React, { useState, useEffect } from 'react';
import { Hammer, Info, Calculator, Plus, CheckCircle } from 'lucide-react';
import type { QueueItem } from './QueueManager';

interface ForgingData {
  od: number;
  id: number;
  height: number;
  density: number;
  rawPrice: number;
  cutting: number;
  forgingRate: number;
  heatRate: number;
  roughing: number;
}

interface ForgingResults {
  volume: number;
  weight: number;
  inputWeight: number;
  materialCost: number;
  cuttingCost: number;
  forgingCost: number;
  heatCost: number;
  roughingCost: number;
  subtotal: number;
  overhead: number;
  total: number;
}

interface ForgingCalculatorProps {
  onResultsChange: (results: ForgingResults | null) => void;
  onAddToQueue: (item: Omit<QueueItem, 'id' | 'timestamp'>) => void;
}

const ForgingCalculator: React.FC<ForgingCalculatorProps> = ({ onResultsChange, onAddToQueue }) => {
  const [partName, setPartName] = useState('');
  const [formData, setFormData] = useState<ForgingData>({
    od: 0,
    id: 0,
    height: 0,
    density: 8.0, // Default SS density
    rawPrice: 450, // Default SS304 price
    cutting: 200,
    forgingRate: 200,
    heatRate: 15,
    roughing: 350
  });

  const [results, setResults] = useState<ForgingResults | null>(null);
  const [showCalculation, setShowCalculation] = useState(true);
  const [addedToQueue, setAddedToQueue] = useState(false);

  const handleInputChange = (field: keyof ForgingData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateForging = () => {
    const { od, id, height, density, rawPrice, cutting, forgingRate, heatRate, roughing } = formData;
    
    if (od <= 0 || height <= 0) {
      setResults(null);
      onResultsChange(null);
      return;
    }

    // Volume calculation: π * (OD² - ID²) * Height / 4 (in mm³)
    const volume = (Math.PI * (Math.pow(od, 2) - Math.pow(id, 2)) * height) / 4;
    
    // Weight calculation: volume in cm³ * density / 1000 (to get kg), rounded to nearest 0.5
    const weight = Math.round(((volume / 1000 * density) / 1000) * 2) / 2;
    
    // Input weight: weight * 1.12 (12% heat loss) + 0.75 (cutting losses), rounded to nearest 0.5
    const inputWeight = Math.round((weight * 1.12 + 0.75) * 2) / 2;
    
    // Cost calculations
    const materialCost = inputWeight * rawPrice;
    const cuttingCost = cutting;
    const forgingCost = (inputWeight - 0.5) * forgingRate; // Subtract 0.5kg as per HTML logic
    const heatCost = inputWeight * 0.9 * heatRate; // 90% of input weight for heat treatment
    const roughingCost = roughing;
    
    const subtotal = materialCost + cuttingCost + forgingCost + heatCost + roughingCost;
    const overhead = subtotal * 0.15; // 15% overhead as per HTML
    const total = subtotal + overhead;

    const calculationResults: ForgingResults = {
      volume,
      weight,
      inputWeight,
      materialCost,
      cuttingCost,
      forgingCost,
      heatCost,
      roughingCost,
      subtotal,
      overhead,
      total
    };

    setResults(calculationResults);
    onResultsChange(calculationResults);
  };

  const handleAddToQueue = () => {
    if (!results) {
      alert('Please complete the calculation first');
      return;
    }

    if (!partName.trim()) {
      alert('Please enter a part name');
      return;
    }

    const queueItem: Omit<QueueItem, 'id' | 'timestamp'> = {
      partName: partName.trim(),
      inputs: { ...formData },
      results: { ...results }
    };

    onAddToQueue(queueItem);
    setAddedToQueue(true);
    
    // Reset the added feedback after 2 seconds
    setTimeout(() => setAddedToQueue(false), 2000);
  };
  useEffect(() => {
    calculateForging();
    setAddedToQueue(false); // Reset when inputs change
  }, [formData]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Hammer className="w-6 h-6 text-orange-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Forging Calculator</h2>
      </div>

      {/* Part Name Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Part Name/Description
        </label>
        <input
          type="text"
          value={partName}
          onChange={(e) => setPartName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter part name or description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dimensions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Dimensions (mm)</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Outer Diameter (OD)
              <div className="inline-flex items-center ml-2 group relative">
                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
                  Outer diameter of the forged component in mm
                </div>
              </div>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.od || ''}
              onChange={(e) => handleInputChange('od', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter OD in mm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Inner Diameter (ID)
              <div className="inline-flex items-center ml-2 group relative">
                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
                  Inner diameter of the forged component in mm (0 for solid parts)
                </div>
              </div>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.id || ''}
              onChange={(e) => handleInputChange('id', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter ID in mm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Height/Thickness
              <div className="inline-flex items-center ml-2 group relative">
                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
                  Height or thickness of the component in mm
                </div>
              </div>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.height || ''}
              onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter height in mm"
            />
          </div>
        </div>

        {/* Material Properties */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Material Properties</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Density (g/cm³)
              <div className="inline-flex items-center ml-2 group relative">
                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
                  Material density in grams per cubic centimeter
                </div>
              </div>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.density || ''}
              onChange={(e) => handleInputChange('density', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter density"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Raw Material Price (₹/kg)
              <div className="inline-flex items-center ml-2 group relative">
                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
                  Cost of raw material per kilogram
                </div>
              </div>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.rawPrice || ''}
              onChange={(e) => handleInputChange('rawPrice', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter raw price"
            />
          </div>
        </div>

        {/* Operation Costs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Operation Costs</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Cutting Cost (₹/piece)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.cutting || ''}
              onChange={(e) => handleInputChange('cutting', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter cutting cost"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Forging Rate (₹/kg)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.forgingRate || ''}
              onChange={(e) => handleInputChange('forgingRate', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter forging rate"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Heat Treatment Rate (₹/kg)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.heatRate || ''}
              onChange={(e) => handleInputChange('heatRate', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter heat treatment rate"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Roughing Cost (₹/piece)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.roughing || ''}
              onChange={(e) => handleInputChange('roughing', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter roughing cost"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calculator className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-800">Forging Calculation Results</h3>
            </div>
            <button
              onClick={() => setShowCalculation(!showCalculation)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {showCalculation ? 'Hide' : 'Show'} Details
            </button>
          </div>

          {showCalculation && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Volume</div>
                <div className="text-lg font-semibold text-gray-800">{results.volume.toFixed(2)} mm³</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Finished Weight</div>
                <div className="text-lg font-semibold text-gray-800">{results.weight.toFixed(2)} kg</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Input Weight</div>
                <div className="text-lg font-semibold text-gray-800">{results.inputWeight.toFixed(2)} kg</div>
                <div className="text-xs text-gray-500">Includes 12% heat loss + cutting losses</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Material Cost</div>
                <div className="text-lg font-semibold text-gray-800">₹{results.materialCost.toFixed(2)}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Cutting Cost</div>
                <div className="text-lg font-semibold text-gray-800">₹{results.cuttingCost.toFixed(2)}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Forging Cost</div>
                <div className="text-lg font-semibold text-gray-800">₹{results.forgingCost.toFixed(2)}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Heat Treatment</div>
                <div className="text-lg font-semibold text-gray-800">₹{results.heatCost.toFixed(2)}</div>
                <div className="text-xs text-gray-500">90% of input weight</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Roughing Cost</div>
                <div className="text-lg font-semibold text-gray-800">₹{results.roughingCost.toFixed(2)}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Overhead (15%)</div>
                <div className="text-lg font-semibold text-gray-800">₹{results.overhead.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">Total Forging Cost per Piece</span>
              <span className="font-bold text-2xl">₹{results.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-600 bg-white p-3 rounded-lg">
            <p><strong>Note:</strong> Calculation includes 12% heat loss and cutting losses in input weight calculation, as per standard forging practices.</p>
          </div>

          {/* Add to Queue Button */}
          <div className="mt-6">
            <button
              onClick={handleAddToQueue}
              disabled={!results || !partName.trim()}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                addedToQueue
                  ? 'bg-green-600 text-white'
                  : !results || !partName.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {addedToQueue ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Added to Queue!
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Queue
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgingCalculator;