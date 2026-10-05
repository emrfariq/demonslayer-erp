import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeductionDialog } from "@/components/DeductionDialog";

export default async function PayrollPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get current user's profile to enforce RLS / logic
  let profile = null;
  if (user) {
    const { data } = await supabase.from("hunters").select("*").eq("user_id", user.id).single();
    profile = data;
  }

  let query = supabase
    .from("payrolls")
    .select("*, hunters(name, rank)")
    .order("month_year", { ascending: false });

  // If standard hunter, only show their own payroll
  if (profile && profile.rank !== 'Oyakata' && profile.rank !== 'Hashira' && profile.rank !== 'Kakushi') {
    query = query.eq('hunter_id', profile.id);
  }

  const { data: payrolls, error } = await query;

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading text-primary">Corps Payroll</h1>
          <p className="text-muted-foreground mt-1">Manage salaries, hazard pays, and deductions.</p>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Month</TableHead>
              <TableHead>Hunter</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Hazard Pay</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead className="text-right">Total Net</TableHead>
              {(profile?.rank === 'Oyakata' || profile?.rank === 'Hashira' || profile?.rank === 'Kakushi') && (
                <TableHead className="text-center">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls?.map((payroll: any) => {
              const total = Number(payroll.base_salary) + Number(payroll.hazard_pay_bonus) - Number(payroll.deductions);
              return (
                <TableRow key={payroll.id} className="border-border border-b hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{payroll.month_year}</TableCell>
                  <TableCell>
                    {payroll.hunters?.name} <span className="text-muted-foreground text-xs ml-1">({payroll.hunters?.rank})</span>
                  </TableCell>
                  <TableCell>¥{payroll.base_salary}</TableCell>
                  <TableCell className="text-ds-green">+¥{payroll.hazard_pay_bonus}</TableCell>
                  <TableCell className="text-ds-blood">-¥{payroll.deductions}</TableCell>
                  <TableCell className="text-right font-bold">¥{total}</TableCell>
                  {(profile?.rank === 'Oyakata' || profile?.rank === 'Hashira' || profile?.rank === 'Kakushi') && (
                    <TableCell className="text-center">
                      <DeductionDialog payrollId={payroll.id} />
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
            {(!payrolls || payrolls.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No payroll records found for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
