import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function SubmitSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get('session_id');
    setSessionId(sessionIdFromUrl);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="text-lg mb-4">
                Thank you for your subscription! Your listing has been submitted successfully.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-left text-blue-700 space-y-2 text-sm">
                  <li>• Your submission will be reviewed within 24-48 hours</li>
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• Once approved, your listing will appear on BookDirectStays.com</li>
                  <li>• You'll get access to analytics and listing management tools</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500">
                {sessionId && (
                  <>Session ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{sessionId}</code></>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setLocation("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Return to Home
              </Button>
              
              <Button 
                onClick={() => setLocation("/submit")}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Submit Another Listing
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Contact us at{" "}
                <a 
                  href="mailto:bookdirectstays@gmail.com" 
                  className="text-blue-600 hover:underline"
                >
                  bookdirectstays@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}