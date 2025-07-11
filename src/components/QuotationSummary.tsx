import React from 'react';
import { FileText, Download, Mail, Printer } from 'lucide-react';

interface QuotationData {
  materialGrade: string;
  rtjSize: string;
  quantity: number;
  deliveryTimeline: string;
  totalAmount: number;
  deliveryDate: string;
  quotationNumber: string;
}

interface QuotationSummaryProps {
  data: QuotationData;
  onDownload: () => void;
  onEmail: () => void;
  onPrint: () => void;
}

const QuotationSummary: React.FC<QuotationSummaryProps> = ({ 
  data, 
  onDownload, 
  onEmail, 
  onPrint 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">Quotation Summary</h3>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Quotation No:</span>
            <p className="font-semibold">{data.quotationNumber}</p>
          </div>
          <div>
            <span className="text-gray-600">Date:</span>
            <p className="font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-600">Material Grade:</span>
            <p className="font-semibold">{data.materialGrade}</p>
          </div>
          <div>
            <span className="text-gray-600">RTJ Size:</span>
            <p className="font-semibold">{data.rtjSize}</p>
          </div>
          <div>
            <span className="text-gray-600">Quantity:</span>
            <p className="font-semibold">{data.quantity} pieces</p>
          </div>
          <div>
            <span className="text-gray-600">Delivery:</span>
            <p className="font-semibold">{data.deliveryTimeline}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-green-600">₹{data.totalAmount.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Expected Delivery: {data.deliveryDate}</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onDownload}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
        
        <button
          onClick={onEmail}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Quote
        </button>
        
        <button
          onClick={onPrint}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 border-t pt-4">
        <p><strong>Terms & Conditions:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Prices are valid for 30 days from quotation date</li>
          <li>Payment terms: 50% advance, 50% before dispatch</li>
          <li>Delivery timeline may vary based on material availability</li>
          <li>All prices are inclusive of GST</li>
        </ul>
      </div>
    </div>
  );
};

export default QuotationSummary;