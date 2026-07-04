import { motion } from "framer-motion";
import React from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Array<{
    quote: string;
    name: string;
    title: string;
  }>;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const getSpeed = () => {
    switch (speed) {
      case "fast":
        return 20;
      case "normal":
        return 40;
      case "slow":
        return 80;
      default:
        return 40;
    }
  };

  const isLeftToRight = direction === "left";

  return (
    <div
      ref={containerRef}
      className={`scroller relative z-20 w-full overflow-hidden ${className || ""}`}
    >
      <motion.div
        ref={scrollerRef}
        animate={{
          x: isLeftToRight ? [0, -500] : [0, 500],
        }}
        transition={{
          duration: getSpeed(),
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-4 w-max"
        onMouseEnter={() => {
          if (pauseOnHover && scrollerRef.current) {
            scrollerRef.current.style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={() => {
          if (pauseOnHover && scrollerRef.current) {
            scrollerRef.current.style.animationPlayState = "running";
          }
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="min-w-max rounded-full bg-slate-50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
          >
            {item.quote}
          </div>
        ))}
        {items.map((item, idx) => (
          <div
            key={`duplicate-${idx}`}
            className="min-w-max rounded-full bg-slate-50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
          >
            {item.quote}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
