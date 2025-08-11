import { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePrint = (documentTitle?: string, options?: { orientation?: 'portrait' | 'landscape' }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const orientation = options?.orientation ?? 'portrait';

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: documentTitle || `Clinical Treatment Protocol - ${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4 ${orientation === 'landscape' ? 'landscape' : 'portrait'};
        margin: 12mm 10mm;
      }
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          font-family: 'Arial', 'Helvetica', sans-serif !important;
          font-size: 11pt !important;
          line-height: 1.2 !important;
          color: #000 !important;
          background: #fff !important;
        }
        
        .compact-treatment-sheet {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Hide elements not needed for print */
        .print\\:hidden {
          display: none !important;
        }
        .print\\:block {
          display: block !important;
        }
        
        /* Text and Background Colors */
        .print\\:text-black {
          color: #000 !important;
        }
        .print\\:bg-white {
          background-color: #fff !important;
        }
        .print\\:bg-gray-50 {
          background-color: #f9f9f9 !important;
        }
        .print\\:bg-gray-100 {
          background-color: #f3f3f3 !important;
        }
        .print\\:bg-gray-200 {
          background-color: #e5e5e5 !important;
        }
        .print\\:text-gray-600 {
          color: #666 !important;
        }
        
        /* Borders */
        .print\\:border-black {
          border-color: #000 !important;
        }
        .print\\:border {
          border-width: 1px !important;
        }
        .print\\:border-l-4 {
          border-left-width: 4px !important;
        }
        
        /* Typography */
        .print\:text-xs {
          font-size: 10pt !important;
          line-height: 1.1 !important;
        }
        .print\:text-sm {
          font-size: 11pt !important;
          line-height: 1.2 !important;
        }
        .print\:text-base {
          font-size: 12pt !important;
          line-height: 1.2 !important;
        }
        .print\\:leading-tight {
          line-height: 1.1 !important;
        }
        
        /* Spacing */
        .print\\:mb-1 {
          margin-bottom: 2px !important;
        }
        .print\\:mb-2 {
          margin-bottom: 4px !important;
        }
        .print\\:mb-3 {
          margin-bottom: 6px !important;
        }
        .print\\:mt-1 {
          margin-top: 2px !important;
        }
        .print\\:mt-3 {
          margin-top: 6px !important;
        }
        .print\\:pt-1 {
          padding-top: 2px !important;
        }
        .print\\:px-1 {
          padding-left: 2px !important;
          padding-right: 2px !important;
        }
        .print\\:px-2 {
          padding-left: 4px !important;
          padding-right: 4px !important;
        }
        .print\\:py-0\\.5 {
          padding-top: 1px !important;
          padding-bottom: 1px !important;
        }
        .print\\:py-1 {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
        .print\\:py-2 {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }
        .print\\:gap-1 {
          gap: 2px !important;
        }
        .print\\:max-w-none {
          max-width: none !important;
        }
        
        /* Remove shadows and other effects */
        .print\\:shadow-none {
          box-shadow: none !important;
        }
        
        /* Ensure tables print properly */
        table {
          border-collapse: collapse !important;
          width: 100% !important;
          page-break-inside: auto !important;
        }
        
        thead {
          display: table-header-group !important;
        }
        
        tr {
          page-break-inside: avoid !important;
        }
        
        /* Prevent page breaks in critical sections */
        .no-break {
          page-break-inside: avoid !important;
        }
        
        /* Badge styling for print */
        .badge {
          border: 1px solid #000 !important;
          padding: 1px 3px !important;
          font-size: 7px !important;
          background: #fff !important;
          color: #000 !important;
        }
      }
    `,
    onAfterPrint: () => {
      console.log('Print completed');
    },
  });

  const printProtocol = useCallback(() => {
    if (!componentRef.current) {
      console.error('No printable content found');
      return;
    }
    handlePrint();
  }, [handlePrint]);

  const printTreatmentSheet = useCallback(() => {
    if (!componentRef.current) {
      console.error('No printable content found');
      return;
    }
    handlePrint();
  }, [handlePrint]);

  return {
    componentRef,
    printProtocol,
    printTreatmentSheet,
  };
};