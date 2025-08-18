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

// Add subtype to gynecological regimens
const cervicalRegimensWithSubtype = cervicalCancerRegimens.map(regimen => ({
  ...regimen,
  subtype: "Cervical Cancer"
}));

const endometrialRegimensWithSubtype = endometrialCancerRegimens.map(regimen => ({
  ...regimen,
  subtype: "Endometrial Cancer"
}));

const gtnRegimensWithSubtype = gtnRegimens.map(regimen => ({
  ...regimen,
  subtype: "GTN"
}));

const ovarianRegimensWithSubtype = ovarianCancerRegimens.map(regimen => ({
  ...regimen,
  subtype: "Ovarian Cancer"
}));

export const cancerTypes: CancerType[] = [
  {
    id: "breast",
    name: "Breast Cancer",
    category: "Solid Tumor",
    regimens: [...breastCancerRegimens, ...breastCancerTargetedRegimens]
  },
  {
    id: "lung-all",
    name: "Lung Cancer",
    category: "Lung Cancer", 
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
    id: "gyn-all",
    name: "Gynaecological Cancers",
    category: "Gynaecology",
    regimens: [
      ...cervicalRegimensWithSubtype,
      ...endometrialRegimensWithSubtype,
      ...gtnRegimensWithSubtype,
      ...ovarianRegimensWithSubtype
    ]
  }
];