import { pgTable, text, serial, integer, boolean, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (inherited from the template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Country schema
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  code: varchar("code", { length: 2 }).notNull(),
  listingCount: integer("listing_count").notNull().default(0),
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

// Property Manager/Listing schema
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website").notNull(),
  logo: text("logo").notNull(),
  image: text("image").notNull(),
  featured: boolean("featured").notNull().default(false),
  countries: text("countries").array().notNull(),
  socials: jsonb("socials").$type<{
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  }>().default({}),
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;

// Subscription schema (for email signups)
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  email: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Submission schema for property managers to add their listing
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website").notNull(),
  listingCount: integer("listing_count").notNull(),
  countries: text("countries").array().notNull(),
  description: text("description").notNull(),
  logo: text("logo").notNull(),
  email: text("email").notNull(),
  facebook: text("facebook"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  listingType: text("listing_type").notNull(), // "free" or "featured"
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  createdAt: text("created_at").notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Testimonial schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "host" or "guest"
  content: text("content").notNull(),
  avatar: text("avatar"),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// FAQ schema
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(), // "traveler" or "host"
  order: integer("order").notNull(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type FAQ = typeof faqs.$inferSelect;
