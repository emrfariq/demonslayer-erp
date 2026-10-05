"use client";

import { completeMission, admitToMedical } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MissionActions({ 
  missionId, 
  multiplier, 
  assignedHunters 
}: { 
  missionId: string, 
  multiplier: number, 
  assignedHunters: { id: string, name: string }[] 
}) {
  const [loading, setLoading] = useState(false);

  const [injuryOpen, setInjuryOpen] = useState(false);
  const [injuryLoading, setInjuryLoading] = useState(false);

  const handleComplete = async () => {
    if (!confirm("Are you sure this mission is complete? Hazard pay will be processed.")) return;
    
    setLoading(true);
    try {
      await completeMission(missionId, multiplier);
    } catch (e) {
      console.error(e);
      alert("Failed to complete mission");
    } finally {
      setLoading(false);
    }
  };

  const onReportInjury = async (formData: FormData) => {
    const hunterId = formData.get("hunter_id") as string;
    const severity = formData.get("severity") as string;
    const days = Number(formData.get("days"));
    
    if (!hunterId) return alert("Select a hunter");

    setInjuryLoading(true);
    try {
      await admitToMedical(hunterId, severity, days);
      setInjuryOpen(false);
      alert("Hunter moved to Butterfly Estate.");
    } catch (e) {
      console.error(e);
      alert("Failed to report injury");
    } finally {
      setInjuryLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button 
        size="sm" 
        variant="outline" 
        className="text-ds-green border-ds-green hover:bg-ds-green hover:text-white"
        onClick={handleComplete}
        disabled={loading}
      >
        <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
      </Button>

      {assignedHunters.length > 0 && (
        <Dialog open={injuryOpen} onOpenChange={setInjuryOpen}>
          <DialogTrigger render={<Button size="sm" variant="outline" className="text-ds-fire border-ds-fire hover:bg-ds-fire hover:text-white" />}>
            <ShieldAlert className="w-4 h-4 mr-1" /> Injury
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border text-left">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl text-ds-fire">Report Injury</DialogTitle>
              <DialogDescription>
                Send an injured hunter to the Butterfly Estate for recovery.
              </DialogDescription>
            </DialogHeader>
            <form action={onReportInjury}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hunter_id" className="text-right text-foreground">Hunter</Label>
                  <div className="col-span-3">
                    <Select name="hunter_id" required>
                      <SelectTrigger className="w-full border-border bg-input">
                        <SelectValue placeholder="Select Hunter" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-card-foreground border-border">
                        {assignedHunters.map((h) => (
                          <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="severity" className="text-right text-foreground">Severity</Label>
                  <div className="col-span-3">
                    <Select name="severity" defaultValue="Severe">
                      <SelectTrigger className="w-full border-border bg-input">
                        <SelectValue placeholder="Select Severity" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-card-foreground border-border">
                        <SelectItem value="Light">Light</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="days" className="text-right text-foreground">Est. Days</Label>
                  <Input id="days" name="days" type="number" defaultValue="7" className="col-span-3 border-border bg-input" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={injuryLoading} className="bg-ds-fire text-white hover:brightness-110">
                  {injuryLoading ? "Sending..." : "Send to Butterfly Estate"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
