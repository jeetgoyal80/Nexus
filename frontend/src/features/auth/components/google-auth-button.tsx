import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { env } from "@/shared/lib/env";

type GoogleAuthButtonProps = {
  disabled?: boolean;
  onToken: (idToken: string) => void;
  onError?: () => void;
  text?: "signin_with" | "signup_with" | "continue_with";
};

export function GoogleAuthButton({
  disabled = false,
  onToken,
  onError,
  text = "continue_with",
}: GoogleAuthButtonProps) {
  if (!env.googleClientId) {
    return (
      <Button type="button" variant="outline" className="w-full" disabled>
        Google login unavailable
      </Button>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : undefined}>
      <GoogleLogin
        text={text}
        theme="filled_black"
        shape="rectangular"
        size="large"
        width="350"
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onToken(credentialResponse.credential);
            return;
          }

          onError?.();
        }}
        onError={() => onError?.()}
      />
    </div>
  );
}
