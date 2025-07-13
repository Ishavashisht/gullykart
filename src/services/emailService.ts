// Email service for OTP functionality using backend API
// This service communicates with the Express backend for actual email sending

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Local storage for development/testing purposes
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

  // Send OTP via backend API
  static async sendOTP(to: string, name?: string): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      console.log('=== SENDING OTP EMAIL VIA BACKEND ===');
      console.log(`To: ${to}`);
      console.log(`Name: ${name || 'Unknown'}`);
      console.log(`API URL: ${API_BASE_URL}`);

      // Send via backend API
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: to, name }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ OTP sent successfully via backend:', result);
        return {
          success: true,
          message: result.message || `OTP sent successfully to ${to}`,
        };
      } else {
        const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Backend failed:', errorResult);
        return {
          success: false,
          message: errorResult.message || 'Failed to send OTP. Please try again.',
        };
      }
    } catch (error) {
      console.error('❌ Backend API error:', error);
      return {
        success: false,
        message: 'Unable to connect to email service. Please check your internet connection and try again.',
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
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background-color: #f5f5f5; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px; 
              padding: 40px; 
              box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
            }
            .logo { 
              font-size: 28px; 
              font-weight: bold; 
              background: linear-gradient(45deg, #2563eb, #7c3aed);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 10px; 
            }
            .otp-box { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px; 
              padding: 30px; 
              text-align: center; 
              margin: 30px 0; 
              color: white;
            }
            .otp-code { 
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 8px; 
              margin: 15px 0; 
              font-family: 'Courier New', monospace;
            }
            .footer { 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e2e8f0; 
              text-align: center; 
              color: #64748b; 
              font-size: 14px; 
            }
            .warning {
              background: #fef3cd;
              border: 1px solid #facc15;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #854d0e;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛒 GullyKart Vision</div>
              <h1 style="color: #1e293b; margin: 0;">Email Verification</h1>
            </div>
            
            <p style="font-size: 16px; color: #374151;">Hello <strong>${name || 'there'}</strong>,</p>
            
            <p style="color: #374151;">Thank you for signing up with GullyKart Vision! To complete your account setup and start your journey as a seller, please verify your email address using the verification code below:</p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 18px;">Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">This code will expire in 5 minutes</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> Never share this code with anyone. GullyKart team will never ask for your verification code.
            </div>
            
            <p style="color: #374151;">If you didn't create an account with GullyKart Vision, you can safely ignore this email.</p>
            
            <p style="color: #374151;">Welcome to the future of e-commerce!</p>
            
            <div class="footer">
              <p><strong>GullyKart Vision Team</strong></p>
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2025 GullyKart Vision. All rights reserved.</p>
              <p style="margin-top: 15px;">
                <a href="#" style="color: #2563eb; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #2563eb; text-decoration: none;">Terms of Service</a> | 
                <a href="#" style="color: #2563eb; text-decoration: none;">Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Test backend email connection
  static async testEmailConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing backend email connection...');
      const response = await fetch(`${API_BASE_URL}/test-email`);
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend email connection test:', result);
        return result.success;
      } else {
        console.warn('❌ Backend email connection test failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Cannot connect to backend:', error);
      return false;
    }
  }

  // Test connectivity to backend (for debugging)
  static async testConnectivity(): Promise<void> {
    console.log('🔍 Testing backend connectivity...');
    console.log(`API Base URL: ${API_BASE_URL}`);
    
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend connectivity test passed:', result);
      } else {
        console.error('❌ Backend responded with error:', response.status);
      }
    } catch (error) {
      console.error('❌ Backend connectivity test failed:', error);
    }
  }

  // Verify OTP via backend API
  static async verifyOTPAsync(email: string, inputOTP: string): Promise<boolean> {
    try {
      // Try backend API first
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: inputOTP }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ OTP verified via backend:', result);
        return result.success;
      } else {
        console.warn('❌ Backend verification failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Backend verification error:', error);
      return false;
    }
  }
}
