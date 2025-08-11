import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TreatmentData } from '@/types/clinicalTreatment';
import i18n from '@/i18n';
import { formatDate } from '@/utils/dateFormat';

interface ProtocolData {
  selectedAgents: any[];
  regimenName?: string;
  patientWeight?: number;
  emetogenicRisk?: string;
}

interface ClinicalTreatmentExportData extends TreatmentData {
  elementId: string;
  orientation?: 'portrait' | 'landscape';
}

export const generateClinicalTreatmentPDF = async (
  treatmentData: ClinicalTreatmentExportData
): Promise<void> => {
  try {
    // Create a temporary compact view for PDF export
    const compactElement = document.createElement('div');
    compactElement.innerHTML = `
      <div class="compact-treatment-sheet" style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.2; color: #000; background: #fff; padding: 0; margin: 0;">
        ${document.querySelector('.compact-treatment-sheet')?.innerHTML || 'Treatment data not available'}
      </div>
    `;
    document.body.appendChild(compactElement);

    const canvas = await html2canvas(compactElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: compactElement.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(treatmentData.orientation === 'landscape' ? 'l' : 'p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 15;

    // Add header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(i18n.t('pdf.headerTitle'), pdfWidth / 2, 10, { align: 'center' });
    
    // Add patient info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${i18n.t('pdf.patientName')} ${treatmentData.patient.fullName || i18n.t('compactSheet.na')}`, 10, 20);
    pdf.text(`${i18n.t('pdf.patientId')} ${treatmentData.patient.cnp}`, 80, 20);
    pdf.text(`${i18n.t('pdf.regimen')} ${treatmentData.regimen.name}`, 10, 26);
    pdf.text(`${i18n.t('pdf.cycle')} ${treatmentData.patient.cycleNumber}`, 80, 26);
    pdf.text(`${i18n.t('pdf.date')} ${formatDate(treatmentData.patient.treatmentDate)}`, 140, 26);
    if (treatmentData.patient.nextCycleDate) {
      pdf.text(`${i18n.t('pdf.nextCycleDate')} ${formatDate(treatmentData.patient.nextCycleDate)}`, 140, 20);
    }

    position = 30;

    // Add the main content
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight - position - 15;

    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 15;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20;
    }

    // Add footer with timestamp and page numbers
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString(i18n.language);
      pdf.text(`${i18n.t('pdf.generated')} ${timestamp}`, 10, pdfHeight - 5);
      pdf.text(i18n.t('pdf.pageOf', { page: i, count: pageCount }) as string, pdfWidth - 30, pdfHeight - 5);
      pdf.text(i18n.t('pdf.confidential'), pdfWidth / 2, pdfHeight - 5, { align: 'center' });
    }

    // Clean up temporary element
    document.body.removeChild(compactElement);

    // Save the PDF with clinical naming convention
    const filename = `treatment-protocol-${treatmentData.patient.cnp}-${treatmentData.regimen.name.toLowerCase().replace(/\s+/g, '-')}-cycle${treatmentData.patient.cycleNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating treatment protocol PDF:', error);
    throw new Error('Failed to generate treatment protocol PDF. Please try again.');
  }
};

export const generateProtocolPDF = async (
  protocolData: ProtocolData,
  elementId: string
): Promise<void> => {
  try {
    // Get the element to convert to PDF
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Protocol element not found');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Calculate dimensions
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10; // 10mm top margin

    // Add header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(i18n.t('pdf.premedHeaderTitle'), pdfWidth / 2, 15, { align: 'center' });
    
    if (protocolData.regimenName) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${i18n.t('pdf.regimen')} ${protocolData.regimenName}`, 10, 25);
    }

    position = 35;

    // Add the main content
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight - position - 10;

    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20;
    }

    // Add footer with timestamp
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString(i18n.language);
      pdf.text(`${i18n.t('pdf.generated')} ${timestamp}`, 10, pdfHeight - 5);
      pdf.text(i18n.t('pdf.pageOf', { page: i, count: pageCount }) as string, pdfWidth - 30, pdfHeight - 5);
    }

    // Save the PDF
    const filename = `premedication-protocol-${protocolData.regimenName?.toLowerCase().replace(/\s+/g, '-') || 'protocol'}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};