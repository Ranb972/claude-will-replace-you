import { useState, type FormEvent } from "react";

const TECH_OPTIONS = [
  "React", "Vue", "Angular", "Svelte", "Next.js", "HTML/CSS",
  "Node.js", "Python", "Java", "Go", "Rust", "C#", "PHP", "Ruby",
  "React Native", "Flutter", "Swift", "Kotlin",
  "SQL", "MongoDB", "Redis", "PostgreSQL", "Firebase",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD",
  "TensorFlow", "PyTorch", "LLMs", "Data Science",
  "TypeScript", "GraphQL", "Blockchain", "Game Dev",
] as const;

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
  "w-full rounded-lg px-4 py-3 text-white placeholder-gray-600 font-display focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/60 transition-colors";
const inputStyle = {
  backgroundColor: "rgba(26,26,40,0.8)",
  border: "1px dashed #2a2a3a",
};

function AiComment({ text }: { text: string }) {
  return (
    <span dir="rtl" className="font-mono text-xs text-[var(--color-accent)] opacity-60 mr-2">
      {text}
    </span>
  );
}

export function InputForm({ onSubmit, isSubmitting }: InputFormProps) {
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

  function validate(data: FormData): FormErrors {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = "Required";
    else if (data.name.length > 50) errs.name = "Max 50 characters";

    if (!data.role.trim()) errs.role = "Required";
    else if (data.role.length > 100) errs.role = "Max 100 characters";

    if (!data.description.trim()) errs.description = "Required";
    else if (data.description.trim().length < 20)
      errs.description = "Tell us more! (20 chars minimum)";
    else if (data.description.length > 500)
      errs.description = "Max 500 characters";

    if (
      data.githubUrl &&
      !/^https?:\/\/(www\.)?github\.com\/.+/i.test(data.githubUrl)
    )
      errs.githubUrl = "Must be a valid GitHub URL";

    return errs;
  }

  function handleBlur(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  }

  function toggleTech(tech: string) {
    setForm((f) => ({
      ...f,
      technologies: f.technologies.includes(tech)
        ? f.technologies.filter((t) => t !== tech)
        : [...f.technologies, tech],
    }));
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[600px] mx-auto">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">
          Name / Nickname *
        </label>
        <input
          id="name"
          type="text"
          maxLength={50}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          onBlur={() => handleBlur("name")}
          aria-describedby={touched.name && errors.name ? "name-error" : undefined}
          aria-invalid={touched.name && !!errors.name}
          className={inputClasses}
          style={inputStyle}
          placeholder="e.g. Ran"
        />
        {touched.name && errors.name && (
          <p id="name-error" role="alert" className="mt-1.5 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">
          Job Title *
        </label>
        <input
          id="role"
          type="text"
          maxLength={100}
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          onBlur={() => handleBlur("role")}
          aria-describedby={touched.role && errors.role ? "role-error" : undefined}
          aria-invalid={touched.role && !!errors.role}
          className={inputClasses}
          style={inputStyle}
          placeholder="e.g. Full Stack Developer"
        />
        {touched.role && errors.role && (
          <p id="role-error" role="alert" className="mt-1.5 text-sm text-red-400">{errors.role}</p>
        )}
      </div>

      {/* Experience slider */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-300 font-mono">
            Years of Experience:{" "}
            <span className="text-[var(--color-accent)] font-bold text-base">{form.experience}</span>
          </label>
          <AiComment text="( כל שנה שווה פחות )" />
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
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-0.5 font-mono">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 font-mono">
            What do you do? *
          </label>
          <AiComment text="( Claude קורא כל מילה )" />
        </div>
        <textarea
          id="description"
          rows={3}
          maxLength={500}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          onBlur={() => handleBlur("description")}
          aria-describedby={touched.description && errors.description ? "description-error" : undefined}
          aria-invalid={touched.description && !!errors.description}
          className={`${inputClasses} resize-none`}
          style={inputStyle}
          placeholder="e.g. Building web apps, designing APIs, managing a team of 5..."
        />
        <div className="flex justify-between mt-1.5">
          {touched.description && errors.description ? (
            <p id="description-error" role="alert" className="text-sm text-red-400">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-600 font-mono">{form.description.length}/500</span>
        </div>
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
          Technologies
        </label>
        <div className="flex flex-wrap gap-2">
          {TECH_OPTIONS.map((tech) => {
            const selected = form.technologies.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                aria-pressed={selected}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer font-display"
                style={
                  selected
                    ? {
                        backgroundColor: "rgba(232,115,74,0.15)",
                        color: "#E8734A",
                        border: "1px solid rgba(232,115,74,0.5)",
                        boxShadow: "0 0 8px rgba(232,115,74,0.2)",
                      }
                    : {
                        backgroundColor: "rgba(26,26,40,0.8)",
                        color: "#8B8B8B",
                        border: "1px dashed #2a2a3a",
                      }
                }
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* GitHub URL */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label htmlFor="github" className="block text-sm font-medium text-gray-300 font-mono">
            GitHub URL <span className="text-gray-600">(optional)</span>
          </label>
          <AiComment text="( +5 הגנה. אם הקוד טוב. )" />
        </div>
        <input
          id="github"
          type="url"
          value={form.githubUrl}
          onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
          onBlur={() => handleBlur("githubUrl")}
          aria-describedby={touched.githubUrl && errors.githubUrl ? "github-error" : undefined}
          aria-invalid={touched.githubUrl && !!errors.githubUrl}
          className={inputClasses}
          style={inputStyle}
          placeholder="https://github.com/username"
        />
        {touched.githubUrl && errors.githubUrl && (
          <p id="github-error" role="alert" className="mt-1.5 text-sm text-red-400">{errors.githubUrl}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl px-6 py-3.5 text-lg font-bold text-white font-display transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:animate-pulse-glow"
        style={{
          background: "linear-gradient(135deg, #E8734A, #ef4444)",
          boxShadow: "0 4px 24px rgba(232,115,74,0.25)",
        }}
      >
        {isSubmitting ? "...מנתח" : "📋 Submit for AI Review"}
      </button>
    </form>
  );
}
