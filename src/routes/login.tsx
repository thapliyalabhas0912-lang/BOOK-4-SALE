import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard } from "@/components/site/AuthCard";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Log in — Book For Sale" },
      { name: "description", content: "Sign in to buy and sell used books with fellow students." },
      { property: "og:title", content: "Log in — Book For Sale" },
      { property: "og:description", content: "Sign in to your Book For Sale account." },
    ],
  }),
  component: Login,
});

function safePath(p?: string) {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/account";
}

function Login() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setError(error.message === "Email not confirmed" ? "Please confirm your email first — check your inbox." : "Incorrect email or password.");
      return;
    }
    if (remember) localStorage.removeItem("bfs-no-remember");
    else {
      localStorage.setItem("bfs-no-remember", "1");
      sessionStorage.setItem("bfs-alive", "1");
    }
    navigate({ to: safePath(redirect) });
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to buy and sell books.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-teal hover:underline">Forgot password?</Link>
          </div>
          <div className="relative mt-1.5">
            <Input id="password" type={show ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
            <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Keep me signed in
        </label>
        {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Log in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link to="/signup" className="font-medium text-teal hover:underline">Create an account</Link>
      </p>
    </AuthCard>
  );
}
