import { Drug, Regimen } from '@/types/regimens';
import { PatientInfo } from '@/types/clinicalTreatment';
import { ClinicalData } from '@/types/enhanced';

export interface SafetyAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  type: 'contraindication' | 'interaction' | 'prerequisite' | 'monitoring' | 'dosing';
  title: string;
  message: string;
  recommendation: string;
  canOverride: boolean;
  requiresJustification: boolean;
  references?: string[];
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'major' | 'moderate' | 'minor';
  mechanism: string;
  effect: string;
  management: string;
  references: string[];
}

export interface ContraindicationRule {
  drug: string;
  condition: string;
  severity: 'absolute' | 'relative';
  description: string;
  alternative?: string;
}

export interface BiomarkerPrerequisite {
  drug: string;
  biomarker: string;
  requiredStatus: string[];
  description: string;
  testingMethod?: string;
}

// Drug interaction database
const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    drug1: 'Warfarin',
    drug2: '5-Fluorouracil',
    severity: 'major',
    mechanism: 'Metabolic inhibition',
    effect: 'Increased anticoagulation effect, bleeding risk',
    management: 'Monitor INR closely, consider dose reduction',
    references: ['Chest 2012;141:e44S-e88S']
  },
  {
    drug1: 'Phenytoin',
    drug2: '5-Fluorouracil',
    severity: 'moderate',
    mechanism: 'Metabolic inhibition',
    effect: 'Increased phenytoin levels, potential toxicity',
    management: 'Monitor phenytoin levels, adjust dose as needed',
    references: ['Cancer Chemother Pharmacol 1990;26:392-394']
  },
  {
    drug1: 'Cisplatin',
    drug2: 'Aminoglycosides',
    severity: 'major',
    mechanism: 'Additive nephrotoxicity',
    effect: 'Increased risk of acute kidney injury',
    management: 'Avoid concurrent use, monitor renal function',
    references: ['Kidney Int 2008;74:1385-1393']
  }
];

// Contraindication rules
const CONTRAINDICATIONS: ContraindicationRule[] = [
  {
    drug: 'Doxorubicin',
    condition: 'baseline_ejection_fraction_low',
    severity: 'absolute',
    description: 'Baseline LVEF <50% is an absolute contraindication',
    alternative: 'Consider liposomal doxorubicin or non-anthracycline regimen'
  },
  {
    drug: 'Cisplatin',
    condition: 'severe_renal_impairment',
    severity: 'absolute',
    description: 'CrCl <60 mL/min increases nephrotoxicity risk',
    alternative: 'Consider carboplatin substitution'
  },
  {
    drug: 'Trastuzumab',
    condition: 'her2_negative',
    severity: 'absolute',
    description: 'HER2-negative status - no therapeutic benefit',
    alternative: 'Select HER2-negative appropriate regimen'
  }
];

// Biomarker prerequisites
const BIOMARKER_PREREQUISITES: BiomarkerPrerequisite[] = [
  {
    drug: 'Trastuzumab',
    biomarker: 'HER2',
    requiredStatus: ['positive', 'amplified'],
    description: 'HER2 amplification required for trastuzumab efficacy'
  },
  {
    drug: 'Cetuximab',
    biomarker: 'RAS',
    requiredStatus: ['wild-type'],
    description: 'RAS wild-type required for EGFR inhibitor efficacy'
  },
  {
    drug: 'Pembrolizumab',
    biomarker: 'PD-L1',
    requiredStatus: ['high'],
    description: 'PD-L1 expression ≥50% recommended for monotherapy'
  },
  {
    drug: 'Olaparib',
    biomarker: 'BRCA',
    requiredStatus: ['mutated'],
    description: 'BRCA mutation required for PARP inhibitor efficacy'
  }
];

export class ClinicalSafetyEngine {
  
