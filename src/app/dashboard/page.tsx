import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();

  // Fetch some basic stats for the dashboard
  const { count: huntersCount } = await supabase
    .from("hunters")
    .select("*", { count: "exact", head: true });

  const { count: activeMissionsCount } = await supabase
    .from("missions")
    .select("*", { count: "exact", head: true })
    .eq("status", "Ongoing");

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="mb-12 border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading text-primary drop-shadow-md">
            Oyakata-sama's Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Demon Slayer Corps Central ERP System
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors">
            Recruit Hunter
          </Button>
          <Button className="bg-primary text-white hover:brightness-110 transition-all">
            Dispatch Mission
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-heading mb-2 text-secondary">Total Hunters</h2>
          <p className="text-5xl font-bold">{huntersCount ?? 0}</p>
          <p className="text-sm text-muted-foreground mt-2">Active corps members</p>
        </div>

        <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-heading mb-2 text-destructive">Active Missions</h2>
          <p className="text-5xl font-bold">{activeMissionsCount ?? 0}</p>
          <p className="text-sm text-muted-foreground mt-2">Hunters currently deployed</p>
        </div>

        <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-heading mb-2 text-accent">Butterfly Estate</h2>
          <p className="text-5xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-2">Hunters in recovery</p>
        </div>
      </main>
    </div>
  );
}
