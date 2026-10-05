import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions";
import { Sword, LogOut } from "lucide-react";

export function Navbar({ user, profile }: { user: any, profile: any }) {
  let navLinks: { href: string, label: string }[] = [];

  if (user) {
    if (profile?.rank === 'Oyakata' || profile?.rank === 'Hashira') {
      navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/hunters", label: "Corps Members" },
        { href: "/missions", label: "Missions" },
        { href: "/medical", label: "Butterfly Estate" },
        { href: "/payroll", label: "Payroll" },
      ];
    } else if (profile?.rank === 'Kakushi') {
      navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/medical", label: "Butterfly Estate" },
      ];
    } else {
      // Standard Hunter
      navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/missions", label: "My Missions" },
        { href: "/payroll", label: "My Payroll" },
      ];
    }
  }

  return (
    <nav className="bg-card border-b border-border text-card-foreground">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2 font-heading text-xl text-primary font-bold tracking-wider">
          <Sword className="h-6 w-6 text-ds-burgundy" />
          <span>DEMON SLAYER ERP</span>
        </Link>
        <div className="flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center space-x-4 border-l border-border pl-4">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                {profile?.name} <span className="text-xs">({profile?.rank})</span>
              </span>
              <form action={logoutAction}>
                <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-ds-fire">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-ds-green text-ds-green hover:bg-ds-green hover:text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
