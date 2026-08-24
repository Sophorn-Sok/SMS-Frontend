import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { roleFeatures } from "@/lib/features";

export default function GradingOversightPage() {
  return (
    <FeaturePlaceholder feature={roleFeatures["controller-of-examination"][1]} />
  );
}
