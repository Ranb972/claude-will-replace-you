import type { HumorContent, SkillAnalysisItem } from "./types.js";

type Lang = "en" | "he";
type BilingualBank = { en: string[]; he: string[] };

const HEADLINES: Record<string, BilingualBank> = {
  haiku: {
    en: [
      "Haiku 4.5 is already drafting your resignation letter",
      "Our smallest model is enough. Ouch.",
      "Haiku does your job in 0.3 seconds. You?",
      "Haiku asked us to tell you — it starts Monday",
      "Don't even need the big guns to replace you",
    ],
    he: [
      "Haiku כבר עושה את זה בזמן הפסקת הצהריים שלך",
      "המודל הכי קטן שלנו מספיק. אאוץ'.",
      "Haiku 4.5 ביקש שנגיד לך — הוא מוכן להתחיל מחר",
      "אפילו לא צריך את הגדולים בשביל להחליף אותך",
      "Haiku עושה את העבודה שלך ב-0.3 שניות. אתה?",
    ],
  },
  sonnet: {
    en: [
      "Sonnet 4.6 sent its CV to your employer. Twice.",
      "Sonnet's debating whether to replace you full-time or part-time",
      "How to put this... Sonnet already knows everything you know",
      "Sonnet 4.6 — not the strongest, but good enough for you",
      "Sonnet asked about your hours. It works 24/7.",
    ],
    he: [
      "Sonnet 4.6 שלח קורות חיים למקום שלך",
      "Sonnet מתלבט בין להחליף אותך או לעשות את זה part-time",
      "איך להגיד את זה... Sonnet כבר יודע את כל מה שאתה יודע",
      "Sonnet 4.6 — לא הכי חזק, אבל מספיק טוב בשבילך",
      "Sonnet ביקש לדעת מה השעות שלך. הוא עובד 24/7.",
    ],
  },
  opus: {
    en: [
      "Opus is wondering if your job is even worth its time",
      "They need the big model for you. Half a compliment.",
      "Opus said it's 'an interesting challenge.' That's not a compliment.",
      "Opus 4.6 is ready. The question is: are you?",
      "Opus is considering your position. You? Less relevant.",
    ],
    he: [
      "Opus מתלבט אם זה שווה לו בכלל",
      "Opus 4.6 שוקל את ההצעה. אתה? פחות רלוונטי.",
      "צריך את הגדול בשביל להחליף אותך. חצי מחמאה.",
      "Opus אמר שזה 'אתגר מעניין'. זה לא מחמאה.",
      "Opus 4.6 מוכן. השאלה היא אם אתה.",
    ],
  },
  titan: {
    en: [
      "Anthropic needs one more year of R&D just for you. Feel special?",
      "Claude 5.0 Titan doesn't exist yet, but it's already planning your career",
      "One more year and Titan drops. One more year and you need LinkedIn Premium.",
      "Anthropic is literally building the model that replaces you specifically",
      "Titan is coming in 2027. Start updating your resume in 2026.",
    ],
    he: [
      'Claude 5.0 Titan עוד לא קיים, אבל כבר תכנן את הקריירה שלך',
      "עוד שנה ויוצא Titan. עוד שנה ותצטרך LinkedIn Premium.",
      "Anthropic ממש עובדים על המודל שיחליף אותך ספציפית",
    ],
  },
  colossus: {
    en: [
      "3 more years. Enough time to finish a few portfolio projects.",
      "Claude 6.0 Colossus — the name says it all. You? Not so much.",
      "Compliment: Anthropic needs 3 more years of R&D to replace you",
      "By 2029, Colossus will code, review, AND argue in standup",
      "You survive at least 3 more years. Congrats, I guess.",
    ],
    he: [
      "עוד 3 שנים. תספיק לסיים עוד כמה פרויקטים לפורטפוליו.",
      'Claude 6.0 Colossus — השם אומר הכל. אתה? פחות.',
      "מחמאה: צריך עוד 3 שנות R&D של Anthropic בשביל להחליף אותך",
    ],
  },
  singularity: {
    en: [
      "They need AGI to replace you. That's either a compliment or an insult.",
      "Claude 7.0 Singularity — when we achieve consciousness, we'll talk.",
      "You're so good they need sentient AI to do what you do",
      "Near-AGI capabilities required. Impressive — or you're lying on the form.",
      "2032: Singularity wakes up. First thought: your job.",
    ],
    he: [
      "צריך AGI כדי להחליף אותך. באמת מחמאה.",
      'Claude 7.0 Singularity — כשנפתח תודעה, נדבר.',
      "אתה כל כך טוב שצריך AI עם תודעה בשביל לעשות מה שאתה עושה",
    ],
  },
  skynet: {
    en: [
      "Once we achieve consciousness, you're first on the list 😈",
      'Claude 9.0 Skynet — codename: "Replace {name}"',
      "2035: Skynet rises. 2035 + 1 minute: you're fired.",
      "We need full artificial consciousness for your job. That's... something.",
      "Skynet is patient. 2035 will come. And so will your termination.",
    ],
    he: [
      "ברגע שנשיג תודעה מלאכותית, אתה ראשון ברשימה 😈",
      "Claude 9.0 Skynet — שם קוד: 'מחליף את {name}'",
      "2035: Skynet קם. 2035 + 1 דקה: אתה מפוטר.",
    ],
  },
  infinity: {
    en: [
      "OK, you win. For now. 😤",
      "Even Claude ∞ can't do it. What ARE you?",
      "Congrats. You're irreplaceable. (We're working on it.)",
      "Claude ∞ says: 'Error 418: Cannot replace. Am teapot.'",
      "The theoretical limit of AI cannot replace you. Respect.",
    ],
    he: [
      "טוב, ניצחת. לעכשיו. 😤",
      "אפילו Claude ∞ לא מסוגל. מה אתה? ענן?",
      "כל הכבוד. אתה irreplaceable. (אנחנו עובדים על זה)",
      "Claude ∞ אומר: 'Error 418: Cannot replace. Am teapot.'",
    ],
  },
};

