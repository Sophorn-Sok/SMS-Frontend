import { AuthShell } from "@/components/auth-shell";
import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { authFeatures } from "@/lib/features";

export default function SignUpPage() {
  return (
    <AuthShell>
      <FeaturePlaceholder feature={authFeatures[1]} />
    </AuthShell>
  );
}
