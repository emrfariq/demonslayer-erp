"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  if (data.user) {
    const { error: insertError } = await supabase.from("hunters").insert({
      user_id: data.user.id,
      name,
      rank: "Mizunoto",
      status: "Candidate",
    });
    if (insertError) throw new Error(insertError.message);
  }
}

export async function addDeduction(payrollId: string, amount: number) {
  const supabase = await createClient();
  const { data: payroll } = await supabase.from("payrolls").select("deductions").eq("id", payrollId).single();
  if (payroll) {
    await supabase.from("payrolls").update({ deductions: payroll.deductions + amount }).eq("id", payrollId);
    revalidatePath("/payroll");
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function recruitHunter(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const breathing_style = formData.get("breathing_style") as string;
  
  if (!name) throw new Error("Name is required");

  const { error } = await supabase.from("hunters").insert({
    name,
    breathing_style: breathing_style || null,
    rank: "Mizunoto",
    status: "Active"
  });

  if (error) {
    console.error("Error recruiting hunter:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/hunters");
  revalidatePath("/");
}

export async function admitToMedical(hunterId: string, severity: string, days: number) {
  const supabase = await createClient();
  
  // 1. Add record
  const { error: medError } = await supabase.from("medical_records").insert({
    hunter_id: hunterId,
    injury_severity: severity,
    estimated_recovery_days: days
  });
  if (medError) throw medError;

  // 2. Update hunter status to In Recovery (Trigger C in system_flow)
  const { error: huntError } = await supabase
    .from("hunters")
    .update({ status: "In Recovery" })
    .eq("id", hunterId);
    
  if (huntError) throw huntError;

  revalidatePath("/medical");
  revalidatePath("/hunters");
  revalidatePath("/missions");
}

export async function dispatchMission(formData: FormData, hunterIds: string[]) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const threat_level = formData.get("threat_level") as string;

  // Insert Mission
  const { data: mission, error } = await supabase.from("missions").insert({
    title,
    location,
    threat_level,
    status: "Ongoing",
    reward_multiplier: threat_level === "Muzan" ? 10.0 : threat_level === "Upper Moon" ? 5.0 : threat_level === "Lower Moon" ? 2.5 : 1.0
  }).select().single();

  if (error) throw new Error(error.message);

  // Insert Assignments
  if (hunterIds.length > 0) {
    const assignments = hunterIds.map(id => ({
      mission_id: mission.id,
      hunter_id: id
    }));
    const { error: assignError } = await supabase.from("mission_assignments").insert(assignments);
    if (assignError) throw new Error(assignError.message);
  }

  revalidatePath("/missions");
  revalidatePath("/");
}

export async function completeMission(missionId: string, rewardMultiplier: number) {
  const supabase = await createClient();
  
  // 1. Mark mission complete
  const { error: updateError } = await supabase.from("missions").update({ status: "Completed" }).eq("id", missionId);
  if (updateError) throw new Error(updateError.message);

  // 2. Fetch assigned hunters
  const { data: assignments } = await supabase.from("mission_assignments").select("hunter_id").eq("mission_id", missionId);
  
  if (assignments && assignments.length > 0) {
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    
    // 3. For each hunter, add hazard pay (e.g., 5000 * multiplier)
    const bonus = 5000 * rewardMultiplier;
    
    for (const assignment of assignments) {
      // Upsert payroll for the current month
      const { data: existingPayroll } = await supabase.from("payrolls")
        .select("*")
        .eq("hunter_id", assignment.hunter_id)
        .eq("month_year", currentMonth)
        .single();
        
      if (existingPayroll) {
        await supabase.from("payrolls").update({
          hazard_pay_bonus: existingPayroll.hazard_pay_bonus + bonus
        }).eq("id", existingPayroll.id);
      } else {
        await supabase.from("payrolls").insert({
          hunter_id: assignment.hunter_id,
          month_year: currentMonth,
          base_salary: 10000, // Base salary Mizunoto
          hazard_pay_bonus: bonus,
          deductions: 0
        });
      }
    }
  }

  revalidatePath("/missions");
  revalidatePath("/payroll");
}
