import LoginWithGoogle from "@/components/auth/LoginWithGoogle";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center bg-gray-50">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-gray-500">Please log in to continue</p>
        </header>
        <LoginWithGoogle />
      </section>
    </main>
  );
}
