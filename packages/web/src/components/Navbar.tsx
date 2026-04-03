import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n";

export function Navbar() {
  const { lang, setLang, t } = useLang();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-[1000px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-6 h-6 rounded-full shrink-0"
            style={{ background: "linear-gradient(135deg, #E8734A, #ef4444)" }}
          />
          <span className="font-display font-bold text-sm text-white hidden sm:block group-hover:text-[var(--color-accent)] transition-colors">
            {t("nav.title")}
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link
            to="/leaderboard"
            className="font-display text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            {t("nav.leaderboard")}
          </Link>
          <button
            onClick={() => setLang(lang === "en" ? "he" : "en")}
            className="text-xs px-2.5 py-1 rounded-md cursor-pointer transition-all duration-150 hover:bg-white/5"
            style={{ color: "#8B8B8B", border: "1px solid rgba(255,255,255,0.08)" }}
            aria-label="Toggle language"
          >
            {lang === "en" ? "EN" : "HE"}
          </button>
        </div>
      </div>
    </nav>
  );
}
