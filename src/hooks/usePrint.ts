import { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePrint = (documentTitle?: string) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: documentTitle || `Clinical Treatment Protocol - ${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          font-size: 12px;
          line-height: 1.4;
        }
        .print\\:hidden {
          display: none !important;
        }
        .print\\:block {
          display: block !important;
        }
        .print\\:text-foreground {
          color: #000 !important;
        }
        .print\\:bg-background {
          background-color: #fff !important;
        }
        .print\\:border-border {
          border-color: #333 !important;
        }
        .print\\:shadow-none {
          box-shadow: none !important;
        }
        .print\\:text-xs {
          font-size: 10px !important;
        }
        .print\\:text-sm {
          font-size: 11px !important;
        }
        .print\\:text-base {
          font-size: 12px !important;
        }
        .print\\:text-lg {
          font-size: 13px !important;
        }
        .print\\:text-xl {
          font-size: 14px !important;
        }
        .print\\:text-2xl {
          font-size: 16px !important;
        }
        .print\\:mb-2 {
          margin-bottom: 8px !important;
        }
        .print\\:mb-4 {
          margin-bottom: 16px !important;
        }
        .print\\:mt-4 {
          margin-top: 16px !important;
        }
        .print\\:mt-6 {
          margin-top: 24px !important;
        }
        .print\\:space-y-2 > * + * {
          margin-top: 8px !important;
        }
        .print\\:space-y-3 > * + * {
          margin-top: 12px !important;
        }
        .print\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .print\\:grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        }
        .print\\:gap-2 {
          gap: 8px !important;
        }
        .print\\:border-l-2 {
          border-left-width: 2px !important;
        }
        .print\\:border {
          border-width: 1px !important;
        }
        .print\\:text-left {
          text-align: left !important;
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