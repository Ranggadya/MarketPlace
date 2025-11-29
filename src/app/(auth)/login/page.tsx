import GradientCard from "@components/GradientCard";
import UniversalLoginForm from "@components/UniversalLoginForm";

export default function LoginPage() {
  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br 
        from-purple-900 
        via-purple-700 
        to-indigo-800 
        flex 
        items-center 
        justify-center 
        px-6 
        py-10
      "
    >
      <GradientCard>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Masuk ke Akun
        </h1>

        <p className="text-gray-600 mb-8">
          Silakan masuk untuk melanjutkan ke marketplace.
        </p>

        <UniversalLoginForm />

        <div className="mt-6 text-sm text-gray-600 text-center">
          <p>
            Belum punya akun?{" "}
            <a
              href="/register"
              className="font-semibold text-purple-600 hover:underline"
            >
              Daftar sekarang
            </a>
          </p>
        </div>
      </GradientCard>
    </div>
  );
}
