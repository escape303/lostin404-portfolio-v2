/**
 * All content below is taken from the existing LOST_IN404 site
 * (lostin404.lovable.app) — brand strings, project names, descriptions,
 * live links, contact details and social profiles.
 *
 * Nothing here is invented: no testimonials, follower counts, clients,
 * awards or metrics beyond the ones the owner already publishes.
 */

export const brand = {
  wordmark: "LOST_IN404",
  signature: "BEYOND_404",
  slogan: "FIND YOURSELF IN GLITCH",
  name: "Suhail",
  role: "Creative Director & Designer",
  location: "Dubai, UAE",
  tagline: "Dubai-Based Creative Professional",
  intro:
    "Crafting premium brand visuals, cinematic content, web experiences & social media strategy for brands that refuse to blend in.",
  philosophy:
    "Bold visuals. Cinematic storytelling. Strong typography. Performance-driven content that doesn't just look premium — it converts. Every pixel, every frame, every word is deliberate.",
  about:
    "Dubai-based creative professional and design brand specializing in premium brand visuals, cinematic content, web design, and social media strategy. Every project is crafted with a sharp eye for detail and a passion for bold, cinematic storytelling.",
} as const;

export const contact = {
  email: "lostin404ae@gmail.com",
  phone: "+971 52 341 2447",
  phoneHref: "tel:+971523412447",
  whatsapp: "https://wa.me/971523412447",
  invite: "Have a project in mind? Let's connect and bring your vision to life.",
} as const;

export type Social = {
  label: string;
  handle: string;
  href: string;
  icon: "instagram" | "pinterest" | "spotify" | "whatsapp" | "mail";
};

export const socials: Social[] = [
  {
    label: "Instagram",
    handle: "@lostin___404",
    href: "https://www.instagram.com/lostin___404",
    icon: "instagram",
  },
  {
    label: "Pinterest",
    handle: "/lost_in404",
    href: "https://www.pinterest.com/lost_in404/",
    icon: "pinterest",
  },
  {
    label: "Spotify",
    handle: "Studio playlist",
    href: "https://open.spotify.com/playlist/42sNIpZAmqJMUsQkGiqIdp?si=EIzDNukAQZOXqPYe_ASlRg",
    icon: "spotify",
  },
  {
    label: "WhatsApp",
    handle: contact.phone,
    href: contact.whatsapp,
    icon: "whatsapp",
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  image: string;
  link: string | null;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "branding",
    title: "LOST_IN404 Branding",
    category: "Brand Visuals",
    tag: "IDENTITY",
    description:
      "Complete identity system with poster series, typography experiments & social creatives.",
    image: "/work/branding.jpg",
    link: null,
    featured: true,
  },
  {
    id: "lacabite",
    title: "LACABITE UAE",
    category: "Website Design & Development",
    tag: "WEB",
    description:
      "A premium bakery and Arabic sweets website with a clean, elegant, brand-focused experience.",
    image: "/work/lacabite.jpg",
    link: "https://lacabiteuae.ae/",
  },
  {
    id: "mealskart",
    title: "MealsKart",
    category: "Food Brand Website",
    tag: "FOOD",
    description:
      "A modern UAE food and meal plan website designed for South Indian / Kerala-style meal services.",
    image: "/work/mealskart.jpg",
    link: "https://www.mealskart.ae/",
  },
  {
    id: "aajel",
    title: "AAJEL Business",
    category: "Business Services Website",
    tag: "BUSINESS",
    description:
      "A corporate website for UAE business setup, PRO services, visa, and document clearing services.",
    image: "/work/aajel.jpg",
    link: "https://aajelbusiness.com/",
  },
  {
    id: "nelta",
    title: "Nelta Tech",
    category: "Technology Website",
    tag: "TECH",
    description:
      "A clean and professional website for a technology-focused company.",
    image: "/work/nelta.jpg",
    link: "https://neltatech.com/",
  },
  {
    id: "social",
    title: "LOST_IN404 Social",
    category: "Social Strategy",
    tag: "SOCIAL",
    description: "Growth-focused content creation for Instagram, Pinterest & YouTube.",
    image: "/work/social.jpg",
    link: null,
  },
];

export const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "50+", label: "Projects Completed" },
  { value: "100%", label: "Client Satisfaction" },
] as const;

export const aboutCards = [
  { title: "Experience", text: "3 Years at Claygraphik Agency, UAE" },
  { title: "Education", text: "B.Com + Intl. School of Accounting" },
  { title: "Specialties", text: "Brand, Web, Cinema, Social" },
] as const;

export const timeline = [
  {
    year: "2021",
    title: "Started Web Development",
    desc: "Began professional journey at Claygraphik Agency, UAE",
  },
  {
    year: "2022",
    title: "Brand Design Expansion",
    desc: "Expanded into premium brand visuals and identity systems",
  },
  {
    year: "2023",
    title: "LOST_IN404 Founded",
    desc: "Launched personal design brand, offering full creative services",
  },
  {
    year: "2024",
    title: "Cinematic Content",
    desc: "Added cinematic photography & videography to the creative arsenal",
  },
] as const;

export const services = [
  {
    title: "Web Design & Development",
    description:
      "Modern responsive websites, portfolio sites, business websites. Fast, clean, and built to perform.",
    features: ["Custom Design", "Responsive Build", "SEO Optimized", "Fast Loading"],
    highlight: "Most Popular",
  },
  {
    title: "Premium Brand Visuals",
    description:
      "Logos, posters, mockups, and high-end visual identity assets that define your brand.",
    features: ["Logo Design", "Brand Identity", "Print Design", "Mockups"],
    highlight: null,
  },
  {
    title: "Social Media Management",
    description:
      "Content creation, optimization, posting strategy for Instagram, Pinterest & YouTube.",
    features: ["Content Creation", "Growth Strategy", "Analytics", "Community"],
    highlight: null,
  },
  {
    title: "Business Setup Services",
    description:
      "Document clearing and business setup assistance for UAE-based ventures.",
    features: ["Trade License", "Document Clearing", "PRO Services", "Consultation"],
    highlight: null,
  },
] as const;

/**
 * Two rows of genuine disciplines from the site's own services and
 * specialties — deliberately no client logos or invented software brands.
 */
export const disciplinesRowOne = [
  "Brand Identity",
  "Cinematic Content",
  "Web Design",
  "Social Strategy",
  "Typography",
  "Art Direction",
] as const;

export const disciplinesRowTwo = [
  "Logo Design",
  "Poster Series",
  "Content Creation",
  "Growth Strategy",
  "Photography",
  "UI / UX",
] as const;

export const routes = [
  { label: "Home", path: "/" },
  { label: "Work", path: "/work" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
] as const;

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.id === slug);
}

export function nextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.id === slug);
  return projects[(index + 1) % projects.length];
}
