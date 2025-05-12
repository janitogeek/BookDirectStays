import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BookDirectStays.com</h3>
            <p className="text-gray-300 mb-4">
              Connect directly with property managers worldwide and skip the middleman fees.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/submit">
                  <a className="text-gray-300 hover:text-white">Add Your Property</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-300 hover:text-white">FAQ</a>
                </Link>
              </li>
              <li>
                <Link href="/testimonials">
                  <a className="text-gray-300 hover:text-white">Testimonials</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/country/spain">
                  <a className="text-gray-300 hover:text-white">Spain</a>
                </Link>
              </li>
              <li>
                <Link href="/country/italy">
                  <a className="text-gray-300 hover:text-white">Italy</a>
                </Link>
              </li>
              <li>
                <Link href="/country/france">
                  <a className="text-gray-300 hover:text-white">France</a>
                </Link>
              </li>
              <li>
                <Link href="/country/united-states">
                  <a className="text-gray-300 hover:text-white">United States</a>
                </Link>
              </li>
              <li>
                <Link href="/country/thailand">
                  <a className="text-gray-300 hover:text-white">Thailand</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-2"></i>
                <span>info@bookdirectstays.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-2"></i>
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
            
            <form onSubmit={handleSubscribe} className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Join our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-r-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : "Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            &copy; 2023 BookDirectStays.com. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white mr-4">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white mr-4">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
