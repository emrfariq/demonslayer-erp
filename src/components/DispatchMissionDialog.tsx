"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { dispatchMission } from "@/app/actions";
import { Hunter } from "@/lib/types";

export function DispatchMissionDialog({ activeHunters }: { activeHunters: Hunter[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHunters, setSelectedHunters] = useState<string[]>([]);

  async function onSubmit(formData: FormData) {
    if (selectedHunters.length === 0) {
      alert("Please assign at least one hunter!");
      return;
    }
    setLoading(true);
    try {
      await dispatchMission(formData, selectedHunters);
      setOpen(false);
      setSelectedHunters([]);
    } catch (error) {
      console.error(error);
      alert("Failed to dispatch mission");
    } finally {
      setLoading(false);
    }
  }

  const toggleHunter = (id: string) => {
    if (selectedHunters.includes(id)) {
      setSelectedHunters(selectedHunters.filter(hId => hId !== id));
    } else {
      setSelectedHunters([...selectedHunters, id]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-primary text-white hover:brightness-110" />}>
        Dispatch Kasugai Crow
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-primary">New Mission</DialogTitle>
          <DialogDescription>
            Deploy hunters to investigate demon activities.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-foreground">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Mt. Natagumo Incident"
                className="col-span-3 border-border bg-input"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right text-foreground">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Mt. Natagumo"
                className="col-span-3 border-border bg-input"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threat_level" className="text-right text-foreground">
                Threat
              </Label>
              <div className="col-span-3">
                <Select name="threat_level" defaultValue="Normal">
                  <SelectTrigger className="w-full border-border bg-input">
                    <SelectValue placeholder="Select Threat Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground border-border">
                    <SelectItem value="Normal">Normal Demon</SelectItem>
                    <SelectItem value="Lower Moon">Kizuki: Lower Moon</SelectItem>
                    <SelectItem value="Upper Moon">Kizuki: Upper Moon</SelectItem>
                    <SelectItem value="Muzan">Kibutsuji Muzan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 border-t border-border pt-4">
              <Label className="mb-2 block font-heading text-primary">Assign Hunters</Label>
              <div className="max-h-32 overflow-y-auto flex flex-col gap-2 border border-border p-2 rounded bg-muted/20">
                {activeHunters.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active hunters available.</p>
                ) : (
                  activeHunters.map((hunter) => (
                    <label key={hunter.id} className="flex items-center space-x-2 text-sm cursor-pointer p-1 hover:bg-muted/50 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedHunters.includes(hunter.id)}
                        onChange={() => toggleHunter(hunter.id)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span>{hunter.name} <span className="text-muted-foreground text-xs">({hunter.rank})</span></span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-primary text-white hover:brightness-110">
              {loading ? "Dispatching..." : "Send Crow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
