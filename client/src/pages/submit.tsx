import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CountryMultiSelect } from "../components/country-multi-select";
import { FileDrop } from "../components/file-drop";
import { CityRegionAsyncMultiSelect } from "../components/city-region-async-multi-select";
import { SimpleMultiSelect } from "../components/simple-multi-select";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { CheckboxGroup } from "../components/checkbox-group";
import { SearchableMultiSelect } from "../components/searchable-multi-select";
import { airtableService } from "@/lib/airtable";
import { createCheckoutSession } from "@/lib/stripe";

const planEnum = z.enum(["Basic (€99.99/year)", "Premium (€499.99/year)"]);
const formSchema = z.object({
  "Brand Name": z.string().min(2),
  "Direct Booking Website": z.string().url(),
  "Number of Listings": z.coerce.number().min(1),
  "Countries": z.array(z.string()).min(1),
  "Cities / Regions": z.array(z.object({ name: z.string(), displayName: z.string(), geonameId: z.number() })).min(1),
  "Logo Upload": z.object({
    url: z.string().url(),
    name: z.string()
  }),
  "Highlight Image": z.object({
    url: z.string().url(),
    name: z.string()
  }),
  "Rating (X/5) & Reviews (#) Screenshot": z.object({
    url: z.string().url(),
    name: z.string()
  }),
  "One-line Description": z.string().min(5).max(70),
  "Why Book With You?": z.string().min(10),
  "Top Stats": z.string().min(1, "Please share your top stats (e.g., average rating, number of reviews, etc.)"),
  "Types of Stays": z.array(z.string()).optional(),
  "Ideal For": z.array(z.string()).optional(),
  "Is your brand pet-friendly?": z.boolean().optional(),
  "Perks / Amenities": z.array(z.string()).optional(),
  "Eco-Conscious Stay?": z.boolean().optional(),
  "Remote-Work Friendly?": z.boolean().optional(),
  "Vibe / Aesthetic": z.array(z.string()).optional(),
  "Instagram": z.string().url().optional().or(z.literal("")),
  "Facebook": z.string().url().optional().or(z.literal("")),
  "LinkedIn": z.string().url().optional().or(z.literal("")),
  "TikTok": z.string().url().optional().or(z.literal("")),
  "YouTube / Video Tour": z.string().url().optional().or(z.literal("")),
  "Choose Your Listing Type": planEnum,
  "Submitted By (Email)": z.string().email(),
});
type FormValues = z.infer<typeof formSchema>;

const COUNTRIES = [
  "USA", "Spain", "UK", "Germany", "France", "Australia", "Canada", "Italy", "Portugal", "Thailand", "Greece"
];
const CITIES = [
  "Bali", "Lisbon", "Dolomites", "Paris", "Rome", "Bangkok", "Athens"
];
const TYPES_OF_STAYS = [
  "Villas", "Cabins", "Apartments", "Domes", "Chalets", "Beach Houses"
];
const IDEAL_FOR = [
  "Families", "Digital Nomads", "Retreats", "Couples", "Groups", "Companies", "Solo travelers"
];
const PERKS = [
  "Pool", "Breakfast", "Self check-in", "WiFi", "Parking", "Pet-friendly", "Eco-friendly", "Remote-work friendly", "Smoking friendly", "Concierge", "Early check-in", "Late check-out", "Mid-stay cleaning"
];
const VIBES = [
  "Boho", "Minimalist", "Design-led", "Rustic", "Modern"
];

// Helper for required asterisk with tooltip
const RequiredAsterisk = () => (
  <span
    className="text-red-500 ml-1 align-middle cursor-help"
    aria-label="mandatory"
    title="mandatory"
  >
    *
  </span>
);

