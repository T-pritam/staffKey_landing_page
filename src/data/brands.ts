import type { Brand } from "@/lib/types";

/**
 * Fictional brands. Real hotel names and logos need written permission, so
 * nothing here refers to a real property. The first six fill the bento grid.
 */
export const SAMPLE_BRANDS: Brand[] = [
  {
    id: "coromandel-house",
    name: "Coromandel House",
    propertyType: "Heritage Hotel",
    city: "Chennai",
    openRoles: 14,
    quote: "We filled a full banquet brigade before the wedding season opened.",
  },
  {
    id: "grand-central",
    name: "Grand Central Hotels",
    propertyType: "Five-star Hotel",
    city: "Mumbai",
    openRoles: 22,
    quote: "Verified profiles meant our chefs trialled candidates, not paperwork.",
  },
  {
    id: "premier-stays",
    name: "Premier Stays",
    propertyType: "Business Hotel",
    city: "Bengaluru",
    openRoles: 9,
    quote: "Front office cover in days, not weeks.",
  },
  {
    id: "coast-kitchen",
    name: "Coast Kitchen",
    propertyType: "Restaurant",
    city: "Goa",
    openRoles: 6,
    quote: "Seasonal hiring finally has a rhythm.",
  },
  {
    id: "aurum-resorts",
    name: "Aurum Resorts",
    propertyType: "Resort",
    city: "Udaipur",
    openRoles: 17,
    quote: "Housekeeping teams that arrive ready for the villa standard.",
  },
  {
    id: "saffron-co",
    name: "Saffron & Co.",
    propertyType: "Cloud Kitchen",
    city: "Hyderabad",
    openRoles: 11,
    quote: "Six kitchens, one live bench of commis we can call on.",
  },
  {
    id: "maison-verde",
    name: "Maison Verde",
    propertyType: "Boutique Hotel",
    city: "Pondicherry",
    openRoles: 4,
  },
  {
    id: "rooftop-club",
    name: "The Rooftop Club",
    propertyType: "Bar & Restaurant",
    city: "New Delhi",
    openRoles: 8,
  },
];
