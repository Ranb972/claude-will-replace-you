import { useState, type FormEvent } from "react";
import { useLang } from "../lib/i18n";

const TECH_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C#", "C++", "C",
  "PHP", "Ruby", "Haskell", "Elixir", "Scala", "Perl", "R", "MATLAB", "Lua",
  "Dart", "Zig", "Assembly", "Kotlin", "Swift",
  "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "Remix", "Astro",
  "SolidJS", "HTML/CSS", "Three.js", "WebGL",
  "Node.js", "Express", "Hono", "Django", "Flask", "FastAPI", "Spring",
  "Rails", "Laravel",
  "React Native", "Flutter", "Xamarin", "Ionic",
  "SQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Cassandra", "DynamoDB",
  "Elasticsearch", "Neo4j", "Supabase", "Turso",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Ansible",
  "Jenkins", "GitHub Actions", "Vercel", "Netlify", "CI/CD",
  "TensorFlow", "PyTorch", "LLMs", "GPT", "Claude API", "LangChain",
  "HuggingFace", "Stable Diffusion", "Computer Vision", "NLP",
  "Data Science", "Pandas", "NumPy", "Jupyter",
  "Cryptography", "Penetration Testing", "SOC", "SIEM",
  "GraphQL", "gRPC", "WebSockets", "Blockchain", "Game Dev", "Unity",
  "Unreal Engine", "Embedded Systems", "FPGA", "CUDA", "IoT", "Robotics",
];

interface FormData {
  name: string;
  role: string;
  experience: number;
  technologies: string[];
  githubUrl: string;
}

interface InputFormProps {
  onSubmit: (data: FormData & { description: string }) => void;
  isSubmitting: boolean;
}

const inputCls =
  "w-full rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 font-display focus:outline-none input-focus-glow transition-all duration-200";
const inputSt = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export function InputForm({ onSubmit, isSubmitting }: InputFormProps) {
  const { t } = useLang();
  const [form, setForm] = useState<FormData>({
    name: "", role: "", experience: 3, technologies: [], githubUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [techQuery, setTechQuery] = useState("");

  function getExpLabel(y: number): string {
    if (y <= 2) return t("input.experience.junior");
    if (y <= 5) return t("input.experience.mid");
    if (y <= 10) return t("input.experience.senior");
    if (y <= 20) return t("input.experience.veteran");
    return t("input.experience.legend");
  }

  function validate(d: FormData) {
    const e: Record<string, string> = {};
    if (!d.name.trim()) e.name = t("input.error.required");
    else if (d.name.length > 50) e.name = t("input.error.name.max");
    if (!d.role.trim()) e.role = t("input.error.required");
    else if (d.role.length > 100) e.role = t("input.error.role.max");
    if (d.githubUrl && !/^https?:\/\/(www\.)?github\.com\/.+/i.test(d.githubUrl))
      e.githubUrl = t("input.error.github");
    return e;
  }

  function handleBlur(f: string) {
    setTouched((p) => ({ ...p, [f]: true }));
    setErrors(validate(form));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, role: true, githubUrl: true });
    if (Object.keys(errs).length > 0) return;
    onSubmit({ ...form, description: "" });
  }

  const availableTechs = TECH_OPTIONS.filter(
    (t) => !form.technologies.includes(t) && (!techQuery.trim() || t.toLowerCase().includes(techQuery.toLowerCase())),
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-[600px] mx-auto">
      {/* Name + Role side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">{t("input.name.label")}</label>
          <input id="name" type="text" maxLength={50} value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onBlur={() => handleBlur("name")}
            className={inputCls} style={inputSt} placeholder={t("input.name.placeholder")}
          />
          {touched.name && errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1.5">{t("input.role.label")}</label>
          <input id="role" type="text" maxLength={100} value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            onBlur={() => handleBlur("role")}
            className={inputCls} style={inputSt} placeholder={t("input.role.placeholder")}
          />
          {touched.role && errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
        </div>
      </div>

      {/* Experience */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="exp" className="text-sm font-medium text-gray-300">{t("input.experience.label")}</label>
          <span className="text-sm font-mono">
            <span className="text-[var(--color-accent)] font-bold">{form.experience}</span>
            <span className="text-[var(--color-text-muted)] text-xs ml-1.5">{getExpLabel(form.experience)}</span>
          </span>
        </div>
        <input id="exp" type="range" min={0} max={40} value={form.experience}
          onChange={(e) => setForm((f) => ({ ...f, experience: Number(e.target.value) }))}
        />
      </div>

      {/* Technologies — always-open grid */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("input.tech.label")}</label>

        {/* Selected tags */}
        {form.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.technologies.map((tech) => (
              <span key={tech} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium animate-chip-bounce"
                style={{ backgroundColor: "rgba(232,115,74,0.12)", color: "#E8734A", border: "1px solid rgba(232,115,74,0.25)" }}>
                {tech}
                <button type="button" onClick={() => setForm((f) => ({ ...f, technologies: f.technologies.filter((t) => t !== tech) }))}
                  className="hover:text-white transition-colors cursor-pointer leading-none">&times;</button>
              </span>
            ))}
          </div>
        )}

        {/* Search */}
        <input type="text" value={techQuery} onChange={(e) => setTechQuery(e.target.value)}
          className={inputCls + " mb-2"} style={inputSt} placeholder={t("input.tech.placeholder")}
        />

        {/* Grid — always visible */}
        <div className="max-h-40 overflow-y-auto rounded-lg p-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          {availableTechs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {availableTechs.map((tech) => (
                <button key={tech} type="button"
                  onClick={() => { setForm((f) => ({ ...f, technologies: [...f.technologies, tech] })); setTechQuery(""); }}
                  className="text-left px-2.5 py-1.5 rounded text-xs text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors truncate"
                >
                  {tech}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600 text-center py-3">No matches</p>
          )}
        </div>
      </div>

      {/* GitHub */}
      <div>
        <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1.5">
          {t("input.github.label")} <span className="text-gray-600">{t("input.github.optional")}</span>
        </label>
        <input id="github" type="url" value={form.githubUrl}
          onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
          onBlur={() => handleBlur("githubUrl")}
          className={inputCls} style={inputSt} placeholder="https://github.com/username"
        />
        {touched.githubUrl && errors.githubUrl && <p className="mt-1 text-xs text-red-400">{errors.githubUrl}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={isSubmitting}
        className="w-full rounded-xl px-6 py-3 text-base font-semibold text-white font-display transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] btn-shimmer"
        style={{ background: "linear-gradient(135deg, #E8734A, #ef4444)" }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            {t("input.submitting")}
          </span>
        ) : t("input.submit")}
      </button>
    </form>
  );
}
