import { Drug } from '@/types/regimens';

export interface MonitoringParameter {
  parameter: string;
  frequency: string;
  normalRange: string;
  threshold: string;
  action: string;
  urgency: 'routine' | 'urgent' | 'stat';
  method?: string;
}

export interface DrugMonitoringProfile {
  drug: string;
  drugClass: string;
  monitoringParameters: MonitoringParameter[];
  baselineRequirements: string[];
  contraindications: string[];
  doseModifications: Array<{
    parameter: string;
    grade: number;
    action: string;
    doseAdjustment: string;
  }>;
}

export const MONITORING_PROTOCOLS: DrugMonitoringProfile[] = [
  {
    drug: 'Doxorubicin',
    drugClass: 'anthracycline',
    monitoringParameters: [
      {
        parameter: 'LVEF',
        frequency: 'Baseline, every 3 cycles, end of treatment',
        normalRange: '≥55%',
        threshold: '<50% or >10% decrease from baseline',
        action: 'Hold therapy, cardiology consult',
        urgency: 'urgent',
        method: 'ECHO or MUGA'
      },
      {
        parameter: 'CBC with differential',
        frequency: 'Before each cycle, day 7-14',
        normalRange: 'ANC >1500/μL, PLT >100,000/μL',
        threshold: 'ANC <1000/μL or PLT <50,000/μL',
        action: 'Hold therapy, consider dose reduction',
        urgency: 'routine'
      },
      {
        parameter: 'Liver function tests',
        frequency: 'Before each cycle',
        normalRange: 'AST/ALT <2.5x ULN, Bilirubin <1.5x ULN',
        threshold: 'AST/ALT >3x ULN or Bilirubin >2x ULN',
        action: 'Hold therapy, investigate cause',
        urgency: 'routine'
      }
    ],
    baselineRequirements: [
      'ECHO or MUGA (LVEF ≥50%)',
      'CBC with differential',
      'Comprehensive metabolic panel',
      'Liver function tests'
    ],
    contraindications: [
      'LVEF <50%',
      'Severe liver impairment',
      'Active infection'
    ],
    doseModifications: [
      {
        parameter: 'LVEF',
        grade: 2,
        action: '50% dose reduction',
        doseAdjustment: 'Reduce by 50% if LVEF 40-50%'
      },
      {
        parameter: 'Neutropenia',
        grade: 4,
        action: 'Hold until recovery, then reduce 25%',
        doseAdjustment: 'ANC <500/μL: hold until >1000/μL'
      }
    ]
  },
  
  {
    drug: 'Cisplatin',
    drugClass: 'platinum',
    monitoringParameters: [
      {
        parameter: 'Serum creatinine/BUN',
        frequency: 'Before each cycle',
        normalRange: 'Creatinine ≤1.5x baseline, BUN <30 mg/dL',
        threshold: 'Creatinine >2x baseline or CrCl <60 mL/min',
        action: 'Hold therapy, consider carboplatin substitution',
        urgency: 'urgent'
      },
      {
        parameter: 'Electrolytes (Mg, K, PO4)',
        frequency: 'Before each cycle, weekly during treatment',
        normalRange: 'Mg >1.2 mg/dL, K 3.5-5.0 mEq/L',
        threshold: 'Mg <1.0 mg/dL, K <3.0 mEq/L',
        action: 'Supplement before treatment',
        urgency: 'routine'
      },
      {
        parameter: 'Audiometry',
        frequency: 'Baseline, every 2 cycles',
        normalRange: 'No significant hearing loss',
        threshold: '>20 dB loss at 4000-8000 Hz',
        action: 'Consider dose reduction or carboplatin',
        urgency: 'routine'
      },
      {
        parameter: 'Neurologic exam',
        frequency: 'Before each cycle',
        normalRange: 'No peripheral neuropathy',
        threshold: 'Grade 2+ sensory neuropathy',
        action: 'Dose reduction or discontinuation',
        urgency: 'routine'
      }
    ],
    baselineRequirements: [
      'Serum creatinine, BUN, creatinine clearance',
      'Electrolytes (Na, K, Cl, CO2, Mg, PO4)',
      'Audiometry',
      'Neurologic examination'
    ],
    contraindications: [
      'Creatinine clearance <60 mL/min',
      'Hearing impairment',
      'Pre-existing neuropathy grade ≥2'
    ],
    doseModifications: [
      {
        parameter: 'Renal function',
        grade: 2,
        action: '75% dose or switch to carboplatin',
        doseAdjustment: 'CrCl 45-60: reduce 25%, CrCl <45: contraindicated'
      }
    ]
  },

  {
    drug: 'Carboplatin',
    drugClass: 'platinum',
    monitoringParameters: [
      {
        parameter: 'CBC with differential',
        frequency: 'Before each cycle, weekly',
        normalRange: 'ANC >1500/μL, PLT >100,000/μL',
        threshold: 'PLT <100,000/μL or ANC <1000/μL',
        action: 'Hold therapy, dose reduction',
        urgency: 'routine'
      },
      {
        parameter: 'Renal function',
        frequency: 'Before each cycle',
        normalRange: 'Creatinine ≤1.5x baseline',
        threshold: 'Creatinine >2x baseline',
        action: 'Dose adjustment per Calvert formula',
        urgency: 'routine'
      }
    ],
    baselineRequirements: [
      'CBC with differential',
      'Comprehensive metabolic panel',
      'Creatinine clearance calculation'
    ],
    contraindications: [
      'Severe bone marrow suppression',
      'Severe renal impairment (CrCl <30 mL/min)'
    ],
    doseModifications: [
      {
        parameter: 'Thrombocytopenia',
        grade: 4,
        action: 'Hold until PLT >100K, reduce AUC by 1',
        doseAdjustment: 'PLT <50K: hold until >100K'
      }
    ]
  },

  {
    drug: 'Trastuzumab',
    drugClass: 'anti-HER2',
    monitoringParameters: [
      {
        parameter: 'LVEF',
        frequency: 'Baseline, every 3 months during treatment',
        normalRange: '≥50%',
        threshold: '<50% or >10% decrease from baseline',
        action: 'Hold therapy, repeat in 3 weeks',
        urgency: 'urgent',
        method: 'ECHO or MUGA'
      },
      {
        parameter: 'Infusion reactions',
        frequency: 'During each infusion',
        normalRange: 'No reactions',
        threshold: 'Grade ≥2 infusion reaction',
        action: 'Interrupt infusion, premedication',
        urgency: 'stat'
      }
    ],
    baselineRequirements: [
      'HER2 testing (IHC 3+ or FISH amplified)',
      'ECHO or MUGA (LVEF ≥50%)',
      'Complete blood count'
    ],
    contraindications: [
      'HER2-negative tumor',
      'LVEF <50%',
      'Uncontrolled cardiac disease'
    ],
    doseModifications: [
      {
        parameter: 'Cardiomyopathy',
        grade: 2,
        action: 'Hold therapy, cardiology evaluation',
        doseAdjustment: 'Resume if LVEF improves to >50%'
      }
    ]
  },

  {
    drug: 'Pembrolizumab',
    drugClass: 'checkpoint inhibitor',
    monitoringParameters: [
      {
        parameter: 'Thyroid function (TSH, T4)',
        frequency: 'Baseline, before each cycle',
        normalRange: 'TSH 0.4-4.0 mIU/L',
        threshold: 'TSH >10 mIU/L or <0.1 mIU/L',
        action: 'Endocrinology consult, hormone replacement',
        urgency: 'routine'
      },
      {
        parameter: 'Liver function tests',
        frequency: 'Before each cycle',
        normalRange: 'AST/ALT <3x ULN, Bilirubin <1.5x ULN',
        threshold: 'AST/ALT >5x ULN or Bilirubin >3x ULN',
        action: 'Hold therapy, consider steroids',
        urgency: 'urgent'
      },
      {
        parameter: 'Pulmonary function',
        frequency: 'Clinical assessment each visit',
        normalRange: 'No dyspnea, normal O2 saturation',
        threshold: 'New dyspnea, decreased O2 saturation',
        action: 'Chest imaging, pulmonology consult',
        urgency: 'urgent'
      },
      {
        parameter: 'Skin assessment',
        frequency: 'Each visit',
        normalRange: 'No rash',
        threshold: 'Grade ≥3 rash or mucositis',
        action: 'Dermatology consult, consider steroids',
        urgency: 'routine'
      }
    ],
    baselineRequirements: [
      'PD-L1 testing (if indicated)',
      'Thyroid function tests',
      'Liver function tests',
      'Autoimmune disease screening'
    ],
    contraindications: [
      'Active autoimmune disease requiring systemic therapy',
      'Organ transplant recipient',
      'Active hepatitis B or C'
    ],
    doseModifications: [
      {
        parameter: 'Immune-related AE',
        grade: 3,
        action: 'Hold therapy, high-dose steroids',
        doseAdjustment: 'Grade ≥3: hold until ≤grade 1, steroids'
      }
    ]
  }
];

