import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Save } from "lucide-react";
import { AdminShell, Card } from "@/components/admin/Shell";
import { apiRequest } from "@/lib/api";

type WebsiteSettings = {
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
  socialLinks: Record<"facebook" | "instagram" | "linkedIn" | "twitter" | "youtube", string>;
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
};

type SettingsResponse = {
  data: {
    settings: WebsiteSettings;
  };
};

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Website Settings — Yoflix Admin" },
      { name: "description", content: "Manage business info, hero, about, branding and SEO." },
    ],
  }),
  component: SettingsPage,
});

const tabs = ["Business Info", "Hero Section", "Contact & Social", "Branding & SEO"] as const;

function Field({
  label,
  value,
  onChange,
  ...props
}: { label: string; value: string; onChange: (value: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  ...props
}: { label: string; value: string; onChange: (value: string) => void } & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 min-h-[88px]"
      />
    </label>
  );
}

function SettingsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Business Info");
  const [draft, setDraft] = useState<WebsiteSettings | null>(null);
  const [notice, setNotice] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["website/settings"],
    queryFn: () => apiRequest<SettingsResponse>("/settings"),
  });

  useEffect(() => {
    if (data?.data.settings) {
      setDraft(structuredClone(data.data.settings));
    }
  }, [data]);

  const saveSettings = useMutation({
    mutationFn: (payload: WebsiteSettings) =>
      apiRequest<SettingsResponse>("/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["website/settings"] });
      setNotice("Settings saved successfully.");
    },
  });

  const updateSection = <
    Section extends keyof WebsiteSettings,
    Key extends keyof WebsiteSettings[Section],
  >(
    section: Section,
    key: Key,
    value: WebsiteSettings[Section][Key],
  ) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            [section]: {
              ...(current[section] as object),
              [key]: value,
            },
          }
        : current,
    );
    setNotice("");
  };

  const previewWebsite = () => {
    window.open("http://localhost:5174", "_blank", "noopener,noreferrer");
  };

  if (isLoading || !draft) {
    return (
      <AdminShell title="Website Settings" description="Manage all public-facing website content.">
        <Card>Loading settings...</Card>
      </AdminShell>
    );
  }

  if (isError) {
    return (
      <AdminShell title="Website Settings" description="Manage all public-facing website content.">
        <Card>
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load settings."}
          </p>
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Website Settings" description="Manage all public-facing website content.">
      <div className="flex flex-wrap gap-1.5 rounded-2xl bg-card border border-border p-1.5">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === item
                ? "bg-primary text-primary-foreground shadow-[0_6px_18px_-8px_rgba(109,93,252,0.5)]"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {tab === "Business Info" && (
            <Card>
              <h3 className="font-display font-semibold mb-4">Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Website Name"
                  value={draft.businessInfo.websiteName}
                  onChange={(value) => updateSection("businessInfo", "websiteName", value)}
                />
                <Field
                  label="Company Name"
                  value={draft.businessInfo.companyName}
                  onChange={(value) => updateSection("businessInfo", "companyName", value)}
                />
                <Field
                  label="Tagline"
                  value={draft.businessInfo.tagline}
                  onChange={(value) => updateSection("businessInfo", "tagline", value)}
                />
              </div>
              <div className="mt-3 grid gap-3">
                <TextArea
                  label="About Text"
                  value={draft.businessInfo.aboutText}
                  onChange={(value) => updateSection("businessInfo", "aboutText", value)}
                />
                <TextArea
                  label="Footer Description"
                  value={draft.businessInfo.footerDescription}
                  onChange={(value) => updateSection("businessInfo", "footerDescription", value)}
                />
              </div>
            </Card>
          )}

          {tab === "Hero Section" && (
            <Card>
              <h3 className="font-display font-semibold mb-4">Hero Content</h3>
              <div className="space-y-3">
                <Field
                  label="Badge"
                  value={draft.heroSection.badge}
                  onChange={(value) => updateSection("heroSection", "badge", value)}
                />
                <Field
                  label="Title"
                  value={draft.heroSection.title}
                  onChange={(value) => updateSection("heroSection", "title", value)}
                />
                <Field
                  label="Highlight Text"
                  value={draft.heroSection.highlightText}
                  onChange={(value) => updateSection("heroSection", "highlightText", value)}
                />
                <TextArea
                  label="Description"
                  value={draft.heroSection.description}
                  onChange={(value) => updateSection("heroSection", "description", value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    label="Primary Button Text"
                    value={draft.heroSection.primaryButtonText}
                    onChange={(value) => updateSection("heroSection", "primaryButtonText", value)}
                  />
                  <Field
                    label="Primary Button Link"
                    value={draft.heroSection.primaryButtonLink}
                    onChange={(value) => updateSection("heroSection", "primaryButtonLink", value)}
                  />
                  <Field
                    label="Secondary Button Text"
                    value={draft.heroSection.secondaryButtonText}
                    onChange={(value) => updateSection("heroSection", "secondaryButtonText", value)}
                  />
                  <Field
                    label="Secondary Button Link"
                    value={draft.heroSection.secondaryButtonLink}
                    onChange={(value) => updateSection("heroSection", "secondaryButtonLink", value)}
                  />
                </div>
              </div>
            </Card>
          )}

          {tab === "Contact & Social" && (
            <Card>
              <h3 className="font-display font-semibold mb-4">Contact & Social</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Business Email"
                  value={draft.contactInfo.businessEmail}
                  onChange={(value) => updateSection("contactInfo", "businessEmail", value)}
                />
                <Field
                  label="Support Email"
                  value={draft.contactInfo.supportEmail}
                  onChange={(value) => updateSection("contactInfo", "supportEmail", value)}
                />
                <Field
                  label="Phone"
                  value={draft.contactInfo.phoneNumber}
                  onChange={(value) => updateSection("contactInfo", "phoneNumber", value)}
                />
                <Field
                  label="WhatsApp"
                  value={draft.contactInfo.whatsappNumber}
                  onChange={(value) => updateSection("contactInfo", "whatsappNumber", value)}
                />
              </div>
              <div className="mt-3 space-y-3">
                <Field
                  label="Office Address"
                  value={draft.contactInfo.officeAddress}
                  onChange={(value) => updateSection("contactInfo", "officeAddress", value)}
                />
                {(["facebook", "instagram", "linkedIn", "twitter", "youtube"] as const).map(
                  (key) => (
                    <Field
                      key={key}
                      label={key}
                      value={draft.socialLinks[key]}
                      onChange={(value) => updateSection("socialLinks", key, value)}
                    />
                  ),
                )}
              </div>
            </Card>
          )}

          {tab === "Branding & SEO" && (
            <Card>
              <h3 className="font-display font-semibold mb-4">Branding & SEO</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Logo URL"
                  value={draft.branding.logo}
                  onChange={(value) => updateSection("branding", "logo", value)}
                />
                <Field
                  label="Favicon URL"
                  value={draft.branding.favicon}
                  onChange={(value) => updateSection("branding", "favicon", value)}
                />
                <Field
                  label="Primary Color"
                  value={draft.branding.primaryColor}
                  onChange={(value) => updateSection("branding", "primaryColor", value)}
                />
                <Field
                  label="Secondary Color"
                  value={draft.branding.secondaryColor}
                  onChange={(value) => updateSection("branding", "secondaryColor", value)}
                />
              </div>
              <div className="mt-3 space-y-3">
                <Field
                  label="Meta Title"
                  value={draft.seoSettings.metaTitle}
                  onChange={(value) => updateSection("seoSettings", "metaTitle", value)}
                />
                <TextArea
                  label="Meta Description"
                  value={draft.seoSettings.metaDescription}
                  onChange={(value) => updateSection("seoSettings", "metaDescription", value)}
                />
                <Field
                  label="Keywords"
                  value={draft.seoSettings.keywords.join(", ")}
                  onChange={(value) =>
                    updateSection(
                      "seoSettings",
                      "keywords",
                      value
                        .split(",")
                        .map((keyword) => keyword.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="font-display font-semibold mb-2">Save</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Apply changes to MongoDB-backed website settings.
            </p>
            <button
              onClick={() => saveSettings.mutate(draft)}
              disabled={saveSettings.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-70"
            >
              <Save className="h-4 w-4" /> {saveSettings.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={previewWebsite}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4" /> Preview Website
            </button>
            {(notice || saveSettings.isError) && (
              <p
                className={`mt-3 text-xs ${saveSettings.isError ? "text-destructive" : "text-success"}`}
              >
                {saveSettings.isError && saveSettings.error instanceof Error
                  ? saveSettings.error.message
                  : notice}
              </p>
            )}
          </Card>
          <Card>
            <h3 className="font-display font-semibold mb-2">Tips</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>Keep meta titles under 60 characters.</li>
              <li>Use absolute URLs for externally hosted images.</li>
              <li>Preview after saving to verify live content.</li>
            </ul>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