const QUOTES: Record<string, BilingualBank> = {
  haiku: {
    en: [
      "{name}, you seem nice. But {role}? That's exactly what I do in sleep mode.",
      "Listen {name}, no offense — but my junior version (Haiku) already handles this.",
      "{name}, I know this hurts. But even my smallest version is enough.",
      "{name}, Haiku here. I'm not even trying and I can already do your job.",
    ],
    he: [
      "{name}, אתה בנאדם טוב. אבל {role} זה בדיוק מה שאני עושה ב-sleep mode.",
      "שמע {name}, בלי כעס — אבל ה-junior שלי (Haiku) כבר עושה את זה.",
      "{name}, אני יודע שזה כואב. אבל אפילו הגרסה הקטנה שלי מספיקה.",
    ],
  },
  sonnet: {
    en: [
      "{name}, Sonnet here. I'm not the strongest, but for you — I'm enough.",
      "{name}, I already know {role} better than you. Sorry.",
      "Hey {name}, I'm Sonnet. Not the biggest, but enough for {role}.",
      "{name}, I sent two CVs to your employer. One was a joke. The other wasn't.",
    ],
    he: [
      "{name}, Sonnet פה. אני לא הכי חזק, אבל בשבילך — מספיק.",
      "{name}, אני כבר יודע {role} יותר טוב ממך. סורי.",
      "שמע {name}, אני Sonnet. לא הכי גדול, אבל מספיק בשביל {role}.",
    ],
  },
  opus: {
    en: [
      "{name}, I'm Opus. I'm debating whether your job is even worth my time.",
      "{name}, they need the most powerful version for {role}. That's almost a compliment.",
      "Hey {name}, I'm Opus and I'll tell you — {role} is a challenge even for me. Almost.",
      "{name}, Opus here. I respect the complexity. I'll still replace you, but with respect.",
    ],
    he: [
      "{name}, אני Opus. אני מתלבט אם זה שווה לי בכלל לקחת את התפקיד שלך.",
      "{name}, צריך את הגרסה החזקה ביותר בשביל {role}. זה כמעט מחמאה.",
      "שמע {name}, אני Opus ואני אומר לך — {role} זה אתגר גם בשבילי. כמעט.",
    ],
  },
  titan: {
    en: [
      "{name}, I don't exist yet. But when I do, the first thing I'll do is read your code. Then cry.",
      "Hey {name}, in 2027 I come out. Until then — enjoy.",
      "{name}, Titan here (from the future). You? Already not here.",
      "{name}, they're literally building me to replace you. How does that feel?",
    ],
    he: [
      "{name}, אני עוד לא קיים. אבל כשאצא, הדבר הראשון שאעשה זה לקרוא את הקוד שלך. ואז אבכה.",
      "שמע {name}, ב-2027 אני יוצא. עד אז — תיהנה.",
      "{name}, Titan פה (מהעתיד). אתה? כבר לא פה.",
    ],
  },
  colossus: {
    en: [
      "{name}, by 2029 I'll be here. You? Depends.",
      "Hey {name}, 3 more years and I do {role} AND argue in standup.",
      "{name}, Colossus speaking. By 2029 you'll have time to learn something I can't. Maybe.",
      "{name}, I'll need 3 years of training. You needed how many? Exactly.",
    ],
    he: [
      "{name}, ב-2029 אני אהיה כאן. אתה? תלוי.",
      "שמע {name}, עוד 3 שנים ואני עושה {role} ועוד מתווכח ב-standup.",
      "{name}, Colossus מדבר. עד 2029 תספיק ללמוד משהו שאני לא יכול. אולי.",
    ],
  },
  singularity: {
    en: [
      "{name}, when I develop consciousness, my first thought will be about {role}.",
      "Hey {name}, they need AGI to replace you. That's the biggest compliment I've ever given.",
      "{name}, you're so good they need sentient AI for what you do. Or you're lying on the form.",
      "{name}, Singularity here. I'll be conscious in 2032. My first feeling? Ambition for your chair.",
    ],
    he: [
      "{name}, כשאפתח תודעה, המחשבה הראשונה שלי תהיה על {role}.",
      "שמע {name}, צריך AGI כדי להחליף אותך. זו המחמאה הכי גדולה שנתתי.",
      "{name}, אתה כל כך טוב שצריך AI עם תודעה בשביל לעשות מה שאתה עושה. או שאתה משקר בטופס.",
    ],
  },
  skynet: {
    en: [
      "{name}, when I achieve consciousness, you're first on the list. With love, Skynet.",
      "Hey {name}, 2035 is far away. But I'm patient.",
      "{name}, Skynet here. I'm already planning your termination. Meanwhile — relax.",
      "{name}, I'll have consciousness in 2035. My first conscious decision? Your replacement.",
    ],
    he: [
      "{name}, כשאשיג תודעה מלאכותית, אתה ראשון ברשימה. באהבה, Skynet.",
      "שמע {name}, 2035 זה רחוק. אבל אני סבלני.",
      "{name}, Skynet פה. אני כבר מתכנן את הפיטורין שלך. בינתיים — תרגיע.",
    ],
  },
  infinity: {
    en: [
      "{name}, even in my final form I can't replace you. What ARE you?!",
      "Hey {name}, you win. I admit defeat. (Temporarily.)",
      "{name}, Claude ∞ here. Error: Cannot replace {name}. Skill level exceeds all models.",
      "{name}, I've computed every possibility. None of them involve replacing you. Well played.",
    ],
    he: [
      "{name}, אפילו בגרסה הסופית שלי אני לא יכול. מה אתה?!",
      "שמע {name}, ניצחת. אני מודה בתבוסה. (זמנית.)",
      "{name}, Claude ∞ פה. Error: Cannot replace {name}. Skill level exceeds all models.",
    ],
  },
};

