import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProtocolData {
  selectedAgents: any[];
  regimenName?: string;
  patientWeight?: number;
  emetogenicRisk?: string;
}

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
    pdf.text('Chemotherapy Premedication Protocol', pdfWidth / 2, 15, { align: 'center' });
    
    if (protocolData.regimenName) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Regimen: ${protocolData.regimenName}`, 10, 25);
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
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated: ${timestamp}`, 10, pdfHeight - 5);
      pdf.text(`Page ${i} of ${pageCount}`, pdfWidth - 30, pdfHeight - 5);
    }

    // Save the PDF
    const filename = `premedication-protocol-${protocolData.regimenName?.toLowerCase().replace(/\s+/g, '-') || 'protocol'}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};