"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { loginAction } from "@/app/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await loginAction(formData);
    } catch (e: any) {
      if (isRedirectError(e)) throw e; // let Next.js handle the redirect
      alert(e.message || "Login failed");
      setLoading(false);
    }
  }

  const fastLogin = async (email: string) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", "password123");
    try {
      await loginAction(formData);
    } catch (e: any) {
      if (isRedirectError(e)) throw e; // let Next.js handle the redirect
      alert(e.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-heading text-primary">Corps Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your Kasugai crow credentials to access the ERP
          </CardDescription>
        </CardHeader>

        {/* Development Fast Login */}
        <div className="px-6 pb-2">
          <div className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-bold">Fast Login (Dev Only)</div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => fastLogin('oyakata@corps.jp')} className="text-xs border-primary text-primary hover:bg-primary hover:text-white">Oyakata-sama</Button>
            <Button variant="outline" size="sm" type="button" onClick={() => fastLogin('kyojuro@corps.jp')} className="text-xs border-ds-fire text-ds-fire hover:bg-ds-fire hover:text-white">Hashira (Rengoku)</Button>
            <Button variant="outline" size="sm" type="button" onClick={() => fastLogin('tanjiro@corps.jp')} className="text-xs border-ds-water text-ds-water hover:bg-ds-water hover:text-white">Hunter (Tanjiro)</Button>
            <Button variant="outline" size="sm" type="button" onClick={() => fastLogin('goto@corps.jp')} className="text-xs border-ds-thunder text-ds-thunder hover:bg-ds-thunder hover:text-white">Kakushi (Goto)</Button>
          </div>
        </div>

        <form action={onSubmit}>
          <CardContent className="grid gap-4 mt-2 border-t border-border pt-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tanjiro@corps.jp" required className="bg-input border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="bg-input border-border" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary text-white hover:brightness-110" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account? <Link href="/register" className="text-primary hover:underline">Apply here</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
