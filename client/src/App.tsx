import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Country from "@/pages/country";
import Submit from "@/pages/submit";
import FAQ from "@/pages/faq";
import Testimonials from "@/pages/testimonials";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AdminDashboard from "@/pages/admin/index";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/country/:country" component={Country} />
          <Route path="/submit" component={Submit} />
          <Route path="/faq" component={FAQ} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/admin" component={AdminDashboard} />
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
