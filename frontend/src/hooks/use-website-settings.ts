import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export type WebsiteSettings = {
  businessInfo: {
    websiteName: string;
    companyName: string;
    tagline: string;
    aboutText: string;
    footerDescription: string;
  };
  heroSection: {
    badge: string;
    title: string;
    highlightText: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage: string;
  };
  contactInfo: {
    businessEmail: string;
    supportEmail: string;
    phoneNumber: string;
    whatsappNumber: string;
    officeAddress: string;
    googleMapsLink: string;
  };
  socialLinks: Record<string, string>;
  branding: {
    logo: string;
    favicon: string;
    footerLogo: string;
    primaryColor: string;
    secondaryColor: string;
    ogImage: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  contentSections?: Record<string, any>;
};

export function useWebsiteSettings() {
  return useQuery<WebsiteSettings, Error>({
    queryKey: ["website/settings"],
    queryFn: async () => {
      const res = await apiRequest<{ data: { settings: WebsiteSettings } }>("/settings");
      return res.data.settings;
    },
    staleTime: 60_000,
  });
}

export default useWebsiteSettings;
