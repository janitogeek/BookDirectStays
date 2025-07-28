import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FindHost from "@/pages/find-host";
import Country from "@/pages/country";
import City from "@/pages/city";
import Submit from "@/pages/submit";
import Partnerships from "@/pages/partnerships";
import FAQ from "@/pages/faq";
import Testimonials from "@/pages/testimonials";
import Property from "@/pages/property";
import SubmissionProperty from "@/pages/submission-property";
import CMSAdmin from "@/pages/admin/cms";
import Header from "@/components/header";
import Footer from "@/components/footer";

function Router() {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/find-host" component={FindHost} />
          <Route path="/country/:country/:city" component={City} />
          <Route path="/country/:country" component={Country} />
          <Route path="/submit" component={Submit} />
          <Route path="/partnerships" component={Partnerships} />
          <Route path="/faq" component={FAQ} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/property/:id" component={SubmissionProperty} />
          <Route path="/listing/:id" component={Property} />
          <Route path="/admin/cms" component={CMSAdmin} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
