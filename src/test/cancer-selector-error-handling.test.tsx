import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CancerTypeSelectorOptimized } from "@/components/CancerTypeSelectorOptimized";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string, options?: any) => {
      if (key === "cancerSelector.dataError") {
        return "Failed to load cancer types data";
      }
      if (key === "cancerSelector.loading") {
        return "Loading cancer types...";
      }
      if (key === "cancerSelector.retry") {
        return "Retry";
      }
      if (key === "cancerSelector.title") {
        return "Cancer Type & Regimen Selection";
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
    warn: vi.fn(),
  },
}));

// Mock validateCancerType
vi.mock("@/types/schemas", () => ({
  validateCancerType: vi.fn(() => true),
}));

// Mock ErrorBoundary
vi.mock("@/components/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));

describe("CancerTypeSelectorOptimized - Error Handling", () => {
  const mockOnRegimenSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    // Mock empty cancerTypes to simulate loading state
    vi.doMock("@/data/cancerTypes", () => ({
      cancerTypes: [],
    }));

    const { container } = render(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    expect(container.textContent).toContain("Loading cancer types...");
  });

  it("renders error state when cancerTypes is undefined", () => {
    // Mock undefined cancerTypes
    vi.doMock("@/data/cancerTypes", () => ({
      cancerTypes: undefined,
    }));

    const { container } = render(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    expect(container.textContent).toContain("Failed to load cancer types data");
    expect(container.textContent).toContain("Retry");
  });

  it("renders error state when cancerTypes is not an array", () => {
    // Mock invalid cancerTypes
    vi.doMock("@/data/cancerTypes", () => ({
      cancerTypes: "invalid data",
    }));

    const { container } = render(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    expect(container.textContent).toContain("Failed to load cancer types data");
    expect(container.textContent).toContain("Retry");
  });

  it("handles retry button click", async () => {
    const user = userEvent.setup();
    
    // Mock window.location.reload
    const originalReload = window.location.reload;
    window.location.reload = vi.fn();

    // Mock undefined cancerTypes
    vi.doMock("@/data/cancerTypes", () => ({
      cancerTypes: undefined,
    }));

    const { container } = render(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    const retryButton = container.querySelector('button');
    if (retryButton) {
      await user.click(retryButton);
    }
    
    expect(window.location.reload).toHaveBeenCalled();
    
    // Restore original function
    window.location.reload = originalReload;
  });

  it("renders successfully with valid cancerTypes data", () => {
    // Mock valid cancerTypes
    vi.doMock("@/data/cancerTypes", () => ({
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
              ],
            },
          ],
        },
      ],
    }));

    const { container } = render(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    expect(container.textContent).toContain("Cancer Type & Regimen Selection");
    
    // Should not show loading or error states
    expect(container.textContent).not.toContain("Loading cancer types...");
    expect(container.textContent).not.toContain("Failed to load cancer types data");
  });

  it("handles invalid cancer objects gracefully", () => {
    // Mock cancerTypes with invalid objects
    vi.doMock("@/data/cancerTypes", () => ({
      cancerTypes: [
        null, // Invalid object
        {
          id: "gi-all",
          name: "Gastrointestinal Cancers",
          category: "Solid Tumor",
          regimens: [],
        },
        { id: "invalid" }, // Missing required fields
      ],
    }));

    const { container } = render(<CancerTypeSelectorOptimized onRegimenSelect={mockOnRegimenSelect} />);
    
    expect(container.textContent).toContain("Cancer Type & Regimen Selection");
    
    // Should still render but filter out invalid entries
    expect(container.textContent).toContain("Gastrointestinal Cancers");
  });
});