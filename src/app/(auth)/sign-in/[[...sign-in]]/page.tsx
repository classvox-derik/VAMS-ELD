import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-eld-seashell to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-eld-space-indigo shadow-theme-md">
            <span className="text-lg font-bold text-white">V</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">VAMS ELD</h1>
          <p className="mt-2 text-muted-foreground">
            AI-Powered Scaffolding for ELD Teachers
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-eld-space-indigo hover:bg-eld-dusty-grape text-white",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
