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
  "w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-colors";
const inputStyle = {
  backgroundColor: "#1a1a28",
  border: "1px solid #2a2a3a",
};

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
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
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
        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1.5">
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
        <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1.5">
          Years of Experience:{" "}
          <span className="text-orange-400 font-bold text-base">{form.experience}</span>
        </label>
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
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-0.5">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5">
          What do you do? *
        </label>
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
          <span className="text-xs text-gray-600">{form.description.length}/500</span>
        </div>
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
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
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer"
                style={
                  selected
                    ? {
                        backgroundColor: "rgba(249,115,22,0.15)",
                        color: "#fb923c",
                        border: "1px solid rgba(249,115,22,0.4)",
                      }
                    : {
                        backgroundColor: "#1a1a28",
                        color: "#9ca3af",
                        border: "1px solid #2a2a3a",
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
        <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1.5">
          GitHub URL <span className="text-gray-600">(optional)</span>
        </label>
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
        className="w-full rounded-xl px-6 py-3.5 text-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          boxShadow: "0 4px 24px rgba(249,115,22,0.25)",
        }}
      >
        {isSubmitting ? "...מנתח" : "גלה את האמת 😰"}
      </button>
    </form>
  );
}
