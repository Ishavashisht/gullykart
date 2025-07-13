import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { EmailService } from '@/services/emailService';

const EmailTester = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const result = await EmailService.testEmailConnection();
      if (result) {
        toast.success('✅ Email configuration verified!');
      } else {
        toast.error('❌ Email configuration incomplete');
      }
    } catch (error) {
      toast.error('Configuration test failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestOTP = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await EmailService.sendOTP(testEmail, 'Test User');
      if (result.success) {
        toast.success(`Test OTP generated for ${testEmail}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to generate test OTP');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Service Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email"
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Button
              onClick={testConnection}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Test Configuration
            </Button>
            <Button
              onClick={sendTestOTP}
              disabled={isLoading || !testEmail}
              className="w-full"
            >
              Generate Test OTP
            </Button>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <p>This is a development tool for testing the OTP system.</p>
            <p>OTPs will be shown in alerts and console logs.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTester;
