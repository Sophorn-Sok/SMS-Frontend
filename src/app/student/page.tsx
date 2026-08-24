import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { roleFeatures } from "@/lib/features";

export default function StudentSelfServicePage() {
  return <FeaturePlaceholder feature={roleFeatures["student"][0]} />;
}
