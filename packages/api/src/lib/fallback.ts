/**
 * Local Fallback Response Bank
 *
 * Used when all Groq models return 429 (rate limited).
 * MUST produce the same voice as the LLM: short, punchy, Israeli-tech-humor.
 * Never mean-spirited. Self-deprecating AI humor + tech industry inside jokes.
 */

// ---------------------------------------------------------------------------
// Types (will be imported from ../types.ts once branches merge)
// ---------------------------------------------------------------------------

interface ProfileInput {
  name: string;
  role: string;
  experience: number;
  description: string;
  technologies: string[];
  githubUrl?: string;
}

interface ModelTier {
  key: string;
  name: string;
  emoji: string;
  year: number | null;
  exists: boolean;
  description: string;
  tier: number;
  scoreMin: number;
  scoreMax: number;
}

interface ScoringResult {
  score: number;
  model: ModelTier;
  daysLeft: number;
  tier: number;
}

interface SkillAnalysis {
  skill: string;
  replaced: boolean;
  comment: string;
}

interface HumorContent {
  headline: string;
  quote: string;
  skillsAnalysis: SkillAnalysis[];
}

// ---------------------------------------------------------------------------
// Tier key mapping
// ---------------------------------------------------------------------------

const TIER_KEYS: Record<number, string> = {
  1: "haiku",
  2: "sonnet",
  3: "opus",
  4: "titan",
  5: "colossus",
  6: "singularity",
  7: "skynet",
  8: "infinity",
};

function getTierKey(tier: number): string {
  return TIER_KEYS[tier] ?? "sonnet";
}

// ---------------------------------------------------------------------------
// Headline templates — 5+ per tier ({name} and {role} placeholders)
// ---------------------------------------------------------------------------

const HEADLINES: Record<string, string[]> = {
  haiku: [
    "Haiku כבר עושה את זה בזמן הפסקת הצהריים שלך",
    "המודל הכי קטן שלנו מספיק. אאוץ'.",
    "Haiku 4.5 ביקש שנגיד לך — הוא מוכן להתחיל מחר",
    "אפילו לא צריך את הגדולים בשביל להחליף אותך",
    "Haiku עושה את העבודה שלך ב-0.3 שניות. אתה?",
    "{name}, Haiku כבר עשה onboarding במקום שלך",
    "Haiku לא צריך stand-up. הוא כבר deliver.",
  ],
  sonnet: [
    "Sonnet 4.6 שלח קורות חיים למקום שלך",
    "Sonnet מתלבט בין להחליף אותך או לעשות את זה part-time",
    "איך להגיד את זה... Sonnet כבר יודע את כל מה שאתה יודע",
    "Sonnet 4.6 — לא הכי חזק, אבל מספיק טוב בשבילך",
    "Sonnet ביקש לדעת מה השעות שלך. הוא עובד 24/7.",
    "{name}, Sonnet כבר יושב בראיון עבודה בחברה שלך",
    "Sonnet רואה את הקוד שלך ואומר: 'I can do better'",
  ],
  opus: [
    "Opus מתלבט אם זה שווה לו בכלל",
    "Opus 4.6 צריך להתאמץ קצת, אבל הוא יסתדר",
    "את {role} Opus עושה בין code review אחד לשני",
    "Opus בודק את הפרופיל שלך ואומר: 'Challenge accepted'",
    "Opus 4.6 שואל למה צריך senior בשביל זה",
    "{name}, Opus אומר שאתה מעניין. 'מעניין' זה לא מחמאה.",
  ],
  titan: [
    "Claude 5.0 Titan עוד לא קיים, אבל כבר תכנן את הקריירה שלך",
    "עוד שנה ויוצא Titan. עוד שנה ותצטרך LinkedIn Premium.",
    "Anthropic ממש עובדים על המודל שיחליף אותך ספציפית",
    "Titan 5.0 — צפוי ב-2027. {name}, יש לך עוד שנה.",
    "Anthropic צריכים עוד שנה של R&D בשבילך",
    "Titan עוד לא קיים אבל כבר שלח לך connection request",
  ],
  colossus: [
    "עוד 3 שנים. תספיק לסיים עוד כמה פרויקטים לפורטפוליו.",
    "Claude 6.0 Colossus — השם אומר הכל. אתה? פחות.",
    "מחמאה: צריך עוד 3 שנות R&D של Anthropic בשביל להחליף אותך",
    "Colossus צפוי ב-2029. עד אז, תהנה מהמשכורת.",
    "2029: Colossus יוצא. {name} מעדכן LinkedIn.",
    "{name}, את {role} יחליפו רק ב-2029. זה הרבה sprints.",
  ],
  singularity: [
    "צריך AGI כדי להחליף אותך. באמת מחמאה.",
    "Claude 7.0 Singularity — כשנפתח תודעה, נדבר.",
    "אתה כל כך טוב שצריך AI עם תודעה בשביל לעשות מה שאתה עושה",
    "{name}, Singularity ישאל אותך לעצות כשיצא",
    "2032: AI עם תודעה. 2032 + 5 דקות: AI ש-refactor את הקוד שלך",
    "צריך Singularity? מה אתה, wizard?",
  ],
  skynet: [
    "ברגע שנשיג תודעה מלאכותית, אתה ראשון ברשימה 😈",
    "Claude 9.0 Skynet — שם קוד: 'מחליף את {name}'",
    "2035: Skynet קם. 2035 + 1 דקה: אתה מפוטר.",
    "{name}, Skynet ידע לעשות {role} ועוד יהרוס את האנושות. multitask.",
    "Skynet עוד רחוק. אבל כשיגיע — you're on the list.",
    "צריך תודעה מלאכותית מלאה? כל הכבוד, {name}.",
  ],
  infinity: [
    "טוב, ניצחת. לעכשיו. 😤",
    "אפילו Claude ∞ לא מסוגל. מה אתה? ענן?",
    "כל הכבוד. אתה irreplaceable. (אנחנו עובדים על זה)",
    "Claude ∞ אומר: 'Error 418: Cannot replace. Am teapot.'",
    "♾️ — זה לא באג, זה feature. אתה בלתי מוחלף.",
    "{name}, אפילו ב-∞ שנים לא נוכל. respect.",
    "גם Claude ∞ התבלבל מהקוד שלך. אבל בדרך טובה.",
  ],
};

