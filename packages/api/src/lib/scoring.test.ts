import { describe, expect, test } from "bun:test";
import { calculateScore, _testing } from "./scoring.js";
import { getModelForScore, MODEL_TIERS } from "./models.js";
import type { ProfileInput } from "../types.js";

const {
  experienceProtection,
  roleProtection,
  techProtection,
  descriptionProtection,
  githubProtection,
  calculateDaysLeft,
  randomBetween,
} = _testing;

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeInput(overrides: Partial<ProfileInput> = {}): ProfileInput {
  return {
    name: "Test User",
    role: "Software Developer",
    experience: 5,
    description: "I build web applications and APIs",
    technologies: [],
    githubUrl: "",
    ...overrides,
  };
}

// ─── Experience Protection ────────────────────────────────────────────────────

describe("experienceProtection", () => {
  test("0 years = 0 protection", () => {
    expect(experienceProtection(0)).toBe(0);
  });

  test("15 years = 15 protection", () => {
    expect(experienceProtection(15)).toBe(15);
  });

  test("30 years = 30 protection (cap)", () => {
    expect(experienceProtection(30)).toBe(30);
  });

  test("40 years capped at 30", () => {
    expect(experienceProtection(40)).toBe(30);
  });

  test("negative years clamped to 0", () => {
    expect(experienceProtection(-5)).toBe(0);
  });
});

// ─── Role Protection ──────────────────────────────────────────────────────────

describe("roleProtection", () => {
  test("CTO gets 20 (max)", () => {
    expect(roleProtection("CTO")).toBe(20);
  });

  test("intern gets 1 (min known)", () => {
    expect(roleProtection("Intern")).toBe(1);
  });

  test("full stack developer gets 10", () => {
    expect(roleProtection("Full Stack Developer")).toBe(10);
  });

  test("case insensitive matching", () => {
    expect(roleProtection("SENIOR DEVELOPER")).toBe(12);
    expect(roleProtection("senior developer")).toBe(12);
  });

  test("fuzzy match: role contains known key", () => {
    // 'lead frontend developer' contains 'frontend developer' (9) — best substring match
    expect(roleProtection("Lead Frontend Developer")).toBe(9);
  });

  test("fuzzy match: 'Senior Full Stack Engineer' — no exact substring match, gets default", () => {
    // 'senior full stack engineer' doesn't contain 'senior engineer' (space differs)
    // Falls through to default 8
    const result = roleProtection("Senior Full Stack Engineer");
    expect(result).toBe(8);
  });

  test("fuzzy match: 'Senior Backend Developer' finds 'backend developer' (10)", () => {
    // contains 'backend developer' (10), not 'senior developer' (different substring)
    expect(roleProtection("Senior Backend Developer")).toBe(10);
  });

  test("unknown role gets default 8", () => {
    expect(roleProtection("Banana Peeler")).toBe(8);
  });

  test("trims whitespace", () => {
    expect(roleProtection("  CTO  ")).toBe(20);
  });
});

// ─── Tech Protection ──────────────────────────────────────────────────────────

describe("techProtection", () => {
  test("hard-to-replace tech gives +2 each", () => {
    expect(techProtection(["Rust", "CUDA"])).toBe(4);
  });

  test("easy-to-replace tech gives -1 each", () => {
    expect(techProtection(["HTML", "CSS"])).toBe(0); // 0 floor
  });

  test("mix of hard and easy", () => {
    // rust(+2) + embedded(+2) + html(-1) = 3
    expect(techProtection(["Rust", "Embedded", "HTML"])).toBe(3);
  });

  test("capped at 15", () => {
    const hardTech = [
      "Rust",
      "CUDA",
      "Kernel",
      "Embedded",
      "FPGA",
      "Compiler",
      "Security",
      "Cryptography",
    ];
    // 8 * 2 = 16, capped at 15
    expect(techProtection(hardTech)).toBe(15);
  });

  test("floor at 0", () => {
    const easyTech = [
      "HTML",
      "CSS",
      "WordPress",
      "Excel",
      "Google Sheets",
      "Wix",
    ];
    expect(techProtection(easyTech)).toBe(0);
  });

  test("empty array = 0", () => {
    expect(techProtection([])).toBe(0);
  });

  test("case insensitive", () => {
    expect(techProtection(["RUST"])).toBe(2);
    expect(techProtection(["html"])).toBe(0);
  });

  test("neutral tech gives 0", () => {
    expect(techProtection(["React", "TypeScript", "Node.js"])).toBe(0);
  });
});

// ─── Description Protection ───────────────────────────────────────────────────

