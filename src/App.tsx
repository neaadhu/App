import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ForgingCalculator from './components/ForgingCalculator';
import QueueManager, { QueueItem } from './components/QueueManager';
import { Calculator, Hammer } from 'lucide-react';

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

function App() {
  const [forgingResults, setForgingResults] = useState<ForgingResults | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const handleForgingResultsChange = (results: ForgingResults | null) => {
    setForgingResults(results);
  };

  const handleAddToQueue = (item: Omit<QueueItem, 'id' | 'timestamp'>) => {
    const newItem: QueueItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setQueue(prev => [...prev, newItem]);
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const handleClearQueue = () => {
    if (window.confirm('Are you sure you want to clear all calculations from the queue?')) {
      setQueue([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">

        <div className="space-y-8">
          {/* Forging Calculator */}
          <ForgingCalculator 
            onResultsChange={handleForgingResultsChange}
            onAddToQueue={handleAddToQueue}
          />
          
          {/* Current Calculation Summary */}
          {forgingResults && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calculator className="w-6 h-6 text-orange-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-800">Current Calculation Summary</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{forgingResults.inputWeight.toFixed(2)} kg</div>
                  <div className="text-sm text-gray-600">Input Weight Required</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{forgingResults.weight.toFixed(2)} kg</div>
                  <div className="text-sm text-gray-600">Finished Weight</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹{forgingResults.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Cost per Piece</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Queue Manager */}
          <QueueManager 
            queue={queue}
            onRemoveItem={handleRemoveFromQueue}
            onClearAll={handleClearQueue}
          />
        </div>
        
        {/* Company Information */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">About Scorpio Sealings Pvt Ltd</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Leading manufacturer of high-quality RTJ gaskets and sealing solutions. With over two decades of experience 
              in precision forging and machining, we deliver superior products that meet the most demanding industrial 
              applications. Our state-of-the-art manufacturing facility ensures consistent quality and timely delivery.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Quality Certified:</strong><br />
                ISO 9001:2015, API 6A
              </div>
              <div>
                <strong>Materials:</strong><br />
                SS304/316/316L, Carbon Steel, Inconel, Monel
              </div>
              <div>
                <strong>Delivery:</strong><br />
                Pan India & Export
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;