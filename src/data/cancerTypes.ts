import { CancerType } from "@/types/regimens";
import { breastCancerRegimens } from "./regimens/breastCancer";
import { lungCancerRegimens } from "./regimens/lungCancer";
import { colorectalCancerRegimens } from "./regimens/colorectalCancer";

export const cancerTypes: CancerType[] = [
  {
    id: "breast",
    name: "Breast Cancer",
    category: "Solid Tumor",
    regimens: breastCancerRegimens
  },
  {
    id: "lung",
    name: "Lung Cancer (NSCLC/SCLC)",
    category: "Solid Tumor", 
    regimens: lungCancerRegimens
  },
  {
    id: "colorectal",
    name: "Colorectal Cancer",
    category: "Solid Tumor",
    regimens: colorectalCancerRegimens
  }
];