describe("descriptionProtection", () => {
  test("leadership keywords add points", () => {
    const desc = "I manage a team and lead architecture decisions";
    // manage(+1) + team(+1) + lead(+1) + architect(+1) + decision(+1) = 5
    expect(descriptionProtection(desc)).toBe(5);
  });

  test("vulnerability keywords subtract points", () => {
    const desc = "I fix bugs and maintain a simple CRUD application";
    // fix bugs(-1) + maintain(-1) + simple(-1) + crud(-1) = -4, floor 0
    expect(descriptionProtection(desc)).toBe(0);
  });

  test("mixed keywords", () => {
    const desc = "I lead a team but mostly fix bugs and maintain code";
    // lead(+1) + team(+1) + fix bugs(-1) + maintain(-1) = 0
    expect(descriptionProtection(desc)).toBe(0);
  });

  test("capped at 15", () => {
    const desc =
      "I manage, lead, team, architect, design system, client, stakeholder, mentor, strategy, decision, negotiate, hire, budget, vision, culture, innovate, patent, research, publish, novel";
    // 20 keywords, capped at 15
    expect(descriptionProtection(desc)).toBe(15);
  });

  test("empty description = 0", () => {
    expect(descriptionProtection("")).toBe(0);
  });
});

// ─── GitHub Protection ────────────────────────────────────────────────────────

describe("githubProtection", () => {
  test("with URL = 5", () => {
    expect(githubProtection("https://github.com/user")).toBe(5);
  });

  test("empty string = 0", () => {
    expect(githubProtection("")).toBe(0);
  });

  test("undefined = 0", () => {
    expect(githubProtection(undefined)).toBe(0);
  });

  test("whitespace only = 0", () => {
    expect(githubProtection("   ")).toBe(0);
  });
});

// ─── Days Left Calculation ────────────────────────────────────────────────────

describe("calculateDaysLeft", () => {
  test("score 85-100 → 1-30 days", () => {
    for (let i = 0; i < 20; i++) {
      const days = calculateDaysLeft(90);
      expect(days).toBeGreaterThanOrEqual(1);
      expect(days).toBeLessThanOrEqual(30);
    }
  });

  test("score 65-84 → 30-365 days", () => {
    for (let i = 0; i < 20; i++) {
      const days = calculateDaysLeft(70);
      expect(days).toBeGreaterThanOrEqual(30);
      expect(days).toBeLessThanOrEqual(365);
    }
  });

  test("score 45-64 → 365-1000 days", () => {
    for (let i = 0; i < 20; i++) {
      const days = calculateDaysLeft(50);
      expect(days).toBeGreaterThanOrEqual(365);
      expect(days).toBeLessThanOrEqual(1000);
    }
  });

  test("score 30-44 → 1000-2000 days", () => {
    for (let i = 0; i < 20; i++) {
      const days = calculateDaysLeft(35);
      expect(days).toBeGreaterThanOrEqual(1000);
      expect(days).toBeLessThanOrEqual(2000);
    }
  });

  test("score 20-29 → 2000-3000 days", () => {
    for (let i = 0; i < 20; i++) {
      const days = calculateDaysLeft(25);
      expect(days).toBeGreaterThanOrEqual(2000);
      expect(days).toBeLessThanOrEqual(3000);
    }
  });

  test("score 10-19 → 3000-5000 days", () => {
    for (let i = 0; i < 20; i++) {
      const days = calculateDaysLeft(15);
      expect(days).toBeGreaterThanOrEqual(3000);
      expect(days).toBeLessThanOrEqual(5000);
    }
  });

  test("score 5-9 → 5000-8000 days", () => {
    for (let i = 0; i < 20; i++) {
      const days = calculateDaysLeft(7);
      expect(days).toBeGreaterThanOrEqual(5000);
      expect(days).toBeLessThanOrEqual(8000);
    }
  });

  test("score 0-4 → 99999 days", () => {
    expect(calculateDaysLeft(0)).toBe(99999);
    expect(calculateDaysLeft(4)).toBe(99999);
  });
});

// ─── Model Tiers ──────────────────────────────────────────────────────────────

describe("getModelForScore", () => {
  test("score 100 → Haiku (tier 1)", () => {
    expect(getModelForScore(100).key).toBe("haiku");
  });

  test("score 85 → Haiku (tier 1)", () => {
    expect(getModelForScore(85).key).toBe("haiku");
  });

  test("score 84 → Sonnet (tier 2)", () => {
    expect(getModelForScore(84).key).toBe("sonnet");
  });

  test("score 65 → Sonnet (tier 2)", () => {
    expect(getModelForScore(65).key).toBe("sonnet");
  });

  test("score 64 → Opus (tier 3)", () => {
    expect(getModelForScore(64).key).toBe("opus");
  });

  test("score 45 → Opus (tier 3)", () => {
    expect(getModelForScore(45).key).toBe("opus");
  });

  test("score 44 → Titan (tier 4)", () => {
    expect(getModelForScore(44).key).toBe("titan");
  });

  test("score 30 → Titan (tier 4)", () => {
    expect(getModelForScore(30).key).toBe("titan");
  });

  test("score 29 → Colossus (tier 5)", () => {
    expect(getModelForScore(29).key).toBe("colossus");
  });

  test("score 20 → Colossus (tier 5)", () => {
    expect(getModelForScore(20).key).toBe("colossus");
  });

  test("score 19 → Singularity (tier 6)", () => {
    expect(getModelForScore(19).key).toBe("singularity");
  });

  test("score 10 → Singularity (tier 6)", () => {
    expect(getModelForScore(10).key).toBe("singularity");
  });

  test("score 9 → Skynet (tier 7)", () => {
    expect(getModelForScore(9).key).toBe("skynet");
  });

  test("score 5 → Skynet (tier 7)", () => {
    expect(getModelForScore(5).key).toBe("skynet");
  });

  test("score 4 → Infinity (tier 8)", () => {
    expect(getModelForScore(4).key).toBe("infinity");
  });

  test("score 0 → Infinity (tier 8)", () => {
    expect(getModelForScore(0).key).toBe("infinity");
  });

  test("all 8 tiers are defined", () => {
    expect(MODEL_TIERS).toHaveLength(8);
  });

  test("tiers cover full 0-100 range without gaps", () => {
    for (let score = 0; score <= 100; score++) {
      const model = getModelForScore(score);
      expect(model).toBeDefined();
      expect(model.key).toBeTruthy();
    }
  });
});

