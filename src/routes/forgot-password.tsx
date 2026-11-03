import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/site/AuthCard";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — Book For Sale" },
      { name: "description", content: "Reset your Book For Sale password." },
      { property: "og:title", content: "Forgot password — Book For Sale" },
      { property: "og:description", content: "Get a link to reset your password." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    if (error) setError(error.message);
    else setDone(true);
  };

  return (
    <AuthCard title="Reset your password" subtitle="We'll email you a secure link.">
      {done ? (
        <p className="rounded-md bg-accent p-4 text-sm text-accent-foreground">If an account exists for {email}, a reset link is on its way.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link</Button>
        </form>
      )}
      <Link to="/login" className="mt-6 inline-block text-sm font-medium text-teal hover:underline">Back to login</Link>
    </AuthCard>
  );
}
