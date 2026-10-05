import { createClient } from "@/lib/supabase/server";
import { Mission } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DispatchMissionDialog } from "@/components/DispatchMissionDialog";
import { MissionActions } from "@/components/MissionActions";

export default async function MissionsPage() {
  const supabase = await createClient();
  
  // Fetch missions with their assigned hunters
  const { data: missions, error } = await supabase
    .from("missions")
    .select(`
      *,
      mission_assignments (
        hunters (
          id, name, rank
        )
      )
    `)
    .order("created_at", { ascending: false });

  // Fetch active hunters for the dispatch dialog
  const { data: activeHunters } = await supabase
    .from("hunters")
    .select("*")
    .eq("status", "Active");

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading text-primary">Kasugai Crow Dispatch</h1>
          <p className="text-muted-foreground mt-1">Manage missions and assignments.</p>
        </div>
        <DispatchMissionDialog activeHunters={activeHunters || []} />
      </div>

      <div className="border border-border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Mission</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Threat Level</TableHead>
              <TableHead>Assigned Hunters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions?.map((mission: any) => (
              <TableRow key={mission.id} className="border-border border-b hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">{mission.title}</TableCell>
                <TableCell>{mission.location}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      mission.threat_level === 'Muzan' || mission.threat_level === 'Upper Moon' 
                      ? 'text-ds-blood border-ds-blood' 
                      : mission.threat_level === 'Lower Moon' 
                      ? 'text-ds-fire border-ds-fire' 
                      : 'text-muted-foreground'
                    }
                  >
                    {mission.threat_level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {mission.mission_assignments?.map((assignment: any) => (
                      <Badge key={assignment.hunters.id} variant="secondary" className="text-xs font-normal">
                        {assignment.hunters.name}
                      </Badge>
                    ))}
                    {(!mission.mission_assignments || mission.mission_assignments.length === 0) && (
                      <span className="text-muted-foreground text-xs italic">Unassigned</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={mission.status === 'Ongoing' ? 'text-primary border-primary' : ''}>
                    {mission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {mission.status === 'Ongoing' && (
                    <MissionActions 
                      missionId={mission.id} 
                      multiplier={mission.reward_multiplier} 
                      assignedHunters={mission.mission_assignments?.map((a: any) => ({ id: a.hunters.id, name: a.hunters.name })) || []}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!missions || missions.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No active missions. Peace prevails.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