export const getMonitoringProtocol = (drugName: string): DrugMonitoringProfile | undefined => {
  return MONITORING_PROTOCOLS.find(protocol => 
    protocol.drug.toLowerCase() === drugName.toLowerCase()
  );
};

export const getMonitoringParametersForRegimen = (drugs: Drug[]): MonitoringParameter[] => {
  const allParameters: MonitoringParameter[] = [];
  
  drugs.forEach(drug => {
    const protocol = getMonitoringProtocol(drug.name);
    if (protocol) {
      allParameters.push(...protocol.monitoringParameters);
    }
  });
  
  // Remove duplicates and merge similar parameters
  const uniqueParameters = allParameters.reduce((acc, param) => {
    const existing = acc.find(p => p.parameter === param.parameter);
    if (!existing) {
      acc.push(param);
    } else {
      // Use the most restrictive threshold
      if (param.urgency === 'stat' || (param.urgency === 'urgent' && existing.urgency === 'routine')) {
        acc[acc.indexOf(existing)] = param;
      }
    }
    return acc;
  }, [] as MonitoringParameter[]);
  
  return uniqueParameters.sort((a, b) => {
    const urgencyOrder = { stat: 0, urgent: 1, routine: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
};

export const getDoseModifications = (drugName: string) => {
  const protocol = getMonitoringProtocol(drugName);
  return protocol?.doseModifications || [];
};

export const getBaselineRequirements = (drugs: Drug[]): string[] => {
  const requirements = new Set<string>();
  
  drugs.forEach(drug => {
    const protocol = getMonitoringProtocol(drug.name);
    if (protocol) {
      protocol.baselineRequirements.forEach(req => requirements.add(req));
    }
  });
  
  return Array.from(requirements);
};