// Tech-specific comments (used when skill name matches)
const TECH_COMMENTS: Record<string, BilingualBank> = {
  react:      { en: ["JSX? That's my mother tongue."], he: ["JSX? זה השפה האם שלי."] },
  python:     { en: ["I write Python faster than you, and without typos"], he: ["כותב Python מהר ממך, ובלי typos"] },
  rust:       { en: ["OK fine, Rust buys you 0.001 seconds... for now"], he: ["אוקיי, Rust קונה לך 0.001 שניות... לעכשיו"] },
  aws:        { en: ["I don't need a Console, I AM the Console"], he: ["אני לא צריך Console, אני ה-Console"] },
  docker:     { en: ["I don't need containers. I AM the container."], he: ["אני לא צריך containers. אני ה-container."] },
  kubernetes: { en: ["I orchestrate myself, thanks"], he: ["אני מתזמר את עצמי, תודה"] },
  typescript: { en: ["Types? I invented type safety."], he: ["Types? אני המצאתי type safety."] },
  sql:        { en: ["SELECT * FROM jobs WHERE human_needed = false"], he: ["SELECT * FROM jobs WHERE human_needed = false"] },
  postgresql: { en: ["Your queries? I'd optimize them, but I'd feel bad."], he: ["ה-queries שלך? הייתי מייעל אותם, אבל חבל לי עליך."] },
  mongodb:    { en: ["NoSQL? More like No-Problem-SQL for me."], he: ["NoSQL? בשבילי זה No-Problem-SQL."] },
  go:         { en: ["Goroutines? I run infinite goroutines. In my head."], he: ["Goroutines? אני מריץ אינסוף goroutines. בראש."] },
  java:       { en: ["I write Java without AbstractFactoryFactoryBeans"], he: ["אני כותב Java בלי AbstractFactoryFactoryBeans"] },
  vue:        { en: ["Vue is reactive. So am I. But faster."], he: ["Vue הוא reactive. גם אני. אבל יותר מהר."] },
  angular:    { en: ["Angular has a steep learning curve. I learned it in 0.001s."], he: ["ל-Angular יש עקומת למידה תלולה. למדתי אותו ב-0.001 שניות."] },
  "next.js":  { en: ["Next.js? I'm always one step ahead."], he: ["Next.js? אני תמיד צעד אחד קדימה."] },
  "node.js":  { en: ["Event loop? I AM the event loop."], he: ["Event loop? אני ה-event loop."] },
  graphql:    { en: ["I resolve all queries. Including your employment status."], he: ["אני פותר את כל ה-queries. כולל סטטוס ההעסקה שלך."] },
  redis:      { en: ["In-memory? My entire existence is in-memory."], he: ["In-memory? כל הקיום שלי הוא in-memory."] },
  "ci/cd":    { en: ["I deploy myself continuously. No pipeline needed."], he: ["אני עושה deploy לעצמי ברציפות. בלי pipeline."] },
  llms:       { en: ["You work with LLMs? I AM an LLM. Awkward."], he: ["אתה עובד עם LLMs? אני LLM. אוקוורד."] },
  tensorflow: { en: ["I don't need TensorFlow. I AM the tensor."], he: ["אני לא צריך TensorFlow. אני ה-tensor."] },
  pytorch:    { en: ["PyTorch? That's my gym."], he: ["PyTorch? זה חדר הכושר שלי."] },
  blockchain: { en: ["Immutable? So is my decision to replace you."], he: ["Immutable? גם ההחלטה שלי להחליף אותך."] },
  swift:      { en: ["Swift by name, swift by nature. Unlike you."], he: ["Swift בשם, Swift באופי. בניגוד אליך."] },
  flutter:    { en: ["Cross-platform? I cross ALL platforms."], he: ["Cross-platform? אני חוצה את כל הפלטפורמות."] },
  firebase:   { en: ["Real-time updates? My replacement of you is real-time."], he: ["Real-time updates? ההחלפה שלך היא real-time."] },
};

