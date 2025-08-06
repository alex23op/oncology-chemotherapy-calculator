import { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePrint = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Premedication Protocol - ${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .print\\:hidden {
          display: none !important;
        }
        .print\\:block {
          display: block !important;
        }
        .print\\:text-black {
          color: black !important;
        }
        .print\\:bg-white {
          background-color: white !important;
        }
        .print\\:border-gray-300 {
          border-color: #d1d5db !important;
        }
        .print\\:shadow-none {
          box-shadow: none !important;
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

  return {
    componentRef,
    printProtocol,
  };
};