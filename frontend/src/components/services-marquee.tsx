"use client";

const services = [
  "VIRTUAL ASSISTANT SUPPORT",
  "EBAY FOCUSED SERVICES",
  "ACCOUNT CREATION",
  "ACCOUNT MANAGEMENT",
  "VIRTUAL ASSISTANT SUPPORT",
];

export default function ServicesMarquee() {
  return (
    <section className="w-full bg-[#f7f6f5]/90 py-8 overflow-hidden border-y border-white/10">
      <div className="mx-auto max-w-full">
        <div className="relative flex items-center h-16 bg-white/80 rounded-full border border-white/20 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          
          {/* Gradient mask left */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none rounded-l-full" />
          
          {/* Gradient mask right */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none rounded-r-full" />

          {/* Marquee container */}
          <div className="flex gap-6 px-8 overflow-hidden w-full">
            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {services.map((item, i) => (
                <div
                  key={`first-${i}`}
                  className="rounded-full bg-slate-50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[0_16px_40px_rgba(15,23,42,0.08)] flex-shrink-0"
                >
                  {item}
                </div>
              ))}
            </div>
            
            {/* Duplicate for seamless loop */}
            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {services.map((item, i) => (
                <div
                  key={`second-${i}`}
                  className="rounded-full bg-slate-50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[0_16px_40px_rgba(15,23,42,0.08)] flex-shrink-0"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
