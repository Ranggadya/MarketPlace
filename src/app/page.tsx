export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      <p className="mt-4">
        Selamat datang!  
        Akses registrasi penjual di:
      </p>

      <a
        href="/seller/register"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Registrasi Penjual
      </a>
    </main>
  );
}
