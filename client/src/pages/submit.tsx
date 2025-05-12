import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  website: z.string().url({ message: "Please enter a valid website URL" }),
  listingCount: z.coerce.number().min(1, { message: "Must have at least 1 listing" }),
  countries: z.array(z.string()).min(1, { message: "Select at least one country" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  logo: z.string().url({ message: "Please enter a valid logo URL" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  facebook: z.string().url({ message: "Please enter a valid Facebook URL" }).optional().or(z.literal('')),
  instagram: z.string().url({ message: "Please enter a valid Instagram URL" }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL" }).optional().or(z.literal('')),
  listingType: z.enum(["free", "featured"], {
    required_error: "Please select a listing type",
  }),
});

export default function Submit() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website: "",
      listingCount: 1,
      countries: [],
      description: "",
      logo: "",
      email: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      listingType: "free",
    },
  });

  // Fetch countries for the select dropdown
  const { data: countries, isLoading: isCountriesLoading } = useQuery({
    queryKey: ["/api/countries"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/countries", undefined);
      return res.json();
    }
  });

  // Form submission mutation
  const submitMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", "/api/submissions", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Submission successful!",
        description: "Your property has been submitted for review.",
        variant: "default",
      });
      form.reset();
      setSelectedCountries([]);
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your property. Please try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitMutation.mutate(values);
  };

  // Handle country selection
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCountries(selectedOptions);
    form.setValue("countries", selectedOptions);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add Your Direct Booking Site</h1>
        <p className="text-gray-600 mb-8">Join our directory and connect with travelers looking to book directly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Free Listing</CardTitle>
              <CardDescription>
                Basic listing in our directory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Standard placement in search results</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Basic property information</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Link to your booking website</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => form.setValue("listingType", "free")}
              >
                Select Free
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-center">
                <CardTitle>Featured Listing</CardTitle>
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-medium">
                  Recommended
                </span>
              </div>
              <CardDescription>
                Premium placement and enhanced features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Priority placement in search results</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Featured badge for increased visibility</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Enhanced property listing with all details</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Analytics dashboard with visitor insights</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => form.setValue("listingType", "featured")}
              >
                Select Featured
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Listing Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property/Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Villa Escapes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="listingCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Properties</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="countries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Countries/Regions</FormLabel>
                      <FormControl>
                        <select
                          multiple
                          className="w-full border rounded-md p-2 h-24"
                          value={selectedCountries}
                          onChange={handleCountryChange}
                        >
                          {isCountriesLoading ? (
                            <option disabled>Loading countries...</option>
                          ) : (
                            countries?.map((country: any) => (
                              <option key={country.id} value={country.name}>
                                {country.name}
                              </option>
                            ))
                          )}
                        </select>
                      </FormControl>
                      <FormDescription>
                        Hold Ctrl/Cmd key to select multiple
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe your properties. E.g., '25 luxury villas in Spain & Portugal'"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com/your-logo.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to your logo image (recommended size: 100x100px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll use this to contact you about your listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/yourbusiness" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/yourbusiness" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/yourbusiness" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="listingType"
              render={({ field }) => (
                <FormItem className="bg-white rounded-xl shadow-md p-6">
                  <FormLabel className="text-xl font-semibold mb-4 block">Listing Type</FormLabel>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className={`border rounded-lg p-4 flex-1 cursor-pointer ${field.value === 'free' ? 'border-primary bg-primary/5' : ''}`} onClick={() => form.setValue("listingType", "free")}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="free"
                          checked={field.value === 'free'}
                          onChange={() => form.setValue("listingType", "free")}
                          className="mr-2"
                        />
                        <label htmlFor="free" className="font-medium cursor-pointer">Free Listing</label>
                      </div>
                    </div>
                    <div className={`border rounded-lg p-4 flex-1 cursor-pointer ${field.value === 'featured' ? 'border-primary bg-primary/5' : ''}`} onClick={() => form.setValue("listingType", "featured")}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="featured"
                          checked={field.value === 'featured'}
                          onChange={() => form.setValue("listingType", "featured")}
                          className="mr-2"
                        />
                        <label htmlFor="featured" className="font-medium cursor-pointer">Featured Listing</label>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="px-8 py-3"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
