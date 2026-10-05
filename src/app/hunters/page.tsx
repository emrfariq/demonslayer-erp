import { createClient } from "@/lib/supabase/server";
import { Hunter } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecruitDialog } from "@/components/RecruitDialog";

export default async function HuntersPage() {
  const supabase = await createClient();
  const { data: hunters, error } = await supabase
    .from("hunters")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading text-primary">Corps Members</h1>
          <p className="text-muted-foreground mt-1">Manage active, recovering, and retired Demon Slayers.</p>
        </div>
        <RecruitDialog />
      </div>

      <div className="border border-border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Name</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Breathing Style</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hunters?.map((hunter: Hunter) => (
              <TableRow key={hunter.id} className="border-border border-b hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">{hunter.name}</TableCell>
                <TableCell>{hunter.rank}</TableCell>
                <TableCell>{hunter.breathing_style || "N/A"}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      hunter.status === 'Active' ? 'text-ds-green border-ds-green' : 
                      hunter.status === 'In Recovery' ? 'text-ds-thunder border-ds-thunder' : 
                      'text-muted-foreground'
                    }
                  >
                    {hunter.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(hunter.joined_date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {(!hunters || hunters.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hunters recruited yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
