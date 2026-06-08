import { Suspense } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6 py-16">
      <Suspense fallback={<div className="text-muted">Loading...</div>}>
        <GoogleLoginButton />
      </Suspense>
    </div>
  );
}
