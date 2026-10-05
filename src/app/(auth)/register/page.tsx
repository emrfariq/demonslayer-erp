"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { registerAction } from "@/app/actions";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await registerAction(formData);
      alert("Registration successful! You are now a Candidate. Awaiting Hashira approval.");
      // Redirect handled by action or manually
      window.location.href = "/login";
    } catch (e: any) {
      alert(e.message || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-heading text-primary">Final Selection Application</CardTitle>
          <CardDescription className="text-muted-foreground">
            Register to join the Demon Slayer Corps as a Candidate
          </CardDescription>
        </CardHeader>
        <form action={onSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="Kamado Tanjiro" required className="bg-input border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tanjiro@corps.jp" required className="bg-input border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} className="bg-input border-border" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-ds-water text-white hover:brightness-110" type="submit" disabled={loading}>
              {loading ? "Submitting Application..." : "Apply Now"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already passed? <Link href="/login" className="text-primary hover:underline">Login here</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
