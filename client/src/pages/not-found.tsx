import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md mx-4 shadow-lg border-0">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded my-3"></div>
            <p className="mt-2 text-gray-600">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button asChild variant="default" className="bg-gradient-to-r from-blue-600 to-blue-500">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#listings" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Explore Listings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
