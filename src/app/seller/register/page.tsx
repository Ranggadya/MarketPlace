import GradientCard from "@components/GradientCard";
import SellerRegisterForm from "@components/SellerRegisterForm";

export default function Page() {
  return (
    <div className="
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
    ">
      <GradientCard>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Registrasi Penjual
        </h1>

        <p className="text-gray-600 mb-8">
          Lengkapi informasi toko dan PIC untuk bergabung sebagai penjual.
        </p>

        <SellerRegisterForm />
      </GradientCard>
    </div>
  );
}