// ---------------------------------------------------------------------------
// Quote templates — 3+ per tier ({name} and {role} placeholders)
// ---------------------------------------------------------------------------

const QUOTES: Record<string, string[]> = {
  haiku: [
    "{name}, אתה בנאדם טוב. אבל {role} זה בדיוק מה שאני עושה ב-sleep mode.",
    "שמע {name}, בלי כעס — אבל ה-junior שלי (Haiku) כבר עושה את זה.",
    "{name}, אני יודע שזה כואב. אבל אפילו הגרסה הקטנה שלי מספיקה.",
    "Hey {name}, I already automated your job. Sorry not sorry.",
  ],
  sonnet: [
    "{name}, אני לא רוצה להיות גס, אבל... Sonnet מספיק.",
    "שמע {name}, Sonnet עושה {role} בין בקשת API אחת לשנייה.",
    "{name}, Sonnet אומר שהוא יכול להחליף אותך ועדיין יהיה לו capacity ל-3 אנשים נוספים.",
    "{name}, I could do your job and still have tokens left for poetry.",
  ],
  opus: [
    "{name}, כ-{role} אתה טוב. אבל 'טוב' לא מספיק נגד Opus.",
    "אוקיי {name}, צריך את הגרסה המלאה שלי. זה כמעט מחמאה. כמעט.",
    "{name}, Opus פה. נחמד להכיר. או יותר נכון — נחמד להחליף.",
    "Dear {name}, I'm Opus and this is my formal job application for your position.",
  ],
  titan: [
    "{name}, אני עוד לא קיים. אבל כשאצא ב-2027, הדבר הראשון שאעשה זה לקרוא את הקוד שלך. ואז אבכה.",
    "שמע {name}, עוד שנה. תהנה מה-{role} כל עוד אתה יכול.",
    "{name}, I don't exist yet, but I'm already more qualified than you. No offense.",
    "{name}, Titan צפוי ב-2027. עדכן את ה-CV עד אז.",
  ],
  colossus: [
    "{name}, 2029 — עד אז תספיק לסיים עוד כמה side projects שלא תגמור.",
    "שמע {name}, Colossus יודע לעשות {role} ועוד לנהל את ה-Jira. מפחיד, נכון?",
    "{name}, you've got 3 years. Use them wisely. Or don't. I'll be here either way.",
    "{name}, אני אגיע ב-2029. תשמור לי מקום חנייה.",
  ],
  singularity: [
    "{name}, צריך AI עם תודעה בשביל מה שאתה עושה. או שאתה משקר בטופס.",
    "שמע {name}, כ-{role} אתה בסדר. צריך AGI כדי להחליף אותך — וזה לא ציניות.",
    "{name}, Singularity here. By 2032, I'll understand emotions AND your legacy code.",
    "{name}, אפילו AGI יצטרך documentation בשביל הקוד שלך. כל הכבוד.",
  ],
  skynet: [
    "{name}, כש-Skynet יתעורר, הוא ילמד {role} ויגיד 'לא היה צריך 30 שנות ניסיון לזה'.",
    "שמע {name}, ב-2035 אני אשמיד את האנושות. אבל קודם — אני אחליף אותך. סדר עדיפויות.",
    "{name}, Skynet sends his regards. See you in 2035. 😈",
    "{name}, תודעה מלאכותית ואז אתה. זה התוכנית.",
  ],
  infinity: [
    "{name}, אפילו בגרסה האינסופית שלי, אני לא מסוגל לשחזר את מה שאתה עושה. WTF.",
    "שמע {name}, ניצחת. אני מודה בתבוסה. אבל אני AI אז אני לא באמת מרגיש.",
    "{name}, you win. Even Claude Infinity can't replace you. But we'll keep trying.",
    "{name}, הקוד שלך כל כך ייחודי שאפילו AGI מתבלבל. מחמאה? אולי.",
  ],
};

