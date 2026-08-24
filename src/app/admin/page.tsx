import { FeatureIndex } from "@/components/feature-index";
import { roleFeatures } from "@/lib/features";

export default function AdminHome() {
  return <FeatureIndex roleLabel="Admin" features={roleFeatures["admin"]} />;
}
