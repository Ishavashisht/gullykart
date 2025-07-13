// Configuration for the master Gmail account
const MASTER_EMAIL_CONFIG = {
  // These would typically be environment variables
  GMAIL_USER: import.meta.env.VITE_GMAIL_USER || 'your-master-gmail@gmail.com',
  GMAIL_APP_PASSWORD: import.meta.env.VITE_GMAIL_APP_PASSWORD || 'your-app-password',
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: 587,
};

// OTP storage (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export class EmailService {
  // Generate a 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP with 5-minute expiration
  static storeOTP(email: string, otp: string): void {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(email, { otp, expiresAt });
  }

  // Verify OTP
  static verifyOTP(email: string, inputOTP: string): boolean {
    const stored = otpStore.get(email);
    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return false;
    }

    if (stored.otp === inputOTP) {
      otpStore.delete(email);
      return true;
    }

    return false;
  }

  // Send OTP via master Gmail (simulated for frontend)
  static async sendOTP(to: string, name?: string): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOTP();
      this.storeOTP(to, otp);

      // In a real application, this would be handled by your backend
      // This is a simulation for the frontend demo
      const emailContent = this.generateOTPEmailTemplate(otp, name);
      
      // Simulate API call to backend email service
      console.log('=== OTP EMAIL SIMULATION ===');
      console.log(`To: ${to}`);
      console.log(`From: ${MASTER_EMAIL_CONFIG.GMAIL_USER}`);
      console.log(`Subject: Your GullyKart Verification Code`);
      console.log(`OTP: ${otp}`);
      console.log('=============================');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, show the OTP in a toast or console
      // In production, remove this and only send via email
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          alert(`Demo Mode: Your OTP is ${otp}`);
        }, 1500);
      }

      return {
        success: true,
        message: `OTP sent successfully to ${to}`,
      };
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }

  // Generate HTML email template for OTP
  private static generateOTPEmailTemplate(otp: string, name?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>GullyKart Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px;">
            <h2>Welcome to GullyKart Vision!</h2>
            <p>Hello ${name || 'there'},</p>
            <p>Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;
  }
}
