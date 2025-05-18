import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function FAQ() {
  // Fetch FAQs
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["/api/faqs"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/faqs", undefined);
      return res.json();
    }
  });

  // Group FAQs by category
  const travelerFaqs = faqs?.filter((faq: any) => faq.category === "traveler") || [];
  const hostFaqs = faqs?.filter((faq: any) => faq.category === "host") || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">
          Find answers to common questions about BookDirectStays.com
        </p>

        <Tabs defaultValue="traveler" className="mb-12">
          <TabsList className="w-full mb-6 grid grid-cols-2">
            <TabsTrigger value="traveler">For Travelers</TabsTrigger>
            <TabsTrigger value="host">For Property Managers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="traveler">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-10 w-full mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {travelerFaqs.map((faq: any) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
          
          <TabsContent value="host">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-10 w-full mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {hostFaqs.map((faq: any) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Have more questions?</h2>
          <p className="mb-4">
            If you can't find the answer you're looking for, please contact our support team or
            consider adding your property to our directory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <a className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition">
                Add Your Direct Booking Site
              </a>
            </Link>
            <a 
              href="mailto:info@bookdirectstays.com" 
              className="bg-white border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
