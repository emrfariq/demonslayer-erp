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
import { recruitHunter } from "@/app/actions";

export function RecruitDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await recruitHunter(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to recruit hunter");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-primary text-white hover:brightness-110" />}>
        Recruit Hunter
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-primary">Final Selection</DialogTitle>
          <DialogDescription>
            Register a new candidate who has passed the Final Selection. They will start at Mizunoto rank.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-foreground">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Kamado Tanjiro"
                className="col-span-3 border-border bg-input"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="breathing_style" className="text-right text-foreground">
                Style
              </Label>
              <Input
                id="breathing_style"
                name="breathing_style"
                placeholder="Water Breathing"
                className="col-span-3 border-border bg-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-primary text-white hover:brightness-110">
              {loading ? "Recruiting..." : "Confirm Recruitment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
