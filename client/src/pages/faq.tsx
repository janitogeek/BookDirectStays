import { faqs as staticFaqs } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FAQ() {
  // For now, just use static FAQs directly to ensure they show up
  const faqData = staticFaqs;
  const isLoading = false;

  // Group FAQs by category
  const travelerFaqs = faqData?.filter((faq: any) => faq.category === "traveler") || [];
  const hostFaqs = faqData?.filter((faq: any) => faq.category === "host") || [];

  console.log("FAQ Data:", faqData);
  console.log("Traveler FAQs:", travelerFaqs);
  console.log("Host FAQs:", hostFaqs);

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
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/submit">
                Add Your Direct Booking Site
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <a href="mailto:info@bookdirectstays.com">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
