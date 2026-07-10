import { describe, expect, it } from "vitest";
import { validatePricingEditor } from "../lib/pricing";

describe("pricing editor validation", () => {
  it("rejects duplicate plan names across existing plans", () => {
    const errors = validatePricingEditor(
      {
        title: "Starter",
        price: "19",
        billingType: "monthly",
        shortDescription: "A useful starter plan",
        features: ["Fast onboarding"],
        badge: "",
        buttonText: "Choose Plan",
        isPopular: false,
        isFeatured: false,
        isActive: true,
      },
      [
        {
          _id: "1",
          title: "Starter",
          slug: "starter",
          shortDescription: "Existing starter plan",
          price: "19",
          billingType: "monthly",
          features: ["Fast onboarding"],
          buttonText: "Choose Plan",
          badge: "",
          isPopular: false,
          isFeatured: false,
          isActive: true,
          order: 0,
        },
      ],
    );

    expect(errors.title).toBe("A plan with this name already exists.");
  });

  it("rejects invalid prices", () => {
    const errors = validatePricingEditor({
      title: "Growth",
      price: "abc",
      billingType: "monthly",
      shortDescription: "A useful growth plan",
      features: ["Fast onboarding"],
      badge: "",
      buttonText: "Choose Plan",
      isPopular: false,
      isFeatured: false,
      isActive: true,
    });

    expect(errors.price).toBe("Enter a valid price.");
  });

  it("allows unique plans with valid details", () => {
    const errors = validatePricingEditor({
      title: "Growth",
      price: "49",
      billingType: "monthly",
      shortDescription: "A useful growth plan",
      features: ["Fast onboarding"],
      badge: "",
      buttonText: "Choose Plan",
      isPopular: false,
      isFeatured: false,
      isActive: true,
    });

    expect(errors).toEqual({});
  });
});
