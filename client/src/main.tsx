import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";

document.title = "BookDirectStays.com - Book Directly with Hosts";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
