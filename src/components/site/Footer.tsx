import { Link } from "@tanstack/react-router";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Your Books. Someone's Next Beginning. A student-to-student marketplace for NCERT,
            competitive exam and college books.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms and Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Book For Sale</span>
          <span className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Instagram</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-foreground">X</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
