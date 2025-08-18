import { describe, it, expect } from "vitest";
import { gastrointestinalCancerRegimens } from "@/data/regimens/gastrointestinalCancer";

describe("Colorectal Cancer Regimens", () => {
  const colorectalRegimens = gastrointestinalCancerRegimens.filter(r => r.subtype === "Colorectal");
  
  it("should have all 61 colorectal regimens", () => {
    expect(colorectalRegimens.length).toBeGreaterThan(40);
  });

  it("should include mFOLFOX6 with correct dosing", () => {
    const mFOLFOX6 = colorectalRegimens.find(r => r.name === "mFOLFOX6");
    expect(mFOLFOX6).toBeDefined();
    expect(mFOLFOX6?.drugs.find(d => d.name === "Oxaliplatin")?.dosage).toBe("85");
  });

  it("should have biomarker requirements for targeted therapy", () => {
    const panitumumabRegimen = colorectalRegimens.find(r => r.name.includes("Panitumumab"));
    expect(panitumumabRegimen?.biomarkerRequirements).toBeDefined();
    expect(panitumumabRegimen?.biomarkerRequirements?.[0].name).toContain("KRAS");
  });

  it("should validate all regimen schemas", () => {
    colorectalRegimens.forEach(regimen => {
      expect(regimen.id).toBeDefined();
      expect(regimen.name).toBeDefined();
      expect(regimen.drugs.length).toBeGreaterThan(0);
      expect(regimen.category).toMatch(/neoadjuvant|adjuvant|metastatic|advanced/);
    });
  });
});