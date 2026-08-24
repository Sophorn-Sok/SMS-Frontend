import { FeatureIndex } from "@/components/feature-index";
import { roleFeatures } from "@/lib/features";

export default function ControllerOfExaminationHome() {
  return (
    <FeatureIndex
      roleLabel="Controller of Examination"
      features={roleFeatures["controller-of-examination"]}
    />
  );
}