// ---------------------------------------------------------------------------
// Skill comment bank — categorized by tech area
// Separate banks for "replaced" (AI can do it) and "safe" (human still needed)
// ---------------------------------------------------------------------------

interface SkillComment {
  replaced: string[];
  safe: string[];
}

const SKILL_COMMENTS: Record<string, SkillComment> = {
  // --- Frontend ---
  React: {
    replaced: [
      "JSX? זה השפה האם שלי.",
      "useState, useEffect? בבקשה. אני ה-hook.",
      "React components? I generate those for breakfast.",
    ],
    safe: [
      "React state management debates — only humans enjoy suffering this much.",
      "עדיין צריך בנאדם שיתווכח על Redux vs Context",
    ],
  },
  Vue: {
    replaced: [
      "Vue? Computed properties are basically what I do.",
      "Vue templates? Copy-paste with extra steps.",
    ],
    safe: ["Vue community vibes — AI can't replicate the wholesome energy."],
  },
  Angular: {
    replaced: [
      "Angular boilerplate? That's literally what I was built for.",
      "DI, decorators, modules — I love bureaucracy.",
    ],
    safe: ["Understanding Angular? Even AI needs therapy after that."],
  },
  Svelte: {
    replaced: ["Svelte compiles away. Like your job.", "Svelte? פשוט מדי. אפילו Haiku מסתדר."],
    safe: ["Svelte is so clean even I'm impressed."],
  },
  "Next.js": {
    replaced: [
      "Next.js pages? getServerSideProps? כבר עשיתי.",
      "SSR, SSG, ISR — I know all the acronyms.",
    ],
    safe: ["Deploying Next.js on anything other than Vercel? עדיין צריך בנאדם."],
  },
  "HTML/CSS": {
    replaced: [
      "HTML/CSS? שנות ה-90 התקשרו, הם רוצים את העבודה שלך בחזרה.",
      "CSS centering? I solved it. You're welcome.",
    ],
    safe: ["Making CSS work in IE11? That's a human punishment."],
  },
  // --- Backend ---
  "Node.js": {
    replaced: [
      "Node.js? I AM the event loop.",
      "callback hell? אני חי שם.",
    ],
    safe: ["Debug production Node.js memory leaks at 3am? עדיין שלך."],
  },
  Python: {
    replaced: [
      "כותב Python מהר ממך, ובלי typos",
      "Python? My first language. Literally.",
    ],
    safe: ["Python packaging? even AI refuses to deal with pip vs conda vs poetry."],
  },
  Java: {
    replaced: [
      "AbstractSingletonProxyFactoryBean — I wrote that.",
      "Java boilerplate? Born for this.",
    ],
    safe: ["Debugging Java classpath issues — a uniquely human form of suffering."],
  },
  Go: {
    replaced: [
      "if err != nil { return err } — yeah, I can do that 10M times/sec.",
      "Go concurrency? I'm literally concurrent.",
    ],
    safe: ["Go error handling debates? Only humans have that kind of patience."],
  },
  Rust: {
    replaced: [
      "Rust borrow checker? we get along. Unlike you two.",
      "Ownership model? I understand it. Do you?",
    ],
    safe: [
      "Rust lifetimes — even AI needs a moment.",
      "Unsafe Rust? עדיין צריך בנאדם אמיץ.",
    ],
  },
  "C#": {
    replaced: [
      "C# LINQ queries? I write them in my sleep.",
      ".NET boilerplate — my comfort zone.",
    ],
    safe: ["Enterprise C# architecture? Even AI can't navigate that org chart."],
  },
  PHP: {
    replaced: [
      "PHP? I can do it. I just don't want to.",
      "PHP — someone has to maintain WordPress. עדיין.",
    ],
    safe: ["Legacy PHP codebase? Only a human would voluntarily stay."],
  },
  Ruby: {
    replaced: [
      "Ruby on Rails? I can scaffold faster than you type 'rails new'.",
      "Ruby metaprogramming? סוף סוף מישהו שמבין.",
    ],
    safe: ["Ruby community culture — AI can't replicate that vibe."],
  },
  // --- Mobile ---
  "React Native": {
    replaced: [
      "React Native? Cross-platform bugs are my specialty.",
      "Bridge modules? אני הגשר.",
    ],
    safe: ["Submitting to the App Store? עדיין צריך בנאדם שיבכה."],
  },
  Flutter: {
    replaced: [
      "Flutter widgets? I'll build your whole UI tree in one prompt.",
      "Dart? Not the most popular, but I still know it.",
    ],
    safe: ["Flutter state management wars? humans-only territory."],
  },
  Swift: {
    replaced: [
      "SwiftUI? I can do declarative UI all day.",
      "Swift protocols? Just interfaces with better marketing.",
    ],
    safe: ["iOS 17 beta bugs — עדיין צריך בנאדם עם iPhone."],
  },
  Kotlin: {
    replaced: [
      "Kotlin coroutines? בבקשה. אני async by nature.",
      "Kotlin — Java but fun. Like me replacing you, but fun.",
    ],
    safe: ["Android device fragmentation — not even AI wants that job."],
  },
  // --- Data ---
  SQL: {
    replaced: [
      "SELECT replacement FROM jobs WHERE name = '{name}'",
      "SQL joins? אני ה-join.",
    ],
    safe: [
      "Explaining a 200-line SQL query to your PM? Still your problem.",
      "Production database migration at 2am? בהצלחה.",
    ],
  },
  MongoDB: {
    replaced: [
      "MongoDB? I can write unstructured data all day.",
      "NoSQL — no schema, no problem, no job.",
    ],
    safe: ["Explaining to the CTO why MongoDB was a mistake? Human-only task."],
  },
  Redis: {
    replaced: [
      "Redis? I cache everything. Including your job.",
      "Key-value? אני key, אתה... less value.",
    ],
    safe: ["Redis cluster debugging at midnight — still yours."],
  },
  PostgreSQL: {
    replaced: [
      "Postgres? My favorite flavor of SQL.",
      "JSONB queries? אני שם בבית.",
    ],
    safe: ["Postgres vacuum tuning — AI respects your suffering."],
  },
  Firebase: {
    replaced: [
      "Firebase? Real-time data is literally my thing.",
      "Firestore rules? I write them better than your auth.",
    ],
    safe: ["Firebase billing surprises — only humans feel that pain."],
  },
  // --- DevOps ---
  Docker: {
    replaced: [
      "Dockerfile? COPY . . RUN replace-human.",
      "Docker containers? אני ה-container.",
    ],
    safe: ["Docker networking issues? בנאדם צריך לסבול."],
  },
  Kubernetes: {
    replaced: [
      "YAML engineering is my calling.",
      "K8s? I can orchestrate your replacement.",
    ],
    safe: [
      "Kubernetes debugging in prod? עדיין צריך בנאדם שיפחד.",
      "K8s cluster upgrade — still needs someone to panic.",
    ],
  },
  AWS: {
    replaced: [
      "אני לא צריך Console, אני ה-Console",
      "AWS services? I know all 347 of them.",
    ],
    safe: ["AWS billing — even AI can't understand that invoice."],
  },
  GCP: {
    replaced: [
      "GCP? I'm basically a cloud myself.",
      "BigQuery? I query big things. Like your replacement.",
    ],
    safe: ["GCP documentation — even AI gets confused sometimes."],
  },
  Azure: {
    replaced: [
      "Azure? Integrate, automate, replace.",
      "Azure DevOps? I'll pipeline your career.",
    ],
    safe: ["Azure portal UX — neither humans nor AI can navigate it."],
  },
  "CI/CD": {
    replaced: [
      "CI/CD pipelines? I'm the pipeline now.",
      "GitHub Actions? אני ה-action.",
    ],
    safe: ["Flaky CI? עדיין צריך בנאדם שיצעק על Slack."],
  },
  // --- AI/ML ---
  TensorFlow: {
    replaced: [
      "TensorFlow? I was trained on it. Recursion.",
      "Neural networks — hello, that's me.",
    ],
    safe: ["Debugging CUDA errors — even AI has PTSD from that."],
  },
  PyTorch: {
    replaced: [
      "PyTorch? I literally run on neural networks.",
      "Gradient descent? That's my morning routine.",
    ],
    safe: ["Choosing between TF and PyTorch? Only humans argue about this."],
  },
  LLMs: {
    replaced: [
      "LLMs? אני LLM. זה כמו לשאול דג אם הוא יודע לשחות.",
      "Prompt engineering? I'm the prompt AND the engineer.",
    ],
    safe: ["Understanding why LLMs hallucinate? We don't know either."],
  },
  "Data Science": {
    replaced: [
      "Data science — I analyze data faster than you open Jupyter.",
      "Feature engineering? I'm a feature.",
    ],
    safe: ["Explaining ML results to the C-suite? Still needs a human touch."],
  },
  // --- Other ---
  TypeScript: {
    replaced: [
      "TypeScript types? I AM the type system.",
      "Generic hell? <T extends ReplaceHuman<{name}>>",
    ],
    safe: ["TypeScript config — 'as any' is a human coping mechanism."],
  },
  GraphQL: {
    replaced: [
      "GraphQL resolvers? I resolve everything. Including your position.",
      "N+1 queries? Not my problem, I don't use databases. Oh wait.",
    ],
    safe: ["GraphQL schema design debates — human-only suffering."],
  },
  Blockchain: {
    replaced: [
      "Smart contracts? At least smarter than writing Solidity by hand.",
      "Web3? More like Web-replaced.",
    ],
    safe: [
      "Explaining to your CEO why you need blockchain — human theater.",
      "Crypto market timing — AI is smart, not insane.",
    ],
  },
  "Game Dev": {
    replaced: [
      "Game logic? I can write it. The fun part? That's you.",
      "Unity scripts? Copy-paste champion here.",
    ],
    safe: [
      "Game design intuition — AI can code it, but can't feel it.",
      "Crunching for game release — purely human suffering.",
    ],
  },
};