  /**
   * Check for drug interactions in a regimen
   */
  static checkDrugInteractions(drugs: Drug[], currentMedications: string[] = []): SafetyAlert[] {
    const alerts: SafetyAlert[] = [];
    const allDrugs = [...drugs.map(d => d.name), ...currentMedications];
    
    // Check interactions between regimen drugs
    for (let i = 0; i < allDrugs.length; i++) {
      for (let j = i + 1; j < allDrugs.length; j++) {
        const interaction = DRUG_INTERACTIONS.find(
          int => (int.drug1 === allDrugs[i] && int.drug2 === allDrugs[j]) ||
                 (int.drug1 === allDrugs[j] && int.drug2 === allDrugs[i])
        );
        
        if (interaction) {
          alerts.push({
            id: `interaction_${i}_${j}`,
            severity: interaction.severity === 'major' ? 'critical' : 
                     interaction.severity === 'moderate' ? 'warning' : 'info',
            type: 'interaction',
            title: `Drug Interaction: ${interaction.drug1} + ${interaction.drug2}`,
            message: `${interaction.effect}. Mechanism: ${interaction.mechanism}`,
            recommendation: interaction.management,
            canOverride: interaction.severity !== 'major',
            requiresJustification: true,
            references: interaction.references
          });
        }
      }
    }
    
    return alerts;
  }

  /**
   * Check contraindications based on patient data
   */
  static checkContraindications(drugs: Drug[], patient: PatientInfo, clinicalData: ClinicalData = {}): SafetyAlert[] {
    const alerts: SafetyAlert[] = [];
    
    drugs.forEach(drug => {
      const contraindications = CONTRAINDICATIONS.filter(c => c.drug === drug.name);
      
      contraindications.forEach(contra => {
        let isContraindicated = false;
        
        switch (contra.condition) {
          case 'severe_renal_impairment':
            isContraindicated = patient.creatinineClearance < 60;
            break;
          case 'baseline_ejection_fraction_low':
            isContraindicated = (clinicalData as any).ejectionFraction && (clinicalData as any).ejectionFraction < 50;
            break;
          case 'her2_negative':
            isContraindicated = (clinicalData as any).her2Status === 'negative';
            break;
          default:
            break;
        }
        
        if (isContraindicated) {
          alerts.push({
            id: `contraindication_${drug.name}_${contra.condition}`,
            severity: contra.severity === 'absolute' ? 'critical' : 'warning',
            type: 'contraindication',
            title: `Contraindication: ${drug.name}`,
            message: contra.description,
            recommendation: contra.alternative || 'Consider alternative therapy',
            canOverride: contra.severity !== 'absolute',
            requiresJustification: true
          });
        }
      });
    });
    
    return alerts;
  }

  /**
   * Check biomarker prerequisites
   */
  static checkBiomarkerPrerequisites(drugs: Drug[], biomarkerStatus: Record<string, string>): SafetyAlert[] {
    const alerts: SafetyAlert[] = [];
    
    drugs.forEach(drug => {
      const prerequisites = BIOMARKER_PREREQUISITES.filter(p => p.drug === drug.name);
      
      prerequisites.forEach(prereq => {
        const currentStatus = biomarkerStatus[prereq.biomarker];
        
        if (!currentStatus) {
          alerts.push({
            id: `missing_biomarker_${drug.name}_${prereq.biomarker}`,
            severity: 'critical',
            type: 'prerequisite',
            title: `Missing Biomarker: ${prereq.biomarker}`,
            message: `${prereq.biomarker} status required before ${drug.name} administration`,
            recommendation: `Order ${prereq.biomarker} testing${prereq.testingMethod ? ` via ${prereq.testingMethod}` : ''}`,
            canOverride: false,
            requiresJustification: false
          });
        } else if (!prereq.requiredStatus.includes(currentStatus)) {
          alerts.push({
            id: `biomarker_mismatch_${drug.name}_${prereq.biomarker}`,
            severity: 'critical',
            type: 'prerequisite',
            title: `Biomarker Mismatch: ${drug.name}`,
            message: `${prereq.biomarker} is ${currentStatus}, but ${prereq.requiredStatus.join(' or ')} required`,
            recommendation: 'Consider alternative therapy based on biomarker status',
            canOverride: false,
            requiresJustification: false
          });
        }
      });
    });
    
    return alerts;
  }

