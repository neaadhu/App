import React from 'react';
import { Calculator, Package, Clock, IndianRupee } from 'lucide-react';

interface CalculationData {
  materialCost: number;
  forgingCost: number;
  overheadCost: number;
  subtotal: number;
  gst: number;
  totalWithGST: number;
  weight: number;
  deliveryDate: string;
}

interface CalculationResultsProps {
  data: CalculationData;
  isVisible: boolean;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({ data, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-lg">
      <div className="flex items-center mb-4">
        <Calculator className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">Calculation Results</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Raw Material Cost</span>
              <span className="font-semibold text-gray-800">₹{data.materialCost.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Forging Operation Cost</span>
              <span className="font-semibold text-gray-800">₹{data.forgingCost.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overhead Charges (15%)</span>
              <span className="font-semibold text-gray-800">₹{data.overheadCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal (Before GST)</span>
              <span className="font-bold text-lg text-gray-800">₹{data.subtotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-semibold text-gray-800">₹{data.gst.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                <span className="font-bold">Total Amount</span>
              </div>
              <span className="font-bold text-xl">₹{data.totalWithGST.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <Package className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <span className="text-sm text-gray-600">Estimated Weight</span>
            <p className="font-semibold">{data.weight.toFixed(3)} kg</p>
          </div>
        </div>
        
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <Clock className="w-5 h-5 text-green-600 mr-2" />
          <div>
            <span className="text-sm text-gray-600">Estimated Delivery</span>
            <p className="font-semibold">{data.deliveryDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationResults;