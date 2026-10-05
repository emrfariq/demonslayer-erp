"use client";

import { addDeduction } from "@/app/actions";
import { Button } from "@/components/ui/button";
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

export function DeductionDialog({ payrollId }: { payrollId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: FormData) => {
    const amount = Number(formData.get("amount"));
    setLoading(true);
    try {
      await addDeduction(payrollId, amount);
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to add deduction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" className="text-ds-fire border-ds-fire hover:bg-ds-fire hover:text-white" />}>
        Fine
      </DialogTrigger>
      <DialogContent className="sm:max-w-[325px] bg-card text-card-foreground border-border text-left">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-ds-fire">Issue Fine</DialogTitle>
          <DialogDescription>
            Add a deduction (e.g. for a broken sword).
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right text-foreground">Amount ¥</Label>
              <Input id="amount" name="amount" type="number" defaultValue="5000" className="col-span-3 border-border bg-input" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-ds-fire text-white hover:brightness-110">
              {loading ? "Processing..." : "Deduct Salary"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
