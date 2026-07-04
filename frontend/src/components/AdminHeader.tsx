import { Bell } from "lucide-react";

export function AdminHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-6 lg:px-10 py-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-bold truncate">{title}</h1>
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-secondary transition-colors">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">AS</div>
        </div>
      </div>
    </header>
  );
}
