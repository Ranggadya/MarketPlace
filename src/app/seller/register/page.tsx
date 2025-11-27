import SellerRegisterForm from "@/components/SellerRegisterForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-accent flex justify-center items-center p-8">
      <div className="bg-white w-full max-w-3xl p-10 rounded-2xl shadow-2xl">
        <SellerRegisterForm />
      </div>
    </div>
  );
}
