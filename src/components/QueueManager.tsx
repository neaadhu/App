import React from 'react';
import { Trash2, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface QueueItem {
  id: string;
  timestamp: Date;
  partName: string;
  inputs: {
    od: number;
    id: number;
    height: number;
    density: number;
    rawPrice: number;
    cutting: number;
    forgingRate: number;
    heatRate: number;
    roughing: number;
  };
  results: {
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
  };
}

interface QueueManagerProps {
  queue: QueueItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

const QueueManager: React.FC<QueueManagerProps> = ({ queue, onRemoveItem, onClearAll }) => {
  const exportToExcel = () => {
    if (queue.length === 0) {
      alert('No items in queue to export');
      return;
    }

    // Prepare data for Excel
    const excelData = queue.map((item, index) => ({
      'S.No': index + 1,
      'Part Name': item.partName,
      'Timestamp': item.timestamp.toLocaleString(),
      'OD (mm)': item.inputs.od,
      'ID (mm)': item.inputs.id,
      'Height (mm)': item.inputs.height,
      'Density (g/cm³)': item.inputs.density,
      'Raw Price (₹/kg)': item.inputs.rawPrice,
      'Cutting Cost (₹)': item.inputs.cutting,
      'Forging Rate (₹/kg)': item.inputs.forgingRate,
      'Heat Rate (₹/kg)': item.inputs.heatRate,
      'Roughing Cost (₹)': item.inputs.roughing,
      'Volume (mm³)': item.results.volume.toFixed(2),
      'Finished Weight (kg)': item.results.weight.toFixed(2),
      'Input Weight (kg)': item.results.inputWeight.toFixed(2),
      'Material Cost (₹)': item.results.materialCost.toFixed(2),
      'Cutting Cost Total (₹)': item.results.cuttingCost.toFixed(2),
      'Forging Cost (₹)': item.results.forgingCost.toFixed(2),
      'Heat Treatment Cost (₹)': item.results.heatCost.toFixed(2),
      'Roughing Cost Total (₹)': item.results.roughingCost.toFixed(2),
      'Subtotal (₹)': item.results.subtotal.toFixed(2),
      'Overhead 15% (₹)': item.results.overhead.toFixed(2),
      'Total Cost (₹)': item.results.total.toFixed(2)
    }));

    // Create summary data
    const totalWeight = queue.reduce((sum, item) => sum + item.results.inputWeight, 0);
    const totalCost = queue.reduce((sum, item) => sum + item.results.total, 0);
    
    const summaryData = [
      { 'Summary': 'Total Parts', 'Value': queue.length },
      { 'Summary': 'Total Input Weight (kg)', 'Value': totalWeight.toFixed(2) },
      { 'Summary': 'Total Cost (₹)', 'Value': totalCost.toFixed(2) },
      { 'Summary': 'Average Cost per Part (₹)', 'Value': (totalCost / queue.length).toFixed(2) },
      { 'Summary': 'Export Date', 'Value': new Date().toLocaleString() }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add detailed calculations sheet
    const ws1 = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Detailed Calculations');
    
    // Add summary sheet
    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Summary');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `Scorpio_Forging_Calculations_${timestamp}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
  };

  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Calculation Queue</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No calculations in queue</p>
          <p className="text-sm">Add calculations to build your quotation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Calculation Queue ({queue.length} items)
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Working
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {queue.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{item.partName}</h4>
                <p className="text-sm text-gray-500">{item.timestamp.toLocaleString()}</p>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove from queue"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Dimensions:</span>
                <p className="font-medium">
                  OD: {item.inputs.od}mm<br />
                  ID: {item.inputs.id}mm<br />
                  H: {item.inputs.height}mm
                </p>
              </div>
              <div>
                <span className="text-gray-600">Material:</span>
                <p className="font-medium">
                  Density: {item.inputs.density} g/cm³<br />
                  Price: ₹{item.inputs.rawPrice}/kg
                </p>
              </div>
              <div>
                <span className="text-gray-600">Weight:</span>
                <p className="font-medium">
                  Finished: {item.results.weight.toFixed(2)} kg<br />
                  Input: {item.results.inputWeight.toFixed(2)} kg
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <p className="font-bold text-lg text-orange-600">
                  ₹{item.results.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-orange-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {queue.reduce((sum, item) => sum + item.results.inputWeight, 0).toFixed(2)} kg
            </div>
            <div className="text-sm text-gray-600">Total Input Weight</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {queue.reduce((sum, item) => sum + item.results.weight, 0).toFixed(2)} kg
            </div>
            <div className="text-sm text-gray-600">Total Finished Weight</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              ₹{queue.reduce((sum, item) => sum + item.results.total, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { QueueItem };
export default QueueManager;