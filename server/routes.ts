import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema, insertCountrySchema, insertSubscriptionSchema, insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { isAirtableInitialized, submitPropertyToAirtable, submitSubscriptionToAirtable, fetchListingsFromAirtable } from "./airtable";
import { log } from "./vite";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { listings, submissions } from "./schema";

const router = Router();

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



  const httpServer = createServer(app);

  return httpServer;
}
