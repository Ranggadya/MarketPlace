import GradientCard from "@/components/GradientCard";
import LoginForm from "@/components/LoginForm";

export default function SellerLoginPage() {
  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 
      flex items-center justify-center 
      px-6 py-10
    ">
      <GradientCard>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Login Penjual
        </h1>

        <p className="text-gray-600 mb-8">
          Masukkan email dan password untuk masuk ke dashboard penjual.
        </p>

        <LoginForm />
        <p className="mt-6 text-sm text-gray-600 text-center">
          Belum punya akun?{" "}
          <a
            href="/seller/register"
            className="font-semibold text-purple-600 hover:underline"
          >
            Daftar di sini
          </a>
        </p>
      </GradientCard>
    </div>
  );
}