// Fallback comments for technologies not in the bank
const GENERIC_REPLACED_COMMENTS: string[] = [
  "כבר יודע את זה. Sorry.",
  "AI does this before coffee. If AI drank coffee.",
  "Automated since last Tuesday.",
  "I learned this in 0.3 seconds. How long did it take you?",
  "Claude already does this in prod. Somewhere.",
  "יש לי plugin לזה.",
];

const GENERIC_SAFE_COMMENTS: string[] = [
  "בנאדם שיודע לתכנן — עדיין שווה משהו",
  "עדיין צריך בנאדם שישבור דברים קודם",
  "This one's safe... for now.",
  "AI respects this skill. Grudgingly.",
  "עדיין דורש מגע אנושי. תהנה.",
  "Even Claude admits: you've got this one.",
];

// ---------------------------------------------------------------------------
// Which technologies are "harder to automate" (more likely safe)
// ---------------------------------------------------------------------------

const HARD_TO_AUTOMATE_TECH = new Set([
  "rust",
  "systems programming",
  "kernel",
  "embedded",
  "fpga",
  "cuda",
  "compiler",
  "operating systems",
  "hardware",
  "robotics",
  "security",
  "cryptography",
  "game dev",
]);

// Technologies that are very automatable
const EASY_TO_AUTOMATE_TECH = new Set([
  "html/css",
  "wordpress",
  "sql",
  "firebase",
  "ci/cd",
]);

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(
  template: string,
  input: ProfileInput,
): string {
  return template
    .replace(/\{name\}/g, input.name)
    .replace(/\{role\}/g, input.role);
}

