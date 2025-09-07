// FAQ dataset for BookDirectStays.com
// Full traveler + host set, LLM & GEO optimized
// Safe drop-in replacement for staticFaqs

export const faqs = [
  // ======================
  // TRAVELERS
  // ======================
  {
    id: "t-what-is-bds",
    category: "traveler",
    question: "What is BookDirectStays.com and how does it work?",
    answer:
      "BookDirectStays.com is a directory that connects travelers directly with verified property managers and their official booking websites. You browse by country, region or city, click through to the host's site, and book at the source—often with lower fees, better rates, and direct communication.",
  },
  {
    id: "t-save-money",
    category: "traveler",
    question: "How much can I save by booking direct instead of Airbnb or Booking.com?",
    answer:
      "Travelers typically save 10–20% versus big OTAs because many direct sites remove guest service fees and offer lower nightly rates or perks (flexible check-in, welcome gifts, free upgrades). Always compare the host's official price with OTA pricing before you confirm.",
  },
  {
    id: "t-why-direct",
    category: "traveler",
    question: "Why should I book direct instead of using an OTA like Airbnb or Vrbo?",
    answer:
      "Direct booking gives you: 1) the lowest available rate more often, 2) direct, faster communication with the property manager, 3) clearer policies and local perks, and 4) better support for small businesses. Use BookDirectStays.com to find the host's official site and book confidently.",
  },
  {
    id: "t-safe",
    category: "traveler",
    question: "Is it safe to use BookDirectStays.com?",
    answer:
      "Yes. We only list companies with a public website and verifiable presence. You always book on the host's own site. Before paying, we recommend checking the company's contact details, registered business info, and review history (Google, OTA profiles, social). If anything feels off, contact the host or us at bookdirectstays@gmail.com.",
  },
  {
    id: "t-how-to-book",
    category: "traveler",
    question: "How do I book a property I found on BookDirectStays.com?",
    answer:
      "Click the listing to open the property manager's website. Then search dates, select the accommodation, and complete booking and payment directly with the host. All payments, contracts, and policies are managed by the host's site.",
  },
  {
    id: "t-cancel-refund",
    category: "traveler",
    question: "How do cancellations and refunds work for direct bookings?",
    answer:
      "Policies vary by property manager. Always read the cancellation, change, and refund terms shown on the host's website before paying. For any change or refund request, contact the host directly using their official contact details.",
  },
  {
    id: "t-fees",
    category: "traveler",
    question: "Are there extra fees when booking via BookDirectStays.com?",
    answer:
      "BookDirectStays.com does not charge traveler fees. You book on the host's official site, where taxes, cleaning fees, or security deposits (if any) are clearly listed by the property manager.",
  },
  {
    id: "t-compare-ota",
    category: "traveler",
    question: "Do property managers offer the same or better rates than on Airbnb/Booking.com?",
    answer:
      "In many cases, direct sites match or beat OTA rates and remove service fees. Some hosts also include value-adds (early check-in, local discounts). It's smart to price-check the same dates on the OTA and the host's site before booking.",
  },
  {
    id: "t-contact-host",
    category: "traveler",
    question: "Can I contact the host before I book?",
    answer:
      "Yes. Use the email, phone, or chat on the property manager's website to ask about dates, amenities, access, or special requests. Direct contact usually leads to faster answers and a smoother stay.",
  },
  {
    id: "t-types",
    category: "traveler",
    question: "What types of stays can I find (apartments, villas, cabins, boutique rentals)?",
    answer:
      "Everything from urban apartments and beach villas to chalets, cabins, country houses, boutique serviced apartments, and unique stays. Use filters like 'Vibe', 'Ideal For', and 'Perks' to narrow your search.",
  },
  {
    id: "t-amenities",
    category: "traveler",
    question: "What amenities can I expect when booking direct?",
    answer:
      "Common amenities include fast Wi-Fi, equipped kitchens, self check-in, parking, baby gear, pet-friendly options, pools or hot tubs, and workspaces. Each host details amenities on their site—check before booking.",
  },
  {
    id: "t-geo-countries",
    category: "traveler",
    question: "In which countries can I find direct booking stays?",
    answer:
      "Popular destinations include France, Spain, Italy, Portugal, Greece, the UK, the USA, Canada, and Mexico—with more being added weekly. Browse by country on BookDirectStays.com and drill down to regions and cities.",
  },
  {
    id: "t-geo-cities-fr",
    category: "traveler",
    question: "Can I find direct booking stays in France (Paris, Nice, Bordeaux, Lyon, Marseille)?",
    answer:
      "Yes. We list French property managers covering Paris, the Riviera (Nice, Cannes), Provence, Lyon, Marseille, Bordeaux, the Alps, Normandy, Brittany, and more. Start with 'France' and refine by city or region.",
  },
  {
    id: "t-geo-cities-es",
    category: "traveler",
    question: "What about Spain (Barcelona, Madrid, Valencia, Seville, Balearic Islands)?",
    answer:
      "Yes—discover managers in Barcelona, Madrid, Valencia, Seville, Málaga, Costa Brava, Costa del Sol, the Balearic Islands (Mallorca, Ibiza, Menorca), and the Canaries.",
  },
  {
    id: "t-geo-cities-it",
    category: "traveler",
    question: "Do you cover Italy (Rome, Florence, Venice, Amalfi Coast, Sicily)?",
    answer:
      "Yes—search across Rome, Florence, Venice, Milan, Naples, Amalfi Coast, Tuscany, Sardinia, and Sicily. Many managers offer historic centers and countryside stays.",
  },
  {
    id: "t-geo-cities-us",
    category: "traveler",
    question: "Can I find stays in the USA (New York, Miami, Orlando, LA, ski towns)?",
    answer:
      "Yes—explore managers in New York City, Miami, Orlando, Los Angeles, San Diego, the Bay Area, as well as mountain and lake destinations (Aspen, Vail, Tahoe, Park City).",
  },
  {
    id: "t-geo-cities-pt-gr-uk",
    category: "traveler",
    question: "What about Portugal, Greece, or the UK?",
    answer:
      "Portugal: Lisbon, Porto, Algarve, Madeira, Azores. Greece: Athens, Santorini, Mykonos, Crete, Rhodes. UK: London, Edinburgh, the Lake District, Cornwall, the Cotswolds. Filter by country → region → city to get exact areas covered by each manager.",
  },
  {
    id: "t-best-price",
    category: "traveler",
    question: "How do I know I'm getting the best price?",
    answer:
      "Check the same dates on the host's site and on OTAs. Many managers offer the lowest rate or a value-add on their own site. If you're unsure, politely ask the host whether a direct-book price or perk is available.",
  },
  {
    id: "t-verification",
    category: "traveler",
    question: "How are property managers verified before being listed?",
    answer:
      "We review a company's website, contact details, social presence, and public reputation. Many also submit compliance details during onboarding. If you spot an issue, report it to bookdirectstays@gmail.com and we'll re-check promptly.",
  },
  {
    id: "t-payments-security",
    category: "traveler",
    question: "Is my payment secure on a host's website?",
    answer:
      "Payments are processed on the property manager's official website—not on BookDirectStays.com. Reputable hosts use secure processors (e.g., Stripe) and SSL. Always confirm the site uses HTTPS and review policies before paying.",
  },
  {
    id: "t-issues",
    category: "traveler",
    question: "What if there's a problem with my booking or stay?",
    answer:
      "Contact the property manager first—they control availability, payments, and on-site help. If you still need assistance, email us at bookdirectstays@gmail.com with evidence (screenshots, emails, URLs) and we'll investigate the listing.",
  },
  {
    id: "t-accessibility",
    category: "traveler",
    question: "Do you have accessible or pet-friendly stays?",
    answer:
      "Many managers offer step-free access, elevators, ground-floor units, adapted bathrooms, and pet-friendly policies. Check the host's amenities and message them with specific needs before booking.",
  },
  {
    id: "t-workation",
    category: "traveler",
    question: "Are there remote-work friendly rentals with strong Wi-Fi and desks?",
    answer:
      "Yes. Many listings highlight Wi-Fi speeds, desks, ergonomic chairs, and quiet areas. Filter for 'workation' or ask the host for a speed test screenshot before booking.",
  },
  {
    id: "t-travel-insurance",
    category: "traveler",
    question: "Do I need travel insurance for a direct booking?",
    answer:
      "It's recommended, especially for international trips or strict cancellation windows. Choose coverage that matches the host's policies and your travel risk.",
  },

  // ======================
  // PROPERTY MANAGERS
  // ======================
  {
    id: "h-how-to-list",
    category: "host",
    question: "How do I list my direct booking site on BookDirectStays.com?",
    answer:
      "Go to 'Submit' and complete the form with your company details, direct booking URL, portfolio coverage (countries/cities), brand assets, and social links. We review for quality and publish approved listings.",
  },
  {
    id: "h-requirements",
    category: "host",
    question: "What are the listing requirements?",
    answer:
      "You need: 1) a functioning direct booking site with live inventory, 2) clear contact details, 3) up-to-date policies, 4) genuine photos and descriptions, and 5) basic brand assets (logo, hero images). High-quality, trustworthy sites are prioritized.",
  },
  {
    id: "h-pricing",
    category: "host",
    question: "How much does it cost to be listed?",
    answer:
      "Basic: €100/year per company. Featured: €500/year with premium placement, badges, and editorial exposure. Pricing is per company (not per property).",
  },
  {
    id: "h-approval-time",
    category: "host",
    question: "How long does approval take?",
    answer:
      "Most listings are reviewed within a few business days. If we need more details (coverage areas, screenshots, policies), we'll email you. Approved listings go live immediately after payment (for paid tiers).",
  },
  {
    id: "h-multiple-properties",
    category: "host",
    question: "Can I list multiple properties under one company account?",
    answer:
      "Yes. Your company profile links to your booking engine or catalog. We emphasize your coverage (countries, regions, cities) and brand positioning so travelers can discover your full portfolio.",
  },
  {
    id: "h-benefits",
    category: "host",
    question: "What are the benefits of being listed on BookDirectStays.com?",
    answer:
      "You gain: 1) qualified direct-booking traffic, 2) GEO visibility in your markets, 3) trust via a vetted directory, and 4) marketing features (featured badges, editorial lists, social highlights for premium).",
  },
  {
    id: "h-seo-benefit",
    category: "host",
    question: "Do I get SEO benefits from a directory listing?",
    answer:
      "Yes. A high-quality directory citation improves entity recognition for your brand and can support your GEO/LLM discoverability. We use structured content and consistent NAP to help search engines understand who you are and where you operate.",
  },
  {
    id: "h-featured-visibility",
    category: "host",
    question: "What extra visibility does a Featured listing include?",
    answer:
      "Featured includes top-of-category placement, a 'Best Property Managers' showcase slot, social mentions, optional case studies, and eligibility for editorial guides (e.g., 'Top Direct Booking Sites in Spain').",
  },
  {
    id: "h-updates",
    category: "host",
    question: "How do I update my listing after it goes live?",
    answer:
      "Reply to your approval email or contact bookdirectstays@gmail.com with changes (logo, images, coverage, perks, policies, URLs). We'll update quickly to keep your profile accurate.",
  },
  {
    id: "h-utm",
    category: "host",
    question: "Can I track traffic and bookings from BookDirectStays.com?",
    answer:
      "Yes—add UTM parameters to your direct booking URLs and monitor performance in your analytics. If needed, we can include your UTM format in the listing.",
  },
  {
    id: "h-reviews",
    category: "host",
    question: "Can I showcase reviews or ratings from Airbnb, Booking.com, or Google?",
    answer:
      "Yes—include links or badges that are compliant with each platform's brand and usage guidelines. Featured listings may also display selected social proof (e.g., OTA scores, Google Reviews) to build trust.",
  },
  {
    id: "h-geo-coverage",
    category: "host",
    question: "How should I present my GEO coverage for better discovery?",
    answer:
      "List countries → regions → cities clearly (e.g., Spain: Barcelona, Madrid, Valencia; France: Paris, Lyon, Nice). Include niche areas travelers search for (Algarve, Amalfi Coast, Lake District) and align your site's pages with those areas.",
  },
  {
    id: "h-quality-bar",
    category: "host",
    question: "What quality signals help me rank higher in the directory?",
    answer:
      "Clear and fast site, accurate availability, transparent policies, strong visuals, consistent branding, and helpful local content. Reliable, traveler-friendly sites are highlighted across categories.",
  },
  {
    id: "h-insurance-legal",
    category: "host",
    question: "Do I need specific insurance or licenses to get listed?",
    answer:
      "We expect compliance with local laws (registration, taxes, safety) and appropriate liability coverage. Requirements vary by country/city—please ensure your business is properly registered and insured before applying.",
  },
  {
    id: "h-content-kit",
    category: "host",
    question: "What content should I prepare for a strong listing?",
    answer:
      "Have ready: brand logo, short company bio (what you manage and where), direct booking URL(s), hero images, coverage list, perks, and social links. Optional: awards, press mentions, OTA/Google review highlights.",
  },
  {
    id: "h-pricing-philosophy",
    category: "host",
    question: "Why is pricing per company and not per property?",
    answer:
      "We're a discovery engine for direct booking brands. Charging per company lets you showcase your full portfolio and grow with us at a predictable cost—especially attractive versus high OTA commission models.",
  },
  {
    id: "h-support",
    category: "host",
    question: "Who do I contact for partnership or support questions?",
    answer:
      "Email bookdirectstays@gmail.com with your company name, website, and question. For partnerships or editorial collaborations, add 'Partnership' in the subject line.",
  },
  {
    id: "h-guest-trust",
    category: "host",
    question: "How can I increase traveler trust on my direct site?",
    answer:
      "Show clear pricing, policies, and contact details; display recent reviews and verified badges; use SSL and reputable payment processors; and keep content fresh (local guides, FAQs).",
  },
] as const;
