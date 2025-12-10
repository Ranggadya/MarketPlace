// lib/mailer/resend.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const Mailer = {
  async sendSellerApproved({
    to,
    name,
  }: {
    to: string;
    name: string;
  }) {
    try {
      await resend.emails.send({
        from: process.env.MAIL_FROM!,
        to,
        subject: "Akun Penjual Anda telah Disetujui ✔",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #706D54;">Halo ${name},</h2>
            <p>Selamat! Pendaftaran Anda sebagai penjual telah <b style="color:#4CAF50;">DITERIMA</b>.</p>

            <p>Akun Anda sudah aktif dan siap digunakan.  
            Silakan login menggunakan tautan berikut:</p>

            <a href="${process.env.BASE_URL}/seller/login" 
               style="display:inline-block; margin-top:10px; padding:10px 18px; 
               background:#706D54; color:white; text-decoration:none; border-radius:6px;">
              Login Sekarang
            </a>

            <br><br>
            <p>Terima kasih telah bergabung dengan Marketplace kami.</p>
            <p>Salam, <br>Admin Marketplace</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error sendSellerApproved:", error);
      throw new Error("Gagal mengirim email persetujuan.");
    }
  },

  async sendSellerRejected({
    to,
    name,
    reason,
  }: {
    to: string;
    name: string;
    reason: string;
  }) {
    try {
      await resend.emails.send({
        from: process.env.MAIL_FROM!,
        to,
        subject: "Pendaftaran Penjual Ditolak ❌",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #983131;">Halo ${name},</h2>
            <p>Mohon maaf, pendaftaran Anda sebagai penjual telah <b style="color:#C62828;">DITOLAK</b>.</p>

            <p>Alasan penolakan:</p>
            <blockquote style="border-left:4px solid #C62828; padding-left:10px; color:#444;">
              ${reason}
            </blockquote>

            <p>Anda dapat mendaftar ulang setelah memperbaiki data atau dokumen yang dibutuhkan.</p>

            <p>Salam, <br>Admin Marketplace</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error sendSellerRejected:", error);
      throw new Error("Gagal mengirim email penolakan.");
    }
  },
};
