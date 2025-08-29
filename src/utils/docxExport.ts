import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, TextRun } from 'docx';
import { TreatmentData } from '@/types/clinicalTreatment';
import i18n from '@/i18n';
import { formatDate, toLocalISODate } from '@/utils/dateFormat';
import { logger } from '@/utils/logger';

interface ClinicalTreatmentExportData extends TreatmentData {
  orientation?: 'portrait' | 'landscape';
}

export const generateClinicalTreatmentDOCX = async (
  treatmentData: ClinicalTreatmentExportData
): Promise<void> => {
  try {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              orientation: treatmentData.orientation === 'landscape' ? 'landscape' : 'portrait',
            },
          },
        },
        children: [
          // Header
          new Paragraph({
            text: i18n.t('docx.headerTitle'),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          
          // Patient Information
          new Paragraph({
            children: [
              new TextRun({ text: `${i18n.t('docx.patientName')} `, bold: true }),
              new TextRun({ text: treatmentData.patient.fullName || i18n.t('compactSheet.na') }),
              new TextRun({ text: `     ${i18n.t('docx.patientId')} `, bold: true }),
              new TextRun({ text: treatmentData.patient.cnp }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: `${i18n.t('docx.regimen')} `, bold: true }),
              new TextRun({ text: treatmentData.regimen.name }),
              new TextRun({ text: `     ${i18n.t('docx.cycle')} `, bold: true }),
              new TextRun({ text: treatmentData.patient.cycleNumber.toString() }),
              new TextRun({ text: `     ${i18n.t('docx.date')} `, bold: true }),
              new TextRun({ text: formatDate(treatmentData.patient.treatmentDate) }),
            ],
          }),

          ...(treatmentData.patient.nextCycleDate ? [
            new Paragraph({
              children: [
                new TextRun({ text: `${i18n.t('docx.nextCycleDate')} `, bold: true }),
                new TextRun({ text: formatDate(treatmentData.patient.nextCycleDate) }),
              ],
            }),
          ] : []),

          ...(treatmentData.patient.foNumber ? [
            new Paragraph({
              children: [
                new TextRun({ text: `${i18n.t('docx.foNumber')} `, bold: true }),
                new TextRun({ text: treatmentData.patient.foNumber }),
              ],
            }),
          ] : []),

          new Paragraph({ text: '' }), // Empty line

          // Premedications Section
          ...(hasPremedications(treatmentData) ? [
            new Paragraph({
              text: i18n.t('compactSheet.premedications'),
              heading: HeadingLevel.HEADING_2,
            }),
            createPremedsTable(treatmentData),
            new Paragraph({ text: '' }), // Empty line
          ] : []),

          // Chemotherapy Section
          new Paragraph({
            text: i18n.t('compactSheet.chemotherapy'),
            heading: HeadingLevel.HEADING_2,
          }),
          createChemotherapyTable(treatmentData),

          // Clinical Notes
          ...(treatmentData.clinicalNotes ? [
            new Paragraph({ text: '' }), // Empty line
            new Paragraph({
              text: i18n.t('compactSheet.clinicalNotes'),
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              text: treatmentData.clinicalNotes,
            }),
          ] : []),

          // Footer
          new Paragraph({ text: '' }), // Empty line
          new Paragraph({
            children: [
              new TextRun({ text: `${i18n.t('docx.generated')} `, bold: true }),
              new TextRun({ text: new Date().toLocaleString(i18n.language) }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: i18n.t('docx.confidential'),
            alignment: AlignmentType.CENTER,
            style: 'italic',
          }),
        ],
      }],
    });

    // Generate and download the document
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    
    const filename = `treatment-protocol-${treatmentData.patient.cnp}-${treatmentData.regimen.name.toLowerCase().replace(/\s+/g, '-')}-cycle${treatmentData.patient.cycleNumber}-${toLocalISODate(new Date())}.docx`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    logger.error('Error generating treatment protocol DOCX', { component: 'docxExport', error });
    throw new Error('Failed to generate treatment protocol DOCX. Please try again.');
  }
};

function hasPremedications(treatmentData: TreatmentData): boolean {
  const allPremedications = [
    ...treatmentData.premedications.antiemetics,
    ...treatmentData.premedications.infusionReactionProphylaxis,
    ...treatmentData.premedications.gastroprotection,
    ...treatmentData.premedications.organProtection,
    ...treatmentData.premedications.other,
  ];

  return allPremedications.length > 0 || (treatmentData.solventGroups?.groups.length ?? 0) > 0;
}

function createPremedsTable(treatmentData: TreatmentData): Table {
  const allPremedications = [
    ...treatmentData.premedications.antiemetics,
    ...treatmentData.premedications.infusionReactionProphylaxis,
    ...treatmentData.premedications.gastroprotection,
    ...treatmentData.premedications.organProtection,
    ...treatmentData.premedications.other,
  ];

  const rows: TableRow[] = [
    // Header row
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'MEDICAMENT', style: 'bold' })],
          width: { size: 40, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'DOZĂ', style: 'bold' })],
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'NOTE', style: 'bold' })],
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
  ];

  // Add solvent groups
  if (treatmentData.solventGroups?.groups) {
    treatmentData.solventGroups.groups.forEach(group => {
      group.medications.forEach(med => {
        rows.push(createPremedRow(med));
      });
    });
  }

  // Add individual premedications
  allPremedications.forEach(med => {
    rows.push(createPremedRow(med));
  });

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function createPremedRow(med: any): TableRow {
  const doseText = med.unitCount && med.unitType 
    ? `${med.unitCount} ${med.unitType}`
    : `${med.dosage} ${med.unit}`;

  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ text: med.name })],
      }),
      new TableCell({
        children: [new Paragraph({ text: doseText })],
      }),
      new TableCell({
        children: [new Paragraph({ text: med.userNotes || '' })],
      }),
    ],
  });
}

function createChemotherapyTable(treatmentData: TreatmentData): Table {
  const rows: TableRow[] = [
    // Header row
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'MEDICAMENT', style: 'bold' })],
          width: { size: 40, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'DOZĂ', style: 'bold' })],
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'NOTE', style: 'bold' })],
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
  ];

  // Add chemotherapy drugs
  treatmentData.calculatedDrugs.forEach(drug => {
    rows.push(new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: drug.name })],
        }),
        new TableCell({
          children: [new Paragraph({ text: `${drug.finalDose} mg` })],
        }),
        new TableCell({
          children: [new Paragraph({ text: drug.solvent || '-' })],
        }),
      ],
    }));
  });

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}