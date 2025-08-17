import { describe, it, expect } from 'vitest';
import { headNeckRegimens } from './headNeck';
import type { PatientInfo } from '@/types/clinicalTreatment';

describe('Head & Neck Regimens', () => {
  it('should have all required regimens with proper structure', () => {
    expect(headNeckRegimens).toBeDefined();
    expect(headNeckRegimens.length).toBeGreaterThan(0);

    // Check that all regimens have required fields
    headNeckRegimens.forEach(regimen => {
      expect(regimen.id).toBeDefined();
      expect(regimen.name).toBeDefined();
      expect(regimen.description).toBeDefined();
      expect(regimen.category).toBeDefined();
      expect(regimen.drugs).toBeDefined();
      expect(regimen.drugs.length).toBeGreaterThan(0);
      
      // Check drug structure
      regimen.drugs.forEach(drug => {
        expect(drug.name).toBeDefined();
        expect(drug.dosage).toBeDefined();
        expect(drug.unit).toBeDefined();
        expect(drug.route).toBeDefined();
      });
    });
  });

  it('should include carboplatin weekly regimen (00332a)', () => {
    const regimen = headNeckRegimens.find(r => r.id === '00332a');
    expect(regimen).toBeDefined();
    expect(regimen?.name).toContain('Carboplatin AUC1.5');
    expect(regimen?.drugs[0]?.name).toBe('Carboplatin');
    expect(regimen?.drugs[0]?.dosage).toBe('AUC 1.5');
  });

  it('should include TCF induction regimen (00315a)', () => {
    const regimen = headNeckRegimens.find(r => r.id === '00315a');
    expect(regimen).toBeDefined();
    expect(regimen?.name).toContain('TCF');
    expect(regimen?.drugs.length).toBe(3);
    
    const drugNames = regimen?.drugs.map(d => d.name);
    expect(drugNames).toContain('Docetaxel');
    expect(drugNames).toContain('Cisplatin');
    expect(drugNames).toContain('5-Fluorouracil');
  });

  it('should include pembrolizumab combination regimen (00705a)', () => {
    const regimen = headNeckRegimens.find(r => r.id === '00705a');
    expect(regimen).toBeDefined();
    expect(regimen?.name).toContain('Pembrolizumab');
    expect(regimen?.drugs.length).toBe(3);
    
    const drugNames = regimen?.drugs.map(d => d.name);
    expect(drugNames).toContain('Pembrolizumab');
    expect(drugNames).toContain('Carboplatin');
    expect(drugNames).toContain('5-Fluorouracil');
  });

  it('should include thyroid cancer oral therapies', () => {
    const lenvatinib = headNeckRegimens.find(r => r.id === '00295a');
    const sorafenib = headNeckRegimens.find(r => r.id === '00294c');
    const vandetanib = headNeckRegimens.find(r => r.id === '00242a');
    
    expect(lenvatinib).toBeDefined();
    expect(lenvatinib?.drugs[0]?.route).toBe('PO');
    
    expect(sorafenib).toBeDefined();
    expect(sorafenib?.drugs[0]?.route).toBe('PO');
    
    expect(vandetanib).toBeDefined();
    expect(vandetanib?.drugs[0]?.route).toBe('PO');
  });

  it('should have proper premedications for cisplatin-containing regimens', () => {
    const cisplatinRegimens = headNeckRegimens.filter(r => 
      r.drugs.some(drug => drug.name === 'Cisplatin')
    );
    
    cisplatinRegimens.forEach(regimen => {
      expect(regimen.premedications).toBeDefined();
      expect(regimen.premedications!.length).toBeGreaterThan(0);
      
      // Should have antiemetic premedications for cisplatin
      const hasAntiemetic = regimen.premedications!.some(
        premed => premed.category === 'antiemetic'
      );
      expect(hasAntiemetic).toBe(true);
    });
  });

  it('should have proper safety contraindications', () => {
    // Check 5-FU regimens have DPD contraindication
    const fuRegimens = headNeckRegimens.filter(r => 
      r.drugs.some(drug => drug.name === '5-Fluorouracil')
    );
    
    fuRegimens.forEach(regimen => {
      expect(regimen.eligibilityCriteria?.contraindications).toBeDefined();
      expect(regimen.eligibilityCriteria!.contraindications).toContain('DPD deficiency');
    });

    // Check cisplatin regimens have renal contraindication
    const cisplatinRegimens = headNeckRegimens.filter(r => 
      r.drugs.some(drug => drug.name === 'Cisplatin')
    );
    
    cisplatinRegimens.forEach(regimen => {
      expect(regimen.eligibilityCriteria?.contraindications).toBeDefined();
      const contraindications = regimen.eligibilityCriteria!.contraindications!;
      expect(contraindications.some(c => c.includes('renal'))).toBe(true);
    });
  });

  it('should have proper monitoring requirements', () => {
    headNeckRegimens.forEach(regimen => {
      regimen.drugs.forEach(drug => {
        expect(drug.monitoring).toBeDefined();
        expect(drug.monitoring!.length).toBeGreaterThan(0);
        
        // Cisplatin should have renal and hearing monitoring
        if (drug.name === 'Cisplatin') {
          expect(drug.monitoring).toContain('Renal function');
          expect(drug.monitoring).toContain('Hearing');
        }
        
        // All chemotherapy should have CBC monitoring
        if (drug.drugClass === 'chemotherapy') {
          expect(drug.monitoring).toContain('CBC');
        }
      });
    });
  });

  it('should have proper dilution information for IV drugs', () => {
    headNeckRegimens.forEach(regimen => {
      regimen.drugs.forEach(drug => {
        if (drug.route === 'IV') {
          expect(drug.dilution).toBeDefined();
          expect(typeof drug.dilution).toBe('string');
          expect(drug.dilution!.length).toBeGreaterThan(0);
        }
      });
    });
  });

  it('should validate regimen categories', () => {
    const validCategories = ['neoadjuvant', 'adjuvant', 'advanced', 'metastatic'];
    
    headNeckRegimens.forEach(regimen => {
      expect(validCategories).toContain(regimen.category);
    });
  });

  it('should validate line of therapy when specified', () => {
    const validLines = ['first-line', 'second-line', 'third-line', 'maintenance', 'salvage'];
    
    headNeckRegimens.forEach(regimen => {
      if (regimen.lineOfTherapy) {
        expect(validLines).toContain(regimen.lineOfTherapy);
      }
    });
  });

  it('should have AUC-based dosing for carboplatin regimens', () => {
    const carboRegimens = headNeckRegimens.filter(r => 
      r.drugs.some(drug => drug.name === 'Carboplatin')
    );
    
    carboRegimens.forEach(regimen => {
      const carboDrug = regimen.drugs.find(drug => drug.name === 'Carboplatin');
      expect(carboDrug?.unit === 'AUC' || carboDrug?.unit === 'mg/m²').toBe(true);
    });
  });

  it('should have proper administration duration for all IV drugs', () => {
    headNeckRegimens.forEach(regimen => {
      regimen.drugs.forEach(drug => {
        if (drug.route === 'IV') {
          expect(drug.administrationDuration).toBeDefined();
          expect(typeof drug.administrationDuration).toBe('string');
        }
      });
    });
  });
});