// ─── Integration: calculateScore ──────────────────────────────────────────────

describe("calculateScore", () => {
  test("intern with no skills → highly replaceable (high score)", () => {
    const result = calculateScore(
      makeInput({
        role: "Intern",
        experience: 0,
        description: "I fix bugs and do simple CRUD tasks",
        technologies: ["HTML", "CSS"],
      })
    );
    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.model.key).toBe("haiku");
    expect(result.tier).toBe(1);
  });

  test("CTO with 30 years and hard tech → very hard to replace (low score)", () => {
    const result = calculateScore(
      makeInput({
        role: "CTO",
        experience: 30,
        description:
          "I lead the team, manage strategy, hire engineers, architect systems, and make budget decisions",
        technologies: ["Rust", "CUDA", "Kernel", "Embedded", "Security"],
        githubUrl: "https://github.com/cto",
      })
    );
    // 30 + 20 + 10 + 8(desc: lead,team,manage,strategy,hire,architect,budget,decision) + 5 = 73 → score = 27
    expect(result.score).toBeLessThanOrEqual(30);
    expect(result.tier).toBeGreaterThanOrEqual(5);
  });

  test("mid-career full stack developer → mid-range score", () => {
    const result = calculateScore(
      makeInput({
        role: "Full Stack Developer",
        experience: 5,
        description: "I build web applications and REST APIs for clients",
        technologies: ["React", "TypeScript", "Node.js"],
        githubUrl: "https://github.com/dev",
      })
    );
    // 5 + 10 + 0 + 1(client) + 5 = 21 protection → score = 79
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThanOrEqual(90);
  });

  test("score is always 0-100", () => {
    const highProtection = calculateScore(
      makeInput({
        role: "CTO",
        experience: 40,
        description:
          "I manage, lead, team, architect, design system, client, stakeholder, mentor, strategy, decision, negotiate, hire, budget, vision, culture",
        technologies: [
          "Rust",
          "CUDA",
          "Kernel",
          "Embedded",
          "FPGA",
          "Compiler",
          "Security",
          "Cryptography",
        ],
        githubUrl: "https://github.com/max",
      })
    );
    expect(highProtection.score).toBeGreaterThanOrEqual(0);
    expect(highProtection.score).toBeLessThanOrEqual(100);

    const lowProtection = calculateScore(
      makeInput({
        role: "Intern",
        experience: 0,
        description: "I copy paste template boilerplate code",
        technologies: ["HTML", "CSS", "WordPress"],
      })
    );
    expect(lowProtection.score).toBeGreaterThanOrEqual(0);
    expect(lowProtection.score).toBeLessThanOrEqual(100);
  });

  test("daysLeft is within expected range for the tier", () => {
    const result = calculateScore(
      makeInput({
        role: "Intern",
        experience: 0,
        description: "I do simple routine standard tasks daily",
        technologies: ["HTML"],
      })
    );
    // High score → few days
    if (result.score >= 85) {
      expect(result.daysLeft).toBeGreaterThanOrEqual(1);
      expect(result.daysLeft).toBeLessThanOrEqual(30);
    }
  });

  test("model tier matches score range", () => {
    for (let i = 0; i < 50; i++) {
      const exp = Math.floor(Math.random() * 40);
      const result = calculateScore(
        makeInput({
          experience: exp,
          description: "I build and maintain software applications",
        })
      );
      expect(result.score).toBeGreaterThanOrEqual(result.model.scoreMin);
      expect(result.score).toBeLessThanOrEqual(result.model.scoreMax);
      expect(result.tier).toBe(result.model.tier);
    }
  });

  test("github URL adds protection (lowers score)", () => {
    const withoutGh = calculateScore(makeInput({ githubUrl: "" }));
    const withGh = calculateScore(
      makeInput({ githubUrl: "https://github.com/user" })
    );
    expect(withGh.score).toBe(withoutGh.score - 5);
  });
});

// ─── randomBetween ────────────────────────────────────────────────────────────

describe("randomBetween", () => {
  test("returns values in range", () => {
    for (let i = 0; i < 100; i++) {
      const val = randomBetween(10, 20);
      expect(val).toBeGreaterThanOrEqual(10);
      expect(val).toBeLessThanOrEqual(20);
    }
  });

  test("min === max returns that value", () => {
    expect(randomBetween(5, 5)).toBe(5);
  });
});
