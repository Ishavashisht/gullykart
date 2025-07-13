import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailService } from "@/services/emailService";
import { toast } from "sonner";

const DebugPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const testBasic = () => {
    toast.success("Basic React component working!");
    console.log("Debug: Basic test successful");
  };

  const testOTP = async () => {
    setIsLoading(true);
    try {
      const otp = EmailService.generateOTP();
      console.log("Generated OTP:", otp);
      toast.success(`OTP generated: ${otp}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("OTP generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailService = async () => {
    setIsLoading(true);
    try {
      const result = await EmailService.sendOTP("test@example.com", "Test User");
      console.log("Email service result:", result);
      toast.success("Email service test completed - check console");
    } catch (error) {
      console.error("Email service error:", error);
      toast.error("Email service test failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testBasic} className="w-full">
            Test Basic Functionality
          </Button>
          
          <Button 
            onClick={testOTP} 
            disabled={isLoading}
            className="w-full"
          >
            Test OTP Generation
          </Button>
          
          <Button 
            onClick={testEmailService} 
            disabled={isLoading}
            className="w-full"
          >
            Test Email Service
          </Button>

          <div className="text-sm text-gray-600 space-y-2">
            <p>✅ If you can see this page, React is working</p>
            <p>✅ If buttons work, components are loading</p>
            <p>✅ Check console for detailed logs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPage;
