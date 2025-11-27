"use client";

type Props = {
  onSwitch: () => void;
};

export default function RegisterForm({ onSwitch }: Props) {
  return (
    <div className="w-[380px] sm:w-[420px] mx-auto">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Daftar</h1>

      <form className="space-y-5">
        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full px-5 py-3.5 bg-gray-100 rounded-xl text-lg"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-5 py-3.5 bg-gray-100 rounded-xl text-lg"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-5 py-3.5 bg-gray-100 rounded-xl text-lg"
        />

        <button
          type="submit"
          className="
            w-full 
            py-3.5 
            bg-purple-700 
            text-white 
            rounded-xl 
            text-lg
            hover:bg-purple-800 
            transition
          "
        >
          Daftar
        </button>

        <p className="text-sm text-gray-600 text-center mt-3">
          Sudah punya akun?{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            onClick={onSwitch}
          >
            Masuk
          </span>
        </p>
      </form>
    </div>
  );
}
