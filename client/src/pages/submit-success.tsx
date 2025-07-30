import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { toast } = useToast();

  // Process form submission after successful payment
  const processSubmissionAfterPayment = async () => {
    try {
      // Get form data from localStorage
      const pendingSubmissionData = localStorage.getItem('pendingSubmission');
      if (!pendingSubmissionData) {
        throw new Error('No pending submission data found');
      }

      const { formData, plan, email } = JSON.parse(pendingSubmissionData);

      // Helper function to get file from blob URL
      const getFileFromBlobUrl = async (blobUrl: string, fileName: string): Promise<File> => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
      };

      // Helper function to process image file
      const processImageFile = async (file: File): Promise<{ base64: string; contentType: string; filename: string }> => {
        try {
          const reader = new FileReader();
          const base64Data = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]); // Remove data:image/xxx;base64, prefix
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          return {
            base64: base64Data,
            contentType: file.type,
            filename: file.name
          };
        } catch (error) {
          console.error('Error converting file to base64:', error);
          throw new Error('Failed to process image');
        }
      };

      // Upload attachment to Airtable using the upload API
      const uploadAttachmentToAirtable = async (recordId: string, fieldName: string, imageData: { base64: string; contentType: string; filename: string }) => {
        const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID;

        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
          throw new Error('Airtable configuration missing');
        }

        const uploadUrl = `https://content.airtable.com/v0/${AIRTABLE_BASE_ID}/${recordId}/${encodeURIComponent(fieldName)}/uploadAttachment`;
        
        console.log(`Uploading ${imageData.filename} to field ${fieldName} for record ${recordId}`);
        
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contentType: imageData.contentType,
            file: imageData.base64,
            filename: imageData.filename
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Upload failed for ${fieldName}:`, response.status, errorText);
          throw new Error(`Upload failed: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        console.log(`Successfully uploaded ${imageData.filename} to ${fieldName}:`, result);
        return result;
      };

      // Process files
      let logoData: { base64: string; contentType: string; filename: string } | null = null;
      if (formData["Logo Upload"]?.url && formData["Logo Upload"]?.url.startsWith('blob:')) {
        try {
          console.log('Processing logo file...');
          const logoFile = await getFileFromBlobUrl(formData["Logo Upload"].url, formData["Logo Upload"].name);
          logoData = await processImageFile(logoFile);
          console.log('Logo processed successfully');
        } catch (error) {
          console.error('Error processing logo:', error);
        }
      }

      let highlightImageData: { base64: string; contentType: string; filename: string } | null = null;
      if (formData["Highlight Image"]?.url && formData["Highlight Image"]?.url.startsWith('blob:')) {
        try {
          console.log('Processing highlight image...');
          const imageFile = await getFileFromBlobUrl(formData["Highlight Image"].url, formData["Highlight Image"].name);
          highlightImageData = await processImageFile(imageFile);
          console.log('Highlight image processed successfully');
        } catch (error) {
          console.error('Error processing highlight image:', error);
        }
      }

      let ratingScreenshotData: { base64: string; contentType: string; filename: string } | null = null;
      if (formData["Rating (X/5) & Reviews (#) Screenshot"]?.url && formData["Rating (X/5) & Reviews (#) Screenshot"]?.url.startsWith('blob:')) {
        try {
          console.log('Processing rating screenshot...');
          const screenshotFile = await getFileFromBlobUrl(formData["Rating (X/5) & Reviews (#) Screenshot"].url, formData["Rating (X/5) & Reviews (#) Screenshot"].name);
          ratingScreenshotData = await processImageFile(screenshotFile);
          console.log('Rating screenshot processed successfully');
        } catch (error) {
          console.error('Error processing rating screenshot:', error);
        }
      }
      
      // Create Airtable submission (similar to submit page logic)
      const submissionData: any = {
        "Email": email,
        "Brand Name": formData["Brand Name"],
        "Direct Booking Website": formData["Direct Booking Website"],
        "Number of Listings": formData["Number of Listings"],
        "Countries": formData["Countries"].join(", "),
        "Cities / Regions": formData["Cities / Regions"].map((city: any) => city.name).join(", "),
        "One-line Description": formData["One-line Description"],
        "Why Book With You": formData["Why Book With You?"],
        "Top Stats": formData["Top Stats"] || "",
        "Types of Stays": formData["Types of Stays"] || [],
        "Ideal For": formData["Ideal For"] || [],
        "Perks / Amenities": formData["Perks / Amenities"] || [],
        "Vibe / Aesthetic": formData["Vibe / Aesthetic"] || [],
        "Instagram": formData["Instagram"] || "",
        "Facebook": formData["Facebook"] || "",
        "LinkedIn": formData["LinkedIn"] || "",
        "TikTok": formData["TikTok"] || "",
        "YouTube / Video Tour": formData["YouTube / Video Tour"] || "",
        "Plan": plan === "Basic (€99.99/year)" ? "Basic Listing - €99.99/year" : plan === "Premium (€499.99/year)" ? "Premium Listing - €499.99/year" : plan,
        "Submission Date": new Date().toISOString().split('T')[0],
        "Status": plan === "Premium (€499.99/year)" ? "Approved – Published" : "Pending Review"
      };

      // Submit to Airtable
      const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY;
      const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID;
      const AIRTABLE_TABLE_NAME = 'Directory Submissions';

      if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        throw new Error('Airtable configuration missing in environment variables');
      }

      const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
      
      const response = await fetch(airtableUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: submissionData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const recordId = result.id;
      console.log('Record created with ID:', recordId);
      
      // STEP 2: Upload attachments to the created record
      const uploadPromises = [];
      
      if (logoData) {
        console.log('Uploading logo attachment...');
        uploadPromises.push(
          uploadAttachmentToAirtable(recordId, 'Logo', logoData)
            .then(() => console.log('Logo uploaded successfully'))
            .catch(error => {
              console.error('Logo upload failed:', error);
              toast({
                title: "Logo upload failed",
                description: "The submission was created but the logo couldn't be uploaded. You can add it manually later.",
                variant: "destructive",
              });
            })
        );
      }
      
      if (highlightImageData) {
        console.log('Uploading highlight image attachment...');
        uploadPromises.push(
          uploadAttachmentToAirtable(recordId, 'Highlight Image', highlightImageData)
            .then(() => console.log('Highlight image uploaded successfully'))
            .catch(error => {
              console.error('Highlight image upload failed:', error);
              toast({
                title: "Highlight image upload failed",
                description: "The submission was created but the highlight image couldn't be uploaded. You can add it manually later.",
                variant: "destructive",
              });
            })
        );
      }
      
      if (ratingScreenshotData) {
        console.log('Uploading rating screenshot attachment...');
        uploadPromises.push(
          uploadAttachmentToAirtable(recordId, 'Rating (X/5) & Reviews (#) Screenshot', ratingScreenshotData)
            .then(() => console.log('Rating screenshot uploaded successfully'))
            .catch(error => {
              console.error('Rating screenshot upload failed:', error);
              toast({
                title: "Rating screenshot upload failed",
                description: "The submission was created but the rating screenshot couldn't be uploaded. You can add it manually later.",
                variant: "destructive",
              });
            })
        );
      }
      
      // Wait for all uploads to complete (but don't fail if some uploads fail)
      if (uploadPromises.length > 0) {
        console.log('Waiting for attachment uploads to complete...');
        await Promise.allSettled(uploadPromises);
        console.log('All attachment uploads completed');
      }

      // Clear localStorage after successful submission
      localStorage.removeItem('pendingSubmission');
      setSubmissionStatus('success');
      
    } catch (error) {
      console.error('Error processing submission after payment:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setSubmissionStatus('error');
    }
  };

  useEffect(() => {
    // Get session_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get('session_id');
    setSessionId(sessionIdFromUrl);

    // If we have a session ID (successful payment), process the submission
    if (sessionIdFromUrl) {
      processSubmissionAfterPayment();
    } else {
      // No session ID means this page was accessed directly
      setSubmissionStatus('error');
      setErrorMessage('No payment session found. Please complete the payment process.');
    }
  }, []);

  // Render different content based on submission status
  const renderContent = () => {
    switch (submissionStatus) {
      case 'processing':
        return (
          <>
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl text-blue-600">Processing Your Submission...</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="text-lg mb-4">
                  Payment successful! We're now creating your listing submission.
                </p>
                <p className="text-sm text-gray-500">
                  This should only take a few seconds...
                </p>
              </div>
            </CardContent>
          </>
        );

      case 'success':
        return (
          <>
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Submission Complete!</CardTitle>
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
          </>
        );

      case 'error':
        return (
          <>
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Submission Error</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="text-lg mb-4">
                  There was an issue processing your submission after payment.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm">
                    <strong>Error:</strong> {errorMessage}
                  </p>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Don't worry! Your payment was successful. Please contact our support team and we'll manually process your submission.
                </p>

                <p className="text-sm text-gray-500">
                  {sessionId && (
                    <>Session ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{sessionId}</code></>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = "mailto:bookdirectstays@gmail.com?subject=Submission Error&body=Session ID: " + sessionId}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Contact Support
                </Button>
                
                <Button 
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          {renderContent()}
        </Card>
      </div>
    </div>
  );
}