import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const USERS = [
  { email: "oyakata@corps.jp", name: "Kagaya Ubuyashiki", rank: "Oyakata", breathing_style: "None" },
  { email: "kyojuro@corps.jp", name: "Kyojuro Rengoku", rank: "Hashira", breathing_style: "Flame Breathing" },
  { email: "tanjiro@corps.jp", name: "Kamado Tanjiro", rank: "Mizunoto", breathing_style: "Water Breathing" },
  { email: "goto@corps.jp", name: "Goto", rank: "Kakushi", breathing_style: "None" },
];

export async function GET() {
  // Admin client bypasses RLS and email confirmation
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const results = [];

  for (const u of USERS) {
    // createUser with admin API: no email confirmation needed, no rate limit
    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: "password123",
      email_confirm: true,  // auto-confirm, no email needed
    });

    if (error && !error.message.includes("already been registered")) {
      results.push({ email: u.email, error: error.message });
      continue;
    }

    const userId = data?.user?.id;

    if (userId) {
      const { error: dbError } = await admin.from("hunters").upsert({
        user_id: userId,
        name: u.name,
        rank: u.rank,
        breathing_style: u.breathing_style,
        status: "Active",
      }, { onConflict: "user_id" });

      results.push({ email: u.email, rank: u.rank, success: !dbError, error: dbError?.message });
    } else {
      // User already exists — find them and upsert profile
      const { data: listData } = await admin.auth.admin.listUsers();
      const existing = listData?.users?.find(u2 => u2.email === u.email);
      if (existing) {
        await admin.from("hunters").upsert({
          user_id: existing.id,
          name: u.name,
          rank: u.rank,
          breathing_style: u.breathing_style,
          status: "Active",
        }, { onConflict: "user_id" });
        results.push({ email: u.email, rank: u.rank, success: true, note: "already existed, profile updated" });
      }
    }
  }

  // Seed missions
  await admin.from("missions").upsert([
    { id: 'b1111111-1111-1111-1111-111111111111', title: 'Mugen Train Investigation', location: 'Mugen Train', threat_level: 'Lower Moon', status: 'Completed', reward_multiplier: 2.5 },
    { id: 'b2222222-2222-2222-2222-222222222222', title: 'Mt. Natagumo Spiders', location: 'Mt. Natagumo', threat_level: 'Lower Moon', status: 'Ongoing', reward_multiplier: 2.5 },
  ], { onConflict: "id" });

  return NextResponse.json({ message: "✅ Seeding complete!", results });
}
