import { CancerType } from "@/types/regimens";
import { breastCancerRegimens } from "./regimens/breastCancer";
import { breastCancerTargetedRegimens } from "./regimens/breastCancerTargeted";
import { lungCancerRegimens } from "./regimens/lungCancer";
import { lungCancerTargetedRegimens } from "./regimens/lungCancerTargeted";
import { colorectalCancerRegimens } from "./regimens/colorectalCancer";
import { colorectalTargetedRegimens } from "./regimens/colorectalTargeted";

export const cancerTypes: CancerType[] = [
  {
    id: "breast",
    name: "Breast Cancer",
    category: "Solid Tumor",
    regimens: [...breastCancerRegimens, ...breastCancerTargetedRegimens]
  },
  {
    id: "lung",
    name: "Lung Cancer (NSCLC/SCLC)",
    category: "Solid Tumor", 
    regimens: [...lungCancerRegimens, ...lungCancerTargetedRegimens]
  },
  {
    id: "colorectal",
    name: "Colorectal Cancer",
    category: "Solid Tumor",
    regimens: [...colorectalCancerRegimens, ...colorectalTargetedRegimens]
  }
];