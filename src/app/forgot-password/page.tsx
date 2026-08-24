import { AuthShell } from "@/components/auth-shell";
import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { authFeatures } from "@/lib/features";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <FeaturePlaceholder feature={authFeatures[2]} />
    </AuthShell>
  );
}
