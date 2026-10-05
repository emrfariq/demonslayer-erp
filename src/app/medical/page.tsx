import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function MedicalPage() {
  const supabase = await createClient();
  const { data: records, error } = await supabase
    .from("medical_records")
    .select("*, hunters(name, rank)")
    .order("admission_date", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading text-primary">Butterfly Estate (Medical)</h1>
          <p className="text-muted-foreground mt-1">Track injured hunters and their recovery status.</p>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Hunter</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Est. Recovery</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records?.map((record: any) => (
              <TableRow key={record.id} className="border-border border-b hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">
                  {record.hunters?.name} <span className="text-muted-foreground text-xs ml-2">({record.hunters?.rank})</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      record.injury_severity === 'Critical' ? 'text-ds-blood border-ds-blood' : 
                      record.injury_severity === 'Severe' ? 'text-ds-fire border-ds-fire' : 
                      'text-ds-thunder border-ds-thunder'
                    }
                  >
                    {record.injury_severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(record.admission_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.estimated_recovery_days} Days</TableCell>
                <TableCell>
                  {record.cleared_date ? (
                    <Badge variant="outline" className="text-ds-green border-ds-green">Cleared</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">In Treatment</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!records || records.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No medical records found. Everyone is healthy.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
