import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { CancerTypeSelectorOptimized } from "@/components/CancerTypeSelectorOptimized";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string, options?: any) => {
      if (key === "cancerSelector.noResults") {
        return `No regimens found for "${options?.term}" in ${options?.subcategory}`;
      }
      if (key === "cancerSelector.contextualSearch") {
        return `Search in ${options?.subcategory}`;
      }
      if (key === "cancerSelector.contextualSearchPlaceholder") {
        return "Search by regimen name or drug (e.g., Oxaliplatin, mFOLFOX6)";
      }
      return defaultValue || key;
    },
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock lodash.debounce
vi.mock("lodash.debounce", () => ({
  default: (fn: Function) => fn,
}));

// Mock logger
vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock validateCancerType
vi.mock("@/types/schemas", () => ({
  validateCancerType: () => true,
}));

// Mock cancer types data
vi.mock("@/data/cancerTypes", () => ({
  cancerTypes: [
    {
      id: "gi-all",
      name: "Gastrointestinal Cancers",
      category: "Solid Tumor",
      regimens: [
        {
          id: "gi-colorectal-mfolfox6",
          name: "mFOLFOX6",
          subtype: "Colorectal",
          category: "metastatic",
          description: "Modified FOLFOX6 regimen for metastatic colorectal cancer",
          schedule: "Repeat every 2 weeks",
          cycles: "Until progression",
          drugs: [
            { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "1" },
            { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "1" },
          ],
        },
      ],
    },
  ],
}));

describe("CancerTypeSelectorOptimized - Contextual Search", () => {
  const mockOnRegimenSelect = vi.fn();

  it("renders component without crashing", () => {
    const { container } = render(
      <CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />
    );
    expect(container).toBeTruthy();
  });

  it("has proper search input elements", () => {
    const { container } = render(
      <CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />
    );
    
    // Check for global search input
    const globalSearchInput = container.querySelector('input[id="global-search"]');
    expect(globalSearchInput).toBeTruthy();
  });

  it("shows cancer types in the interface", () => {
    const { container } = render(
      <CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />
    );
    
    // Check for cancer type text
    const cancerTypeText = container.textContent;
    expect(cancerTypeText).toContain("Gastrointestinal Cancers");
  });
});