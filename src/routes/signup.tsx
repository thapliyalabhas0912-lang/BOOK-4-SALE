import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard, FieldError } from "@/components/site/AuthCard";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Book For Sale" },
      { name: "description", content: "Join the student-to-student marketplace for used books." },
      { property: "og:title", content: "Create account — Book For Sale" },
      { property: "og:description", content: "Sign up to buy and sell second-hand books." },
    ],
  }),
  component: Signup,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    password: z.string().min(8, "At least 8 characters").max(72),
    confirm: z.string(),
    phone: z.string().trim().regex(/^$|^[0-9+ -]{7,15}$/, "Enter a valid mobile number"),
    city: z.string().trim().min(2, "Enter your city").max(80),
    terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

type Form = { fullName: string; email: string; password: string; confirm: string; phone: string; city: string; terms: boolean };

function Signup() {
  const [f, setF] = useState<Form>({ fullName: "", email: "", password: "", confirm: "", phone: "", city: "", terms: false });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const r = schema.safeParse(f);
    if (!r.success) {
      setErrs(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrs({});
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: r.data.email,
      password: r.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: r.data.fullName, city: r.data.city, phone: r.data.phone || null },
      },
    });
    setBusy(false);
    if (error) return setError(error.message);
    setSent(true);
  };

  if (sent)
    return (
      <AuthCard title="Check your email">
        <MailCheck className="h-8 w-8 text-teal" />
        <p className="mt-4 text-sm text-muted-foreground">
          We sent a confirmation link to <strong className="text-foreground">{f.email}</strong>. Click it to activate your account, then log in.
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm font-medium text-teal hover:underline">Go to login</Link>
      </AuthCard>
    );

  const field = (k: keyof Form, label: string, type = "text", auto?: string) => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} autoComplete={auto} value={f[k] as string} onChange={set(k)} className="mt-1.5" />
      <FieldError msg={errs[k]} />
    </div>
  );

  return (
    <AuthCard title="Create your account" subtitle="One account to buy and sell.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {field("fullName", "Full name", "text", "name")}
        {field("email", "Email", "email", "email")}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("password", "Password", "password", "new-password")}
          {field("confirm", "Confirm password", "password", "new-password")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("phone", "Mobile (optional)", "tel", "tel")}
          {field("city", "City", "text", "address-level2")}
        </div>
        <div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox checked={f.terms} onCheckedChange={(v) => setF({ ...f, terms: !!v })} className="mt-0.5" />
            <span>I agree to the <Link to="/terms" className="text-teal hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-teal hover:underline">Privacy Policy</Link>.</span>
          </label>
          <FieldError msg={errs["terms"]} />
        </div>
        {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-teal hover:underline">Log in</Link>
      </p>
    </AuthCard>
  );
}