export default function Submit() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "Brand Name": "",
      "Direct Booking Website": "",
      "Number of Listings": 1,
      "Countries": [],
      "Cities / Regions": [],
      "Logo Upload": { url: "", name: "" },
      "Highlight Image": { url: "", name: "" },
      "Rating (X/5) & Reviews (#) Screenshot": { url: "", name: "" },
      "One-line Description": "",
      "Why Book With You?": "",
      "Top Stats": "",
      "Types of Stays": [],
      "Ideal For": [],
      "Is your brand pet-friendly?": false,
      "Perks / Amenities": [],
      "Eco-Conscious Stay?": false,
      "Remote-Work Friendly?": false,
      "Vibe / Aesthetic": [],
      "Instagram": "",
      "Facebook": "",
      "LinkedIn": "",
      "TikTok": "",
      "YouTube / Video Tour": "",
      "Choose Your Listing Type": "Basic (€99.99/year)",
      "Submitted By (Email)": "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Redirect to Stripe Checkout instead of directly submitting to Airtable
      await createCheckoutSession(
        values, // Pass entire form data
        values["Choose Your Listing Type"], // Plan selection
        values["Submitted By (Email)"] // Customer email
      );
      
      // The user will be redirected to Stripe Checkout
      // Form will be processed via webhook after successful payment
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: "Failed to redirect to payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Keep the original submission logic for webhook processing
  const processFormSubmission = async (values: FormValues) => {
    try {
      // Helper function to get file from blob URL
      const getFileFromBlobUrl = async (blobUrl: string, fileName: string): Promise<File> => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
      };

      // First, let's get the actual field names from Airtable Meta API
      const getAirtableFields = async () => {
        const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID;
        
        const response = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          }
        });
        
        const data = await response.json();
        const directorySubmissionsTable = data.tables.find((table: any) => table.name === 'Directory Submissions');
        
        if (directorySubmissionsTable) {
          const fieldNames = directorySubmissionsTable.fields.map((f: any) => f.name);
          console.log('Actual Airtable fields:', fieldNames);
          console.log('Field names as list:', fieldNames.join(', '));
          return directorySubmissionsTable.fields;
        }
        
        throw new Error('Directory Submissions table not found');
      };

      // Get the actual field names
      const airtableFields = await getAirtableFields();
      
      // Find the email field (might be E-mail, Email, etc.)
      const emailField = airtableFields.find((f: any) => 
        f.name.toLowerCase().includes('email') || f.name.toLowerCase().includes('e-mail')
      );
      
      console.log('Found email field:', emailField?.name);

      // Helper function to convert file to base64 for Airtable upload API
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:image/png;base64, prefix for Airtable API
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = error => reject(error);
        });
      };

      // Process image file and return base64 data (without data URL prefix)
      const processImageFile = async (file: File): Promise<{ base64: string; contentType: string; filename: string }> => {
        console.log(`Processing image file: ${file.name} Size: ${file.size} Type: ${file.type}`);
        
        try {
          const base64Data = await fileToBase64(file);
          console.log(`Successfully converted to base64, length: ${base64Data.length}`);
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

      // Process logo file
      let logoData: { base64: string; contentType: string; filename: string } | null = null;
      if (values["Logo Upload"]?.url && values["Logo Upload"]?.url.startsWith('blob:')) {
        try {
          console.log('Processing logo file...');
          console.log('Logo file info:', {
            url: values["Logo Upload"].url,
            name: values["Logo Upload"].name
          });
          
          const logoFile = await getFileFromBlobUrl(values["Logo Upload"].url, values["Logo Upload"].name);
          console.log('Logo file created:', {
            name: logoFile.name,
            size: logoFile.size,
            type: logoFile.type
          });
          
          logoData = await processImageFile(logoFile);
          console.log('Logo processed successfully, base64 length:', logoData.base64.length);
          
        } catch (error) {
          console.error('Error processing logo:', error);
          toast({
            title: "Logo upload failed",
            description: `Could not process logo file: ${error instanceof Error ? error.message : 'Unknown error'}. Submission will continue without logo.`,
            variant: "destructive",
          });
          logoData = null;
        }
      } else {
        console.log('No logo file to process or invalid URL');
      }

      // Process highlight image file
      let highlightImageData: { base64: string; contentType: string; filename: string } | null = null;
      if (values["Highlight Image"]?.url && values["Highlight Image"]?.url.startsWith('blob:')) {
        try {
          console.log('Processing highlight image file...');
          console.log('Highlight image info:', {
            url: values["Highlight Image"].url,
            name: values["Highlight Image"].name
          });
          
          const imageFile = await getFileFromBlobUrl(values["Highlight Image"].url, values["Highlight Image"].name);
          console.log('Highlight image file created:', {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type
          });
          
          highlightImageData = await processImageFile(imageFile);
          console.log('Highlight image processed successfully, base64 length:', highlightImageData.base64.length);
          
        } catch (error) {
          console.error('Error processing highlight image:', error);
          toast({
            title: "Highlight image upload failed",
            description: `Could not process highlight image: ${error instanceof Error ? error.message : 'Unknown error'}. Submission will continue without image.`,
            variant: "destructive",
          });
          highlightImageData = null;
        }
      } else {
        console.log('No highlight image to process or invalid URL');
      }

      // Process rating screenshot file
      let ratingScreenshotData: { base64: string; contentType: string; filename: string } | null = null;
      if (values["Rating (X/5) & Reviews (#) Screenshot"]?.url && values["Rating (X/5) & Reviews (#) Screenshot"]?.url.startsWith('blob:')) {
        try {
          console.log('Processing rating screenshot file...');
          console.log('Rating screenshot info:', {
            url: values["Rating (X/5) & Reviews (#) Screenshot"].url,
            name: values["Rating (X/5) & Reviews (#) Screenshot"].name
          });
          
          const screenshotFile = await getFileFromBlobUrl(values["Rating (X/5) & Reviews (#) Screenshot"].url, values["Rating (X/5) & Reviews (#) Screenshot"].name);
          console.log('Rating screenshot file created:', {
            name: screenshotFile.name,
            size: screenshotFile.size,
            type: screenshotFile.type
          });
          
          ratingScreenshotData = await processImageFile(screenshotFile);
          console.log('Rating screenshot processed successfully, base64 length:', ratingScreenshotData.base64.length);
          
        } catch (error) {
          console.error('Error processing rating screenshot:', error);
          toast({
            title: "Rating screenshot upload failed",
            description: `Could not process rating screenshot: ${error instanceof Error ? error.message : 'Unknown error'}. Please try uploading again.`,
            variant: "destructive",
          });
          ratingScreenshotData = null;
        }
      } else {
        console.log('No rating screenshot to process or invalid URL');
      }

      // STEP 1: Create record with text fields only (no attachments yet)
      const submissionData: any = {
        "Email": values["Submitted By (Email)"],
        "Brand Name": values["Brand Name"],
        "Direct Booking Website": values["Direct Booking Website"],
        "Number of Listings": values["Number of Listings"],
        "Countries": values["Countries"].join(", "),
        "Cities / Regions": values["Cities / Regions"].map(city => city.name).join(", "),
        "One-line Description": values["One-line Description"],
        "Why Book With You": values["Why Book With You?"],
        "Top Stats": values["Top Stats"] || "",
        "Types of Stays": values["Types of Stays"] || [],
        "Ideal For": values["Ideal For"] || [],
        "Perks / Amenities": values["Perks / Amenities"] || [],
        "Vibe / Aesthetic": values["Vibe / Aesthetic"] || [],
        "Instagram": values["Instagram"] || "",
        "Facebook": values["Facebook"] || "",
        "LinkedIn": values["LinkedIn"] || "",
        "TikTok": values["TikTok"] || "",
        "YouTube / Video Tour": values["YouTube / Video Tour"] || "",
        "Plan": values["Choose Your Listing Type"] === "Basic (€99.99/year)" ? "Basic Listing - €99.99/year" : values["Choose Your Listing Type"] === "Premium (€499.99/year)" ? "Premium Listing - €499.99/year" : values["Choose Your Listing Type"],
        "Submission Date": new Date().toISOString().split('T')[0],
        // Status workflow:
        // - Standard plans: start as "Pending Review" (manual approval required)
        // - Premium plans: start as "Approved – Published" (auto-approved, note: em dash)
        // - Frontend only shows "Approved – Published" records
        // - Any other status ("Pending Review", "Rejected") withdraws from frontend
        "Status": values["Choose Your Listing Type"] === "Premium (€499.99/year)" ? "Approved – Published" : "Pending Review"
      };

      console.log("=== SUBMISSION DATA DEBUG ===");
      console.log("Plan selected:", values["Choose Your Listing Type"]);
      console.log("Initial status will be:", submissionData["Status"]);
      console.log("Logo data:", logoData ? `${logoData.filename} (${logoData.base64.length} chars)` : 'None');
      console.log("Highlight Image data:", highlightImageData ? `${highlightImageData.filename} (${highlightImageData.base64.length} chars)` : 'None');
      console.log("Rating Screenshot data:", ratingScreenshotData ? `${ratingScreenshotData.filename} (${ratingScreenshotData.base64.length} chars)` : 'None');
      console.log("Full submission data:", submissionData);
      console.log("=== END DEBUG ===");

      // Submit directly to Airtable using two-step process
      const airtableService = {
        async createSubmission(data: any) {
          const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY;
          const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID;
          const AIRTABLE_TABLE_NAME = 'Directory Submissions';

          if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            throw new Error('Airtable configuration missing in environment variables');
          }

          const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
          
          // STEP 1: Create record with text fields only (no attachments)
          console.log('Creating Airtable record with data:', data);

          const response = await fetch(airtableUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: data
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Full Airtable error response:', errorData);
            throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
          }

          const result = await response.json();
          console.log('Airtable record created successfully:', result);
          return result;
        }
      };

      console.log('Creating Airtable record...');
      const result = await airtableService.createSubmission(submissionData);
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
          uploadAttachmentToAirtable(recordId, 'Rating Screenshot', ratingScreenshotData)
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
      
      // Show different success messages based on plan type
      const isPremium = values["Choose Your Listing Type"] === "Premium (€499.99/year)";
      
      toast({
        title: "Submission successful!",
        description: isPremium 
          ? "Your premium property has been approved and published! It will appear on the site shortly."
          : "Your property has been submitted for review. We'll review it and get back to you soon!",
        variant: "default",
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">🚀 Boost your Direct Bookings!</h1>
        <p className="text-gray-600 mb-8">Join our directory and connect with travelers looking to book directly.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Section 1: Brand Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🧾 Brand Info</h2>
              <FormField control={form.control} name="Submitted By (Email)" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your e-mail<RequiredAsterisk /></FormLabel>
                  <FormControl><Input type="email" {...field} placeholder="e.g. john@wynwood-house.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Brand Name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name<RequiredAsterisk /></FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Wynwood House" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Direct Booking Website" render={({ field }) => (
                <FormItem>
                  <FormLabel>Direct Booking Website<RequiredAsterisk /></FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://wynwood-house.com/" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Number of Listings" render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Listings<RequiredAsterisk /></FormLabel>
                  <FormControl><Input type="number" min="1" {...field} placeholder="e.g. 12" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Countries" render={({ field }) => (
                <FormItem>
                  <FormLabel>Countries<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <CountryMultiSelect
                      selected={field.value || []}
                      onSelect={(values: string[]) => field.onChange(values)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Cities / Regions" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cities<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <CityRegionAsyncMultiSelect
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Paris, New York"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Logo Upload" render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <FileDrop
                      onFileDrop={(file: File) => {
                        field.onChange({
                          url: URL.createObjectURL(file),
                          name: file.name
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Highlight Image" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Highlight Image (This will be the main image shown on your company card in the directory)
                    <RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <FileDrop
                      onFileDrop={(file: File) => {
                        field.onChange({
                          url: URL.createObjectURL(file),
                          name: file.name
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="Rating (X/5) & Reviews (#) Screenshot" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rating & Reviews Screenshot (Upload a screenshot showing your ratings and number of reviews from booking platforms)
                    <RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <FileDrop
                      onFileDrop={(file: File) => {
                        field.onChange({
                          url: URL.createObjectURL(file),
                          name: file.name
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 2: Brand Story & Guest Value */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">💬 Brand Story & Guest Value</h2>
              <FormField control={form.control} name="One-line Description" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    One-line Description (70 characters limit)<RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        placeholder="e.g. Boutique apartments in Latin America" 
                        maxLength={70}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 70) {
                            field.onChange(e);
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {field.value?.length || 0}/70
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Why Book With You?" render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Book With You?<RequiredAsterisk /></FormLabel>
                  <FormControl><Textarea rows={4} {...field} placeholder="e.g. Direct rates, local experiences, flexible stays (tell guests what makes you special, why should they book with you direct and not through an OTA)" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Top Stats" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Top Stats <RequiredAsterisk /> (list comma separated: Airbnb SuperHost Badge, 4.8 stars on Airbnb, Over 1000 reviews across platforms, The Shortyz Award for Sustainability)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Airbnb SuperHost Badge, 4.8 stars on Airbnb, Over 1000 reviews across platforms, The Shortyz Award for Sustainability" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Types of Stays" render={({ field }) => (
                <FormItem>
                  <FormLabel>Types of Stays</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={TYPES_OF_STAYS}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Villas, Cabins"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Ideal For" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ideal For</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={IDEAL_FOR}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Families, Digital Nomads"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 3: Perks & Positioning */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🎁 Perks & Positioning <span className='text-base font-normal text-green-700'>(the more, the better)</span></h2>
              <FormField control={form.control} name="Perks / Amenities" render={({ field }) => (
                <FormItem>
                  <FormLabel>Perks / Amenities</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={PERKS}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Pool, WiFi"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Vibe / Aesthetic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vibe / Aesthetic</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={VIBES}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Boho, Minimalist"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 4: Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">📲 Social Links <span className='text-base font-normal text-green-700'>(Recommended for higher conversion)</span></h2>
              <FormField control={form.control} name="Instagram" render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://instagram.com/wynwoodhouse" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Facebook" render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://facebook.com/wynwoodhouse" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="LinkedIn" render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://linkedin.com/company/wynwoodhouse" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="TikTok" render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://tiktok.com/@wynwoodhouse" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="YouTube / Video Tour" render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube / Video Tour</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://youtube.com/watch?v=xxxx" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Plan selection now at the bottom */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose your plan</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div
                  className={`flex-1 border rounded-xl p-6 cursor-pointer transition-all relative flex flex-col ${form.watch("Choose Your Listing Type") === "Basic (€99.99/year)" ? "border-primary bg-primary/5 shadow-lg" : "border-gray-200 bg-white"}`}
                  onClick={() => form.setValue("Choose Your Listing Type", "Basic (€99.99/year)")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={form.watch("Choose Your Listing Type") === "Basic (€99.99/year)"}
                >
                  <div className="flex items-start justify-between mb-2 min-h-[40px]">
                    <div />
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full ml-2">€99.99/year</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Basic Listing</h2>
                  <p className="text-gray-500 mb-4">Standard listing in our directory</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Standard placement in search results</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Detailed stays info</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Link to your booking website</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Get listed in 1-3 months</li>
                  </ul>
                  <div className="mt-auto">
                    <Button variant={form.watch("Choose Your Listing Type") === "Basic (€99.99/year)" ? "default" : "outline"} className="w-full" type="button" onClick={() => form.setValue("Choose Your Listing Type", "Basic (€99.99/year)")}>Select Basic</Button>
                  </div>
                </div>
                <div
                  className={`flex-1 border rounded-xl p-6 cursor-pointer transition-all relative flex flex-col ${form.watch("Choose Your Listing Type") === "Premium (€499.99/year)" ? "border-green-500 bg-green-50 shadow-lg" : "border-gray-200 bg-white"}`}
                  onClick={() => form.setValue("Choose Your Listing Type", "Premium (€499.99/year)")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={form.watch("Choose Your Listing Type") === "Premium (€499.99/year)"}
                >
                  <div className="flex items-start justify-between mb-2 min-h-[40px]">
                    <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">Recommended</span>
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full ml-2">€499.99/year</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Premium Listing</h2>
                  <p className="text-gray-500 mb-4">Priority placement with marketing support</p>
                  <div className="mb-2 font-medium text-gray-700">Same as Basic Listing + :</div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Priority placement in search results</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Featured badge for increased visibility</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Social media ads support</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Website banner ads</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Get listed instantly</li>
                  </ul>
                  <div className="mt-auto">
                    <Button variant={form.watch("Choose Your Listing Type") === "Premium (€499.99/year)" ? "default" : "outline"} className="w-full" type="button" onClick={() => form.setValue("Choose Your Listing Type", "Premium (€499.99/year)")}>Select Premium</Button>
                  </div>
                </div>
              </div>
              {/* Dynamic summary now directly below the plan boxes */}
              <div className="flex justify-end mt-4">
                {form.watch("Choose Your Listing Type") === "Premium (€499.99/year)" ? (
                  <div className="text-green-800 bg-green-100 text-base font-semibold px-4 py-2 rounded-full inline-block">
                    Premium Listing — Total: €499.99/year
                  </div>
                ) : (
                  <div className="text-blue-800 bg-blue-100 text-base font-semibold px-4 py-2 rounded-full inline-block">
                    Basic Listing — Total: €99.99/year
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-8 py-3" disabled={!form.formState.isValid}>
                Submit Listing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