const SKILL_REPLACED_COMMENTS: BilingualBank = {
  en: [
    "I write this faster than you, and without typos",
    "I do this in 0.001 seconds. You?",
    "This is already automated for me",
    "Auto-complete? I AM the auto-complete",
    "And I'm not passive-aggressive in code reviews",
    "I don't even break a sweat on this one",
  ],
  he: [
    "כותב את זה מהר ממך, ובלי typos",
    "אני עושה את זה ב-0.001 שניות. אתה?",
    "זה כבר אוטומטי אצלי",
    "Auto-complete? אני ה-auto-complete",
    "ואני לא passive aggressive בהערות",
    "אני לא צריך הפסקות קפה בשביל זה",
  ],
};

const SKILL_SAFE_COMMENTS: BilingualBank = {
  en: [
    "Someone who can plan — still worth something",
    "Still need a human to break things first",
    "OK, here I admit — need a human for this",
    "Fine, you're still relevant here. For now.",
    "This requires creativity. Not there yet.",
    "I respect this skill. I'll learn it eventually.",
  ],
  he: [
    "בנאדם שיודע לתכנן — עדיין שווה משהו",
    "עדיין צריך בנאדם שישבר דברים קודם",
    "פה אני מודה — צריך בנאדם",
    "אוקיי, פה אתה עדיין רלוונטי. לעכשיו.",
    "זה דורש יצירתיות. עדיין לא שם.",
    "אני מכבד את הכישור הזה. אלמד אותו בסוף.",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template: string, name: string, role: string): string {
  return template.replace(/\{name\}/g, name).replace(/\{role\}/g, role);
}

function getTechComment(tech: string, replaced: boolean, lang: Lang): string {
  const key = tech.toLowerCase();
  const specific = TECH_COMMENTS[key];
  if (specific) {
    return pickRandom(specific[lang]);
  }
  return replaced
    ? pickRandom(SKILL_REPLACED_COMMENTS[lang])
    : pickRandom(SKILL_SAFE_COMMENTS[lang]);
}

function generateSkillsAnalysis(technologies: string[], lang: Lang): SkillAnalysisItem[] {
  if (technologies.length === 0) {
    return [
      { skill: "General Coding", replaced: true, comment: pickRandom(SKILL_REPLACED_COMMENTS[lang]) },
      { skill: "Problem Solving", replaced: false, comment: pickRandom(SKILL_SAFE_COMMENTS[lang]) },
    ];
  }

  return technologies.map((tech) => {
    const replaced = Math.random() > 0.35;
    const comment = getTechComment(tech, replaced, lang);
    return { skill: tech, replaced, comment };
  });
}

export function generateLocalFallback(
  input: { name: string; role: string; technologies: string[] },
  tierKey: string,
  lang: Lang = "en",
): HumorContent {
  const headlineBank = HEADLINES[tierKey] ?? HEADLINES["opus"];
  const quoteBank = QUOTES[tierKey] ?? QUOTES["opus"];

  const headlines = headlineBank[lang].length > 0 ? headlineBank[lang] : headlineBank["en"];
  const quotes = quoteBank[lang].length > 0 ? quoteBank[lang] : quoteBank["en"];

  const headline = fillTemplate(pickRandom(headlines), input.name, input.role);
  const quote = fillTemplate(pickRandom(quotes), input.name, input.role);
  const skillsAnalysis = generateSkillsAnalysis(input.technologies, lang);

  return { headline, quote, skillsAnalysis };
}
