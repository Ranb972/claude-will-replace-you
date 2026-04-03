import { useState, useRef, useEffect, type FormEvent } from "react";
import { useLang } from "../lib/i18n";

const TECH_OPTIONS = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C#", "C++", "C",
  "PHP", "Ruby", "Haskell", "Elixir", "Scala", "Perl", "R", "MATLAB", "Lua",
  "Dart", "Zig", "Assembly", "Kotlin", "Swift",
  // Frontend
  "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "Remix", "Astro",
  "SolidJS", "HTML/CSS", "Three.js", "WebGL",
  // Backend
  "Node.js", "Express", "Hono", "Django", "Flask", "FastAPI", "Spring",
  "Rails", "Laravel",
  // Mobile
  "React Native", "Flutter", "Xamarin", "Ionic",
  // Data
  "SQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Cassandra", "DynamoDB",
  "Elasticsearch", "Neo4j", "Supabase", "Turso",
  // DevOps
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Ansible",
  "Jenkins", "GitHub Actions", "Vercel", "Netlify", "CI/CD",
  // AI/ML
  "TensorFlow", "PyTorch", "LLMs", "GPT", "Claude API", "LangChain",
  "HuggingFace", "Stable Diffusion", "Computer Vision", "NLP",
  "Data Science", "Pandas", "NumPy", "Jupyter",
  // Security
  "Cryptography", "Penetration Testing", "SOC", "SIEM",
  // Misc
  "GraphQL", "gRPC", "WebSockets", "Blockchain", "Game Dev", "Unity",
  "Unreal Engine", "Embedded Systems", "FPGA", "CUDA", "IoT", "Robotics",
];

interface FormData {
  name: string;
  role: string;
  experience: number;
  description: string;
  technologies: string[];
  githubUrl: string;
}

