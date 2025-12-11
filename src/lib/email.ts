import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
// ===================================
// INTERFACE: APPROVAL EMAIL
// ===================================
interface SendApprovalEmailParams {
  to: string;
  name: string;
  storeName: string;
  email: string;
  password: string;
}
// ===================================
// INTERFACE: REJECTION EMAIL
// ===================================
interface SendRejectionEmailParams {
  to: string;
  name: string;
  storeName: string;
  reason: string;
}
// ===================================
// FUNCTION: SEND APPROVAL EMAIL
// ===================================
export async function sendApprovalEmail({
  to,
  name,
  storeName,
  email,
  password
}: SendApprovalEmailParams): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MarketPlace <onboarding@resend.dev>',
      to: [to],
      subject: '🎉 Your Seller Account Has Been Approved!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
              }
              .credentials {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
              }
              .credential-item {
                margin: 10px 0;
                padding: 10px;
                background: #f3f4f6;
                border-radius: 4px;
              }
              .credential-label {
                font-weight: bold;
                color: #667eea;
                display: block;
                margin-bottom: 5px;
              }
              .credential-value {
                font-family: 'Courier New', monospace;
                font-size: 16px;
                color: #1f2937;
              }
              .button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
              .warning {
                background: #fef3c7;
                border: 1px solid #fbbf24;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
  <div class="header">
    <h1>🎉 Selamat Datang di MarketPlace!</h1>
    <p>Akun penjual Anda untuk <strong>${storeName}</strong> telah disetujui</p>
  </div>
  
  <div class="content">
    <p>Halo <strong>${name}</strong>,</p>
    
    <p>
      Selamat! Akun penjual Anda telah berhasil disetujui dan kini aktif. 
      Anda sudah dapat mulai menjual produk Anda segera!
    </p>
    
    <div class="credentials">
      <h3>Kredensial Login Anda</h3>
      
      <div class="credential-item">
        <span class="credential-label">Email:</span>
        <span class="credential-value">${email}</span>
      </div>
      
      <div class="credential-item">
        <span class="credential-label">Kata Sandi Sementara:</span>
        <span class="credential-value">${password}</span>
      </div>
    </div>
    
    <div class="warning">
      <strong>⚠️ Penting:</strong> Harap ubah kata sandi Anda setelah login pertama demi keamanan akun.
    </div>
    
    <center>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">
        Masuk ke Dashboard Penjual
      </a>
    </center>
    
    <h3>Apa Langkah Selanjutnya?</h3>
    <ul>
      <li>Masuk ke dashboard penjual Anda</li>
      <li>Lengkapi informasi profil toko</li>
      <li>Tambahkan produk pertama Anda</li>
      <li>Mulai menerima pesanan dari pelanggan!</li>
    </ul>
    
    <p>
      Jika Anda memiliki pertanyaan atau membutuhkan bantuan, 
      jangan ragu untuk menghubungi tim dukungan kami.
    </p>
    
    <p>
      Selamat berjualan!<br>
      <strong>Tim MarketPlace</strong>
    </p>
  </div>
  
  <div class="footer">
    <p>Email ini dikirim secara otomatis. Mohon untuk tidak membalas pesan ini.</p>
    <p>&copy; ${new Date().getFullYear()} MarketPlace. Seluruh hak cipta dilindungi.</p>
  </div>
</body>

        </html>
      `
    });
    if (error) {
      console.error('Resend approval email error:', error);
      return false;
    }
    console.log('Approval email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Approval email sending error:', error);
    return false;
  }
}
// ===================================
// FUNCTION: SEND REJECTION EMAIL
// ===================================
export async function sendRejectionEmail({
  to,
  name,
  storeName,
  reason
}: SendRejectionEmailParams): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MarketPlace <onboarding@resend.dev>',
      to: [to],
      subject: '❌ Your Seller Registration Has Been Rejected',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
              }
              .reason-box {
                background: #fef2f2;
                border-left: 4px solid #ef4444;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .reason-label {
                font-weight: bold;
                color: #dc2626;
                display: block;
                margin-bottom: 10px;
                font-size: 14px;
                text-transform: uppercase;
              }
              .reason-text {
                color: #991b1b;
                font-size: 16px;
                line-height: 1.8;
              }
              .info-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #3b82f6;
              }
              .button {
                display: inline-block;
                background: #3b82f6;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>❌ Registration Not Approved</h1>
              <p>Seller account for <strong>${storeName}</strong></p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              
              <p>Thank you for your interest in joining MarketPlace as a seller. After careful review, we regret to inform you that your seller registration has not been approved at this time.</p>
              
              <div class="reason-box">
                <span class="reason-label">Reason for Rejection:</span>
                <p class="reason-text">${reason}</p>
              </div>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #1f2937;">What Can You Do Next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Review the rejection reason carefully</li>
                  <li>Address the issues mentioned above</li>
                  <li>Prepare updated documentation if needed</li>
                  <li>Submit a new registration after improvements</li>
                </ul>
              </div>
              
              <p>We encourage you to reapply once you've addressed the issues mentioned. Our goal is to maintain a high-quality marketplace for both sellers and buyers.</p>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/seller/register" class="button">
                  Register Again
                </a>
              </center>
              
              <p>If you have any questions about this decision or need clarification, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br>
              <strong>The MarketPlace Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} MarketPlace. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    });
    if (error) {
      console.error('Resend rejection email error:', error);
      return false;
    }
    console.log('Rejection email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Rejection email sending error:', error);
    return false;
  }
}
