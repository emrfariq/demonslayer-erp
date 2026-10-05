import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ds-green rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ds-burgundy rounded-full blur-[100px]" />
      </div>

      <div className="z-10 text-center max-w-3xl px-4">
        <h1 className="text-5xl md:text-7xl font-heading text-primary drop-shadow-lg mb-6">
          Destroy Demons.<br/>Protect Humanity.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          The Demon Slayer Corps is looking for brave individuals. Stand against the darkness, master your breathing, and become the sword that guards the night. 
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg bg-ds-water text-white hover:brightness-110 shadow-lg shadow-ds-water/20">
              Register for Final Selection
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-ds-green text-ds-green hover:bg-ds-green hover:text-white">
              Corps Member Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
