import UniversalLoginForm from "@components/UniversalLoginForm";
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #DB4444 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 lg:p-10 border border-red-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-gray-600">Masuk untuk melanjutkan ke marketplace</p>
          </div>
          {/* Form */}
          <UniversalLoginForm />
        </div>
      </div>
    </div>
  );
}