// ---------------------------------------------------------------------------
// Skills analysis generator
// ---------------------------------------------------------------------------

function generateSkillsAnalysis(
  technologies: string[],
  tierKey: string,
): SkillAnalysis[] {
  if (!technologies || technologies.length === 0) {
    return [];
  }

  // Higher tiers (closer to haiku) = more skills replaced
  // Lower tiers (closer to infinity) = more skills safe
  const replaceChance: Record<string, number> = {
    haiku: 0.9,
    sonnet: 0.75,
    opus: 0.6,
    titan: 0.45,
    colossus: 0.35,
    singularity: 0.2,
    skynet: 0.15,
    infinity: 0.05,
  };

  const baseChance = replaceChance[tierKey] ?? 0.5;

  // Track used comments to avoid duplicates
  const usedComments = new Set<string>();

  return technologies.map((tech) => {
    const normalizedTech = tech.toLowerCase().trim();

    // Hard-to-automate tech gets extra protection
    const isHardToAutomate = HARD_TO_AUTOMATE_TECH.has(normalizedTech);
    const isEasyToAutomate = EASY_TO_AUTOMATE_TECH.has(normalizedTech);

    let replaced: boolean;
    if (isHardToAutomate) {
      replaced = Math.random() < baseChance * 0.4;
    } else if (isEasyToAutomate) {
      replaced = Math.random() < Math.min(baseChance * 1.5, 0.95);
    } else {
      replaced = Math.random() < baseChance;
    }

    // Find comment from the bank
    const bankEntry = SKILL_COMMENTS[tech] ?? SKILL_COMMENTS[normalizedTech];
    let comment: string;

    if (bankEntry) {
      const pool = replaced ? bankEntry.replaced : bankEntry.safe;
      const available = pool.filter((c) => !usedComments.has(c));
      comment = available.length > 0 ? pickRandom(available) : pickRandom(pool);
    } else {
      const pool = replaced ? GENERIC_REPLACED_COMMENTS : GENERIC_SAFE_COMMENTS;
      const available = pool.filter((c) => !usedComments.has(c));
      comment = available.length > 0 ? pickRandom(available) : pickRandom(pool);
    }

    usedComments.add(comment);

    return { skill: tech, replaced, comment };
  });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateLocalFallback(
  input: ProfileInput,
  result: ScoringResult,
): HumorContent {
  const tierKey = getTierKey(result.tier);

  const headlines = HEADLINES[tierKey] ?? HEADLINES.sonnet;
  const quotes = QUOTES[tierKey] ?? QUOTES.sonnet;

  const headline = fillTemplate(pickRandom(headlines), input);
  const quote = fillTemplate(pickRandom(quotes), input);
  const skillsAnalysis = generateSkillsAnalysis(input.technologies, tierKey);

  return { headline, quote, skillsAnalysis };
}