interface FormErrors {
  name?: string;
  role?: string;
  description?: string;
  githubUrl?: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

const inputClasses =
  "w-full rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 font-display focus:outline-none input-focus-glow transition-all duration-200";
const inputStyle = {
  backgroundColor: "rgba(26,26,40,0.8)",
  border: "1px dashed #2a2a3a",
};

// ── Tech Combobox ──

function TechCombobox({
  selected,
  onChange,
  placeholder,
}: {
  selected: string[];
  onChange: (techs: string[]) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? TECH_OPTIONS.filter(
        (t) =>
          t.toLowerCase().includes(query.toLowerCase()) && !selected.includes(t),
      ).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addTech(tech: string) {
    onChange([...selected, tech]);
    setQuery("");
  }

  function removeTech(tech: string) {
    onChange(selected.filter((t) => t !== tech));
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => { if (query.trim()) setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && filtered.length > 0) {
            e.preventDefault();
            addTech(filtered[0]);
          }
        }}
        className={inputClasses}
        style={inputStyle}
        placeholder={placeholder}
      />

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div
          className="absolute z-20 w-full mt-1 rounded-lg overflow-hidden max-h-48 overflow-y-auto"
          style={{ backgroundColor: "#12121a", border: "1px solid #2a2a3a" }}
        >
          {filtered.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => addTech(tech)}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors font-display"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = "rgba(232,115,74,0.1)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium font-display animate-chip-bounce"
              style={{
                backgroundColor: "rgba(232,115,74,0.15)",
                color: "#E8734A",
                border: "1px solid rgba(232,115,74,0.4)",
              }}
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="ml-0.5 hover:text-white transition-colors cursor-pointer text-base leading-none"
                aria-label={`Remove ${tech}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Form ──

export function InputForm({ onSubmit, isSubmitting }: InputFormProps) {
  const { t } = useLang();

  const [form, setForm] = useState<FormData>({
    name: "",
    role: "",
    experience: 3,
    description: "",
    technologies: [],
    githubUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function getExperienceLabel(years: number): string {
    if (years <= 2) return t("input.experience.junior");
    if (years <= 5) return t("input.experience.mid");
    if (years <= 10) return t("input.experience.senior");
    if (years <= 20) return t("input.experience.veteran");
    return t("input.experience.legend");
  }

  function validate(data: FormData): FormErrors {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = t("input.error.required");
    else if (data.name.length > 50) errs.name = t("input.error.name.max");

    if (!data.role.trim()) errs.role = t("input.error.required");
    else if (data.role.length > 100) errs.role = t("input.error.role.max");

    if (data.description.length > 500) errs.description = t("input.error.desc.max");

    if (
      data.githubUrl &&
      !/^https?:\/\/(www\.)?github\.com\/.+/i.test(data.githubUrl)
    )
      errs.githubUrl = t("input.error.github");

    return errs;
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, role: true, description: true, githubUrl: true });
    if (Object.keys(errs).length > 0) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-[600px] mx-auto">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
          {t("input.name.label")}
        </label>
        <input
          id="name"
          type="text"
          maxLength={50}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          onBlur={() => handleBlur("name")}
          aria-invalid={touched.name && !!errors.name}
          className={inputClasses}
          style={inputStyle}
          placeholder={t("input.name.placeholder")}
        />
        {touched.name && errors.name && (
          <p role="alert" className="mt-1 text-xs text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
          {t("input.role.label")}
        </label>
        <input
          id="role"
          type="text"
          maxLength={100}
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          onBlur={() => handleBlur("role")}
          aria-invalid={touched.role && !!errors.role}
          className={inputClasses}
          style={inputStyle}
          placeholder={t("input.role.placeholder")}
        />
        {touched.role && errors.role && (
          <p role="alert" className="mt-1 text-xs text-red-400">{errors.role}</p>
        )}
      </div>

      {/* Experience slider */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-300 font-mono">
            {t("input.experience.label")}{" "}
            <span className="text-[var(--color-accent)] font-bold text-base">{form.experience}</span>
            <span className="text-[var(--color-text-muted)] text-xs ml-2">{getExperienceLabel(form.experience)}</span>
          </label>
          <span className="font-mono text-xs text-[var(--color-accent)] opacity-60">
            {t("input.experience.comment")}
          </span>
        </div>
        <input
          id="experience"
          type="range"
          min={0}
          max={40}
          value={form.experience}
          onChange={(e) =>
            setForm((f) => ({ ...f, experience: Number(e.target.value) }))
          }
        />
        <div className="flex justify-between text-xs text-gray-600 mt-0.5 px-0.5 font-mono">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
        </div>
      </div>

      {/* Technologies — searchable combobox */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
          {t("input.tech.label")}
        </label>
        <TechCombobox
          selected={form.technologies}
          onChange={(techs) => setForm((f) => ({ ...f, technologies: techs }))}
          placeholder={t("input.tech.placeholder")}
        />
      </div>

      {/* Description (optional) */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 font-mono">
            {t("input.description.label")}
          </label>
          <span className="font-mono text-xs text-[var(--color-accent)] opacity-60">
            {t("input.description.comment")}
          </span>
        </div>
        <textarea
          id="description"
          rows={2}
          maxLength={500}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          onBlur={() => handleBlur("description")}
          className={`${inputClasses} resize-none`}
          style={inputStyle}
          placeholder={t("input.description.placeholder")}
        />
        <div className="flex justify-between mt-1">
          {touched.description && errors.description ? (
            <p role="alert" className="text-xs text-red-400">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-600 font-mono">{form.description.length}/500</span>
        </div>
      </div>

      {/* GitHub URL */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <label htmlFor="github" className="block text-sm font-medium text-gray-300 font-mono">
            {t("input.github.label")} <span className="text-gray-600">{t("input.github.optional")}</span>
          </label>
          <span className="font-mono text-xs text-[var(--color-accent)] opacity-60">
            {t("input.github.comment")}
          </span>
        </div>
        <input
          id="github"
          type="url"
          value={form.githubUrl}
          onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
          onBlur={() => handleBlur("githubUrl")}
          className={inputClasses}
          style={inputStyle}
          placeholder="https://github.com/username"
        />
        {touched.githubUrl && errors.githubUrl && (
          <p role="alert" className="mt-1 text-xs text-red-400">{errors.githubUrl}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl px-6 py-3 text-lg font-bold text-white font-display transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:animate-pulse-glow btn-shimmer"
        style={{
          background: "linear-gradient(135deg, #E8734A, #ef4444)",
          boxShadow: "0 4px 24px rgba(232,115,74,0.25)",
        }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            <span>{t("input.submitting")}</span>
          </span>
        ) : t("input.submit")}
      </button>
    </form>
  );
}
