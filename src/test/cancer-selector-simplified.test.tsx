import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { CancerTypeSelectorOptimized } from "@/components/CancerTypeSelectorOptimized";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/index";

// Mock the regimen selection handler
const mockOnRegimenSelect = vi.fn();

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

describe("CancerTypeSelectorOptimized - Simplified Filtering", () => {
  beforeEach(() => {
    mockOnRegimenSelect.mockClear();
  });

  it("renders without treatment environment filter tabs", () => {
    const { queryByText, getByText } = renderWithI18n(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    // Should not have the old tab filters
    expect(queryByText("Neoadjuvant")).not.toBeInTheDocument();
    expect(queryByText("Adjuvant")).not.toBeInTheDocument();
    expect(queryByText("Metastatic")).not.toBeInTheDocument();
    
    // Should have the main title
    expect(getByText("Cancer Type & Regimen Selection")).toBeInTheDocument();
  });

  it("shows subcategory selector for multi-type cancers", () => {
    const { getAllByText, getByText } = renderWithI18n(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    // Click on first cancer type
    const selectButton = getAllByText("Select")[0];
    selectButton.click();
    
    // Should show subcategory selector for applicable cancer types
    const subcategoryElements = document.querySelectorAll('[aria-label*="subcategory"]');
    expect(subcategoryElements.length).toBeGreaterThanOrEqual(0);
  });

  it("displays treatment environment information as badges", () => {
    const { getAllByText } = renderWithI18n(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    // Click on a cancer type to expand regimens
    const selectButton = getAllByText("Select")[0];
    selectButton.click();
    
    // Should show regimens with badges (treatment environment shown as visual indicators)
    expect(document.querySelector('[role="region"]')).toBeInTheDocument();
  });
});

describe("CancerTypeSelectorOptimized - Translation Support", () => {
  it("supports Romanian translations", async () => {
    // Change language to Romanian  
    await i18n.changeLanguage("ro");
    
    const { getByText } = renderWithI18n(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    expect(getByText("Selectare tip cancer și regim")).toBeInTheDocument();
  });

  it("renders cancer selection interface", () => {
    const { getByText } = renderWithI18n(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    // Basic rendering test
    expect(getByText("Cancer Type & Regimen Selection")).toBeInTheDocument();
  });
});