  /**
   * Check dosing safety (BSA caps, renal adjustments, etc.)
   */
  static checkDosingSafety(drugs: Drug[], patient: PatientInfo, calculatedDoses: Record<string, number>): SafetyAlert[] {
    const alerts: SafetyAlert[] = [];
    
    drugs.forEach(drug => {
      const calculatedDose = calculatedDoses[drug.name];
      
      // BSA capping check
      if (drug.unit === 'mg/m²' && patient.bsa > 2.0) {
        alerts.push({
          id: `bsa_cap_${drug.name}`,
          severity: 'warning',
          type: 'dosing',
          title: `BSA Cap Consideration: ${drug.name}`,
          message: `Patient BSA (${patient.bsa.toFixed(2)} m²) exceeds 2.0 m²`,
          recommendation: 'Consider capping BSA at 2.0 m² for dose calculation',
          canOverride: true,
          requiresJustification: true
        });
      }
      
      // Renal dose adjustment
      if (drug.name === 'Cisplatin' && patient.creatinineClearance < 60) {
        alerts.push({
          id: `renal_adjustment_${drug.name}`,
          severity: 'warning',
          type: 'dosing',
          title: `Renal Dose Adjustment: ${drug.name}`,
          message: `CrCl ${patient.creatinineClearance} mL/min requires dose adjustment`,
          recommendation: 'Consider 75% dose reduction or carboplatin substitution',
          canOverride: true,
          requiresJustification: true
        });
      }
      
      // Age-based considerations
      if (patient.age >= 65 && drug.name === 'Doxorubicin') {
        alerts.push({
          id: `geriatric_${drug.name}`,
          severity: 'info',
          type: 'dosing',
          title: `Geriatric Consideration: ${drug.name}`,
          message: `Patient age ${patient.age} years - increased cardiotoxicity risk`,
          recommendation: 'Consider baseline cardiac function assessment',
          canOverride: true,
          requiresJustification: false
        });
      }
    });
    
    return alerts;
  }

  /**
   * Comprehensive safety check
   */
  static performComprehensiveSafetyCheck(
    regimen: Regimen,
    patient: PatientInfo,
    calculatedDoses: Record<string, number>,
    biomarkerStatus: Record<string, string> = {},
    currentMedications: string[] = [],
    clinicalData: ClinicalData = {}
  ): SafetyAlert[] {
    const allAlerts: SafetyAlert[] = [];
    
    // Check all safety categories
    allAlerts.push(...this.checkDrugInteractions(regimen.drugs, currentMedications));
    allAlerts.push(...this.checkContraindications(regimen.drugs, patient, clinicalData));
    allAlerts.push(...this.checkBiomarkerPrerequisites(regimen.drugs, biomarkerStatus));
    allAlerts.push(...this.checkDosingSafety(regimen.drugs, patient, calculatedDoses));
    
    // Sort by severity (critical first)
    return allAlerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Get monitoring requirements for drugs
   */
  static getMonitoringRequirements(drugs: Drug[]): Array<{
    drug: string;
    parameter: string;
    frequency: string;
    threshold: string;
    action: string;
  }> {
    const monitoring = [];
    
    drugs.forEach(drug => {
      switch (drug.name) {
        case 'Doxorubicin':
          monitoring.push({
            drug: drug.name,
            parameter: 'LVEF',
            frequency: 'Every 3 cycles',
            threshold: '<50% or >10% decrease',
            action: 'Hold therapy, cardiology consult'
          });
          break;
        case 'Cisplatin':
          monitoring.push(
            {
              drug: drug.name,
              parameter: 'Creatinine',
              frequency: 'Before each cycle',
              threshold: '>1.5x baseline',
              action: 'Hold therapy, dose reduce'
            },
            {
              drug: drug.name,
              parameter: 'Magnesium',
              frequency: 'Before each cycle',
              threshold: '<1.2 mg/dL',
              action: 'Supplement before infusion'
            }
          );
          break;
        case 'Carboplatin':
          monitoring.push({
            drug: drug.name,
            parameter: 'Platelets',
            frequency: 'Weekly',
            threshold: '<100,000/μL',
            action: 'Hold therapy, dose reduce'
          });
          break;
        default:
          if (drug.drugClass === 'chemotherapy') {
            monitoring.push({
              drug: drug.name,
              parameter: 'CBC with diff',
              frequency: 'Before each cycle',
              threshold: 'ANC <1000/μL',
              action: 'Hold therapy, consider G-CSF'
            });
          }
      }
    });
    
    return monitoring;
  }
}