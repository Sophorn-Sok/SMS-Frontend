import { FeatureIndex } from "@/components/feature-index";
import { roleFeatures } from "@/lib/features";

export default function AcademicAffairsHome() {
  return (
    <FeatureIndex
      roleLabel="Academic Affairs"
      features={roleFeatures["academic-affairs"]}
    />
  );
}
