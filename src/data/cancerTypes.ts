import { CancerType } from "@/types/regimens";
import { breastCancerRegimens } from "./regimens/breastCancer";
import { breastCancerTargetedRegimens } from "./regimens/breastCancerTargeted";
import { lungCancerRegimens } from "./regimens/lungCancer";
import { lungCancerTargetedRegimens } from "./regimens/lungCancerTargeted";
import { colorectalCancerRegimens } from "./regimens/colorectalCancer";
import { colorectalTargetedRegimens } from "./regimens/colorectalTargeted";
import { headNeckRegimens } from "./regimens/headNeck";
import { 
  cervicalCancerRegimens, 
  endometrialCancerRegimens, 
  gtnRegimens, 
  ovarianCancerRegimens 
} from "./regimens/gynaecology";

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
  },
  {
    id: "headneck",
    name: "Head & Neck Cancer",
    category: "Solid Tumor",
    regimens: [...headNeckRegimens]
  },
  {
    id: "gyn-cervical",
    name: "Cervical Cancer",
    category: "Gynaecology",
    regimens: [...cervicalCancerRegimens]
  },
  {
    id: "gyn-endometrial",
    name: "Endometrial Cancer", 
    category: "Gynaecology",
    regimens: [...endometrialCancerRegimens]
  },
  {
    id: "gyn-gtn",
    name: "Gestational Trophoblastic Neoplasia (GTN)",
    category: "Gynaecology", 
    regimens: [...gtnRegimens]
  },
  {
    id: "gyn-ovarian",
    name: "Ovarian, Fallopian Tube & Primary Peritoneal Cancer",
    category: "Gynaecology",
    regimens: [...ovarianCancerRegimens]
  }
];