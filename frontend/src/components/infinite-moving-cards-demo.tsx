"use client";

import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <section className="w-full bg-[#f8f8ff] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-full border border-gray-200 bg-white p-2 shadow-sm overflow-hidden">
          <InfiniteMovingCards
            items={services}
            direction="left"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    quote: "VIRTUAL ASSISTANT SUPPORT",
    name: "",
    title: "",
  },
  {
    quote: "EBAY FOCUSED SERVICES",
    name: "",
    title: "",
  },
  {
    quote: "ACCOUNT CREATION",
    name: "",
    title: "",
  },
  {
    quote: "ACCOUNT MANAGEMENT",
    name: "",
    title: "",
  },
  {
    quote: "VIRTUAL ASSISTANT",
    name: "",
    title: "",
  },
];
