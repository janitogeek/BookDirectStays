import { useForm } from "react-hook-form";
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

// Airtable-matching schema
const formSchema = z.object({
  "Brand Name": z.string().min(2),
  "Direct Booking Website": z.string().url(),
  "Number of Listings": z.coerce.number().min(1),
  "Countries": z.array(z.string()).min(1),
  "Cities / Regions": z.array(z.string()).optional(),
  "Logo Upload": z.string().url(),
  "Highlight Image": z.string().url().optional(),
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
  "Choose Your Listing Type": z.enum(["Free", "Featured ($49.99)"]),
  "Submitted By (Email)": z.string().email(),
});

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
  "Families", "Digital Nomads", "Retreats", "Couples", "Groups"
];
const PERKS = [
  "Pool", "Breakfast", "Self check-in", "WiFi", "Parking", "Pet-friendly"
];
const VIBES = [
  "Boho", "Minimalist", "Design-led", "Rustic", "Modern"
];

export default function Submit() {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "Brand Name": "",
      "Direct Booking Website": "",
      "Number of Listings": 1,
      "Countries": [],
      "Cities / Regions": [],
      "Logo Upload": "",
      "Highlight Image": "",
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
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast({
      title: "Submission successful!",
      description: "Your property has been submitted for review.",
      variant: "default",
    });
    // Send to your API here
    // await apiRequest("POST", "/api/submissions", values);
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Submit Direct Booking Website</h1>
        <p className="text-gray-600 mb-8">Join our directory and connect with travelers looking to book directly.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Section 1: Brand Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🧾 Brand Info</h2>
              <FormField control={form.control} name="Brand Name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Direct Booking Website" render={({ field }) => (
                <FormItem>
                  <FormLabel>Direct Booking Website</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Number of Listings" render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Listings</FormLabel>
                  <FormControl><Input type="number" min="1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Countries" render={({ field }) => (
                <FormItem>
                  <FormLabel>Countries</FormLabel>
                  <FormControl>
                    <select multiple className="w-full border rounded-md p-2 h-24" {...field}
                      value={field.value || []}
                      onChange={e => field.onChange(Array.from(e.target.selectedOptions, o => o.value))}
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Cities / Regions" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cities / Regions</FormLabel>
                  <FormControl>
                    <select multiple className="w-full border rounded-md p-2 h-24" {...field}
                      value={field.value || []}
                      onChange={e => field.onChange(Array.from(e.target.selectedOptions, o => o.value))}
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Logo Upload" render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (URL for now)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Highlight Image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlight Image (URL for now)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
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
                  <FormLabel>One-line Description</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Why Book With You?" render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Book With You?</FormLabel>
                  <FormControl><Textarea rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Types of Stays" render={({ field }) => (
                <FormItem>
                  <FormLabel>Types of Stays</FormLabel>
                  <FormControl>
                    <select multiple className="w-full border rounded-md p-2 h-24" {...field}
                      value={field.value || []}
                      onChange={e => field.onChange(Array.from(e.target.selectedOptions, o => o.value))}
                    >
                      {TYPES_OF_STAYS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Ideal For" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ideal For</FormLabel>
                  <FormControl>
                    <select multiple className="w-full border rounded-md p-2 h-24" {...field}
                      value={field.value || []}
                      onChange={e => field.onChange(Array.from(e.target.selectedOptions, o => o.value))}
                    >
                      {IDEAL_FOR.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 3: Perks & Positioning */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🎁 Perks & Positioning</h2>
              <FormField control={form.control} name="Is your brand pet-friendly?" render={({ field }) => (
                <FormItem>
                  <FormLabel>Is your brand pet-friendly?</FormLabel>
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Perks / Amenities" render={({ field }) => (
                <FormItem>
                  <FormLabel>Perks / Amenities</FormLabel>
                  <FormControl>
                    <select multiple className="w-full border rounded-md p-2 h-24" {...field}
                      value={field.value || []}
                      onChange={e => field.onChange(Array.from(e.target.selectedOptions, o => o.value))}
                    >
                      {PERKS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Eco-Conscious Stay?" render={({ field }) => (
                <FormItem>
                  <FormLabel>Eco-Conscious Stay?</FormLabel>
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Remote-Work Friendly?" render={({ field }) => (
                <FormItem>
                  <FormLabel>Remote-Work Friendly?</FormLabel>
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Vibe / Aesthetic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vibe / Aesthetic</FormLabel>
                  <FormControl>
                    <select multiple className="w-full border rounded-md p-2 h-24" {...field}
                      value={field.value || []}
                      onChange={e => field.onChange(Array.from(e.target.selectedOptions, o => o.value))}
                    >
                      {VIBES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 4: Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">📲 Social Links</h2>
              <FormField control={form.control} name="Instagram" render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Facebook" render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="LinkedIn" render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="TikTok" render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="YouTube / Video Tour" render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube / Video Tour</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 5: Visibility Plan */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🌟 Visibility Plan</h2>
              <FormField control={form.control} name="Choose Your Listing Type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Your Listing Type</FormLabel>
                  <FormControl>
                    <select {...field}>
                      <option value="Free">Free</option>
                      <option value="Featured ($49.99)">Featured ($49.99)</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Submitted By (Email)" render={({ field }) => (
                <FormItem>
                  <FormLabel>Submitted By (Email)</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-8 py-3">
                Submit Listing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
