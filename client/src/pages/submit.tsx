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

const planEnum = z.enum(["Free", "Featured ($49.99)"]);
const formSchema = z.object({
  "Brand Name": z.string().min(2),
  "Direct Booking Website": z.string().url(),
  "Number of Listings": z.coerce.number().min(1),
  "Countries": z.array(z.string()).min(1),
  "Cities / Regions": z.array(z.object({ name: z.string(), geonameId: z.number() })).min(1),
  "Logo Upload": z.object({
    url: z.string().url(),
    name: z.string()
  }),
  "Highlight Image": z.object({
    url: z.string().url(),
    name: z.string()
  }),
  "One-line Description": z.string().min(5),
  "Why Book With You?": z.string().min(10),
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
      "One-line Description": "",
      "Why Book With You?": "",
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
      "Choose Your Listing Type": "Free",
      "Submitted By (Email)": "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all the form data - matching database field names exactly
      formData.append('Brand_name', values["Brand Name"]);
      formData.append('Direct_Booking_Website', values["Direct Booking Website"]);
      formData.append('Number_of_Listings', values["Number of Listings"].toString());
      formData.append('E_mail', values["Submitted By (Email)"]);
      formData.append('Countries', JSON.stringify(values["Countries"]));
      formData.append('Cities_Regions', JSON.stringify(values["Cities / Regions"]));
      
      // Map to the generic field names as per database schema
      formData.append('field9', values["One-line Description"]);
      formData.append('field10', values["Why Book With You?"]);
      formData.append('field11', values["Choose Your Listing Type"]);
      formData.append('field13', JSON.stringify(values["Ideal For"] || []));
      formData.append('field14', (values["Is your brand pet-friendly?"] || false).toString());
      formData.append('field15', JSON.stringify(values["Perks / Amenities"] || []));
      formData.append('field16', (values["Eco-Conscious Stay?"] || false).toString());
      formData.append('field17', (values["Remote-Work Friendly?"] || false).toString());
      formData.append('field18', JSON.stringify(values["Vibe / Aesthetic"] || []));
      formData.append('field19', values["Instagram"] || "");
      formData.append('field20', values["Facebook"] || "");
      formData.append('field21', values["LinkedIn"] || "");
      formData.append('field22', values["TikTok"] || "");
      formData.append('field23', values["YouTube / Video Tour"] || "");
      
      // Add files if they exist
      if (values["Logo Upload"].url.startsWith('blob:')) {
        const logoResponse = await fetch(values["Logo Upload"].url);
        const logoBlob = await logoResponse.blob();
        const logoFile = new File([logoBlob], values["Logo Upload"].name, { type: logoBlob.type });
        formData.append('Logo', logoFile);
      }
      
      if (values["Highlight Image"].url.startsWith('blob:')) {
        const imageResponse = await fetch(values["Highlight Image"].url);
        const imageBlob = await imageResponse.blob();
        const imageFile = new File([imageBlob], values["Highlight Image"].name, { type: imageBlob.type });
        formData.append('Highlight_Image', imageFile);
      }

      // Convert FormData to object for Airtable (using exact column names)
      const submissionData = {
        "Brand Name": values["Brand Name"],
        "Direct Booking Website": values["Direct Booking Website"],
        "Number of Listings": values["Number of Listings"],
        "Email": values["Submitted By (Email)"],
        "One-line Description": values["One-line Description"],
        "Why Book With You?": values["Why Book With You?"],
        "Choose Your Listing Type": values["Choose Your Listing Type"],
        "Countries": JSON.stringify(values["Countries"]),
        "Cities / Regions": JSON.stringify(values["Cities / Regions"]),
        "Ideal For": JSON.stringify(values["Ideal For"] || []),
        "Is your brand pet-friendly?": (values["Is your brand pet-friendly?"] || false).toString(),
        "Perks / Amenities": JSON.stringify(values["Perks / Amenities"] || []),
        "Eco-Conscious Stay?": (values["Eco-Conscious Stay?"] || false).toString(),
        "Remote-Work Friendly?": (values["Remote-Work Friendly?"] || false).toString(),
        "Vibe / Aesthetic": JSON.stringify(values["Vibe / Aesthetic"] || []),
        "Instagram": values["Instagram"] || "",
        "Facebook": values["Facebook"] || "",
        "LinkedIn": values["LinkedIn"] || "",
        "TikTok": values["TikTok"] || "",
        "YouTube / Video Tour": values["YouTube / Video Tour"] || "",
        "Logo Upload": values["Logo Upload"]?.url || "",
        "Highlight Image": values["Highlight Image"]?.url || "",
      };

      // Submit directly to Airtable using the service (bypass API route)
      const airtableService = {
        async createSubmission(data: any) {
          const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY;
          const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID;
          const AIRTABLE_TABLE_NAME = 'Directory Submissions';

          if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            throw new Error('Airtable configuration missing in environment variables');
          }

          const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
          
          // Convert arrays to JSON strings for Airtable
          const fields = { ...data };
          Object.keys(fields).forEach(key => {
            if (Array.isArray(fields[key])) {
              fields[key] = JSON.stringify(fields[key]);
            }
          });

          const response = await fetch(airtableUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              records: [
                {
                  fields: fields
                }
              ]
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
          }

          return response.json();
        }
      };

      const result = await airtableService.createSubmission(submissionData);
      
      toast({
        title: "Submission successful!",
        description: "Your property has been submitted for review. We'll get back to you soon!",
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
                  <FormLabel>Cities / Regions<RequiredAsterisk /></FormLabel>
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
            </div>

            {/* Section 2: Brand Story & Guest Value */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">💬 Brand Story & Guest Value</h2>
              <FormField control={form.control} name="One-line Description" render={({ field }) => (
                <FormItem>
                  <FormLabel>One-line Description<RequiredAsterisk /></FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Boutique apartments in Latin America" /></FormControl>
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
                  className={`flex-1 border rounded-xl p-6 cursor-pointer transition-all relative flex flex-col ${form.watch("Choose Your Listing Type") === "Free" ? "border-primary bg-primary/5 shadow-lg" : "border-gray-200 bg-white"}`}
                  onClick={() => form.setValue("Choose Your Listing Type", "Free")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={form.watch("Choose Your Listing Type") === "Free"}
                >
                  <div className="flex items-start justify-between mb-2 min-h-[40px]">
                    <div />
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full ml-2">0 EUR</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Free Listing</h2>
                  <p className="text-gray-500 mb-4">Basic listing in our directory</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Standard placement in search results</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Detailed stays info</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Link to your booking website</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Get listed in 1-3 months</li>
                  </ul>
                  <div className="mt-auto">
                    <Button variant={form.watch("Choose Your Listing Type") === "Free" ? "default" : "outline"} className="w-full" type="button" onClick={() => form.setValue("Choose Your Listing Type", "Free")}>Select Free</Button>
                  </div>
                </div>
                <div
                  className={`flex-1 border rounded-xl p-6 cursor-pointer transition-all relative flex flex-col ${form.watch("Choose Your Listing Type") === "Featured ($49.99)" ? "border-primary bg-primary/5 shadow-lg" : "border-gray-200 bg-white"}`}
                  onClick={() => form.setValue("Choose Your Listing Type", "Featured ($49.99)")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={form.watch("Choose Your Listing Type") === "Featured ($49.99)"}
                >
                  <div className="flex items-start justify-between mb-2 min-h-[40px]">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Recommended</span>
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full ml-2">49.99 EUR</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Featured Listing</h2>
                  <p className="text-gray-500 mb-4">Premium placement and enhanced features</p>
                  <div className="mb-2 font-medium text-gray-700">Same as Free Listing + :</div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Priority placement in search results</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Featured badge for increased visibility</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Get listed instantly</li>
                  </ul>
                  <div className="mt-auto">
                    <Button variant={form.watch("Choose Your Listing Type") === "Featured ($49.99)" ? "default" : "outline"} className="w-full" type="button" onClick={() => form.setValue("Choose Your Listing Type", "Featured ($49.99)")}>Select Featured</Button>
                  </div>
                </div>
              </div>
              {/* Dynamic summary now directly below the plan boxes */}
              <div className="flex justify-end mt-4">
                {form.watch("Choose Your Listing Type") === "Featured ($49.99)" ? (
                  <div className="text-green-800 bg-green-100 text-base font-semibold px-4 py-2 rounded-full inline-block">
                    Featured Listing — Total: 49.99 EUR
                  </div>
                ) : (
                  <div className="text-gray-800 bg-gray-100 text-base font-semibold px-4 py-2 rounded-full inline-block">
                    Free Listing — Total: 0 EUR
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
