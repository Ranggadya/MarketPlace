import SellerLoginForm from "@/components/SellerLoginForm";

export default function SellerLoginPage() {
  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gradient-to-br from-primary-light/30 via-accent/10 to-primary/20
        p-4
      "
    >
      <SellerLoginForm />
    </div>
  );
}
