import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema, insertCountrySchema, insertSubscriptionSchema, insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { isAirtableInitialized, submitPropertyToAirtable, submitSubscriptionToAirtable, fetchListingsFromAirtable } from "./airtable";
import { log } from "./vite";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { listings, submissions } from "./schema";
import { authenticateToken } from "./middleware";
import bcrypt from "bcryptjs";

const router = Router();

// Admin authentication
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Change this in production
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Store the hashed password

export async function registerRoutes(app: Express): Promise<Server> {
  // Listings routes
  app.get("/api/listings", async (req, res) => {
    try {
      let listings;
      if (isAirtableInitialized()) {
        listings = await fetchListingsFromAirtable();
      } else {
        listings = await storage.getListings();
      }
      res.json({ 
        listings,
        total: listings.length,
        hasMore: false 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  // Countries routes
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  
  app.get("/api/countries/:slug", async (req, res) => {
    try {
      const country = await storage.getCountryBySlug(req.params.slug);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });

  // Email subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      const parsedData = insertSubscriptionSchema.parse(req.body);
      const createdAt = new Date().toISOString();
      const subscriptionData = {
        ...parsedData,
        createdAt,
      };
      
      // Store in local memory storage
      const result = await storage.createSubscription(subscriptionData);
      
      // If Airtable is initialized, also store there
      if (isAirtableInitialized()) {
        try {
          await submitSubscriptionToAirtable(subscriptionData);
          log("Subscription also stored in Airtable");
        } catch (airtableError) {
          log(`Airtable storage failed but local storage succeeded: ${airtableError}`);
        }
      }
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Submission form
  app.post("/api/submissions", async (req, res) => {
    try {
      const parsedData = insertSubmissionSchema.parse(req.body);
      const createdAt = new Date().toISOString();
      const submissionData = {
        ...parsedData,
        status: "pending",
        createdAt,
      };
      
      // Store in local memory storage
      const result = await storage.createSubmission(submissionData);
      
      // If Airtable is initialized, also store there
      if (isAirtableInitialized()) {
        try {
          await submitPropertyToAirtable(submissionData);
          log("Property submission also stored in Airtable");
        } catch (airtableError) {
          log(`Airtable storage failed but local storage succeeded: ${airtableError}`);
        }
      }
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  // FAQs routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getFAQs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Admin routes for managing submissions
  app.get("/api/admin/submissions", authenticateToken, async (req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.post("/api/admin/submissions/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.updateSubmissionStatus(Number(id), "approved");
      
      // If submission is approved, create a new listing
      if (submission) {
        await storage.createListing({
          name: submission.name,
          description: submission.description,
          website: submission.website,
          logo: submission.logo,
          image: submission.logo, // Using logo as the main image for now
          featured: submission.listingType === "featured",
          countries: submission.countries,
          whyBookWith: submission.description,
          socials: {
            facebook: submission.facebook,
            instagram: submission.instagram,
            linkedin: submission.linkedin,
          },
        });
      }
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve submission" });
    }
  });

  app.post("/api/admin/submissions/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.updateSubmissionStatus(Number(id), "rejected");
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject submission" });
    }
  });

  // Admin stats endpoint
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      const stats = {
        totalSubmissions: submissions.length,
        pendingSubmissions: submissions.filter(s => s.status === "pending").length,
        approvedSubmissions: submissions.filter(s => s.status === "approved").length,
        rejectedSubmissions: submissions.filter(s => s.status === "rejected").length,
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // IP whitelist middleware
  const whitelistIPs = (req: Request, res: Response, next: NextFunction) => {
    const allowedIPs = (process.env.ADMIN_IP_WHITELIST || "").split(",");
    const clientIP = req.ip || req.socket.remoteAddress;

    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };

  // Admin authentication middleware
  const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  // Protect all admin routes with both IP whitelist and authentication
  app.use("/api/admin", whitelistIPs, authenticateAdmin);

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;

    if (!ADMIN_PASSWORD_HASH) {
      return res.status(500).json({ error: "Admin password not configured" });
    }

    try {
      const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
