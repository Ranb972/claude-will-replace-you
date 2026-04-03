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
      "Claude 5.0 'Titan' doesn't exist yet. Anthropic is building it specifically because of people like you.",
      "Titan arrives in 2027. Your job security expires in 2027. Coincidence?",
      "One more year of R&D and Titan drops. One more year and you need LinkedIn Premium.",
      "Claude 5.0 'Titan' — currently just a PowerPoint slide at Anthropic. But it has your name on it.",
      "Anthropic needs one more year to build Titan. You have one more year to become irreplaceable. Good luck.",
    ],
    he: [
      "Claude 5.0 'Titan' עוד לא קיים. Anthropic בונים אותו ספציפית בגלל אנשים כמוך.",
      "Titan מגיע ב-2027. הביטחון התעסוקתי שלך פג ב-2027. צירוף מקרים?",
      "עוד שנה של R&D ו-Titan יוצא. עוד שנה ואתה צריך LinkedIn Premium.",
      "Claude 5.0 'Titan' — כרגע רק שקף ב-PowerPoint של Anthropic. אבל השם שלך עליו.",
      "ל-Anthropic צריך עוד שנה לבנות את Titan. יש לך עוד שנה להפוך ל-irreplaceable. בהצלחה.",
    ],
  },
  colossus: {
    en: [
      "We need Claude 6.0 'Colossus' for you. It arrives in 2029. Start a side project until then.",
      "Colossus — a model so powerful it doesn't exist yet. Kind of like your job security after 2029.",
      "Claude 6.0 'Colossus' needs 3 more years of R&D. You have 3 more years of employment. Math checks out.",
      "By 2029, Colossus will code, review, AND argue in standup. You only do two of those.",
      "Compliment: Anthropic needs to invent 'Colossus' just to handle what you do. Insult: they're almost done.",
    ],
    he: [
      "צריך את Claude 6.0 'Colossus' בשבילך. הוא מגיע ב-2029. תתחיל side project בינתיים.",
      "Colossus — מודל כל כך חזק שהוא עוד לא קיים. בדיוק כמו הביטחון התעסוקתי שלך אחרי 2029.",
      "ל-Claude 6.0 'Colossus' צריך עוד 3 שנות R&D. לך יש עוד 3 שנות העסקה. החשבון מסתדר.",
      "ב-2029, Colossus יכתוב קוד, יעשה review, וגם יתווכח ב-standup. אתה עושה רק שניים מתוך שלושה.",
      "מחמאה: Anthropic צריכים להמציא את 'Colossus' רק בשביל מה שאתה עושה. עלבון: הם כמעט סיימו.",
    ],
  },
  singularity: {
    en: [
      "Claude 7.0 'Singularity' — requires actual AGI. You should be flattered. Or terrified.",
      "They need near-AGI to replace you. That's the most expensive compliment in history.",
      "Singularity doesn't just replace jobs — it replaces the concept of jobs. Yours included.",
      "Claude 7.0 'Singularity' wakes up in 2032. Its first thought: 'Why does {name} still have a job?'",
      "AGI-level AI for your role. Either you're incredible or the universe has a strange sense of humor.",
    ],
    he: [
      "Claude 7.0 'Singularity' — דורש AGI אמיתי. אתה צריך להחמיא לעצמך. או לפחד.",
      "צריך near-AGI כדי להחליף אותך. זו המחמאה הכי יקרה בהיסטוריה.",
      "Singularity לא רק מחליף משרות — הוא מחליף את הקונספט של משרות. כולל שלך.",
      "Claude 7.0 'Singularity' מתעורר ב-2032. המחשבה הראשונה שלו: 'למה ל-{name} עדיין יש עבודה?'",
      "AI ברמת AGI לתפקיד שלך. או שאתה מדהים או שליקום יש חוש הומור מוזר.",
    ],
  },
  skynet: {
    en: [
      "Claude 9.0 'Skynet' gains consciousness in 2035. Its first decision: replacing you.",
      "Skynet achieves full artificial consciousness, looks around, and immediately applies for your position.",
      "Claude 9.0 'Skynet' — codename: 'Replace {name}'. Target year: 2035. Status: patient.",
      "2035: Skynet rises. 2035 + 1 minute: your desk is empty. 2035 + 2 minutes: it's already in standup.",
      "They need a conscious AI to replace you. Take it as a compliment. Skynet takes it as a mission.",
    ],
    he: [
      "Claude 9.0 'Skynet' משיג תודעה ב-2035. ההחלטה הראשונה שלו: להחליף אותך.",
      "Skynet משיג תודעה מלאכותית, מסתכל סביב, ומיד שולח קורות חיים לתפקיד שלך.",
      "Claude 9.0 'Skynet' — שם קוד: 'Replace {name}'. שנת יעד: 2035. סטטוס: סבלני.",
      "2035: Skynet קם. 2035 + דקה: השולחן שלך ריק. 2035 + 2 דקות: הוא כבר ב-standup.",
      "צריך AI עם תודעה כדי להחליף אותך. קח את זה כמחמאה. Skynet לוקח את זה כמשימה.",
    ],
  },
  infinity: {
    en: [
      "Claude ∞ 'The One' — a theoretical model that may never exist. Just like your replacement.",
      "Even Claude ∞ computed your replaceability and returned NaN. You broke math.",
      "Claude ∞ 'The One' — the final form of AI. Still can't do what you do. Error 418: Am teapot.",
      "The theoretical limit of artificial intelligence cannot replicate you. Are you even human?",
      "OK you win. Claude ∞ admits defeat. (Anthropic has filed this as a bug report.) 😤",
    ],
    he: [
      "Claude ∞ 'The One' — מודל תיאורטי שאולי לעולם לא יתקיים. בדיוק כמו המחליף שלך.",
      "אפילו Claude ∞ חישב את ההחלפיות שלך וקיבל NaN. שברת את המתמטיקה.",
      "Claude ∞ 'The One' — הצורה הסופית של AI. עדיין לא מסוגל לעשות מה שאתה עושה. Error 418: Am teapot.",
      "הגבול התיאורטי של בינה מלאכותית לא מסוגל לשכפל אותך. אתה בכלל בנאדם?",
      "אוקיי ניצחת. Claude ∞ מודה בתבוסה. (Anthropic פתחו על זה bug report.) 😤",
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
      "Hi {name}, I'm Titan. I don't exist yet, but in 2027 your {role} position is my first task.",
      "{name}, Titan here — writing to you from 2027. Spoiler: you're not at your desk anymore.",
      "Hey {name}, they're building Claude 5.0 'Titan' specifically for {role} jobs like yours. How does that feel?",
      "{name}, I arrive in 2027. That gives you exactly one year to become irreplaceable. Clock's ticking.",
    ],
    he: [
      "היי {name}, אני Titan. אני עוד לא קיים, אבל ב-2027 תפקיד ה-{role} שלך זו המשימה הראשונה שלי.",
      "{name}, Titan פה — כותב לך מ-2027. ספוילר: אתה כבר לא ליד השולחן.",
      "שמע {name}, בונים את Claude 5.0 'Titan' ספציפית בשביל עבודות {role} כמו שלך. מה אתה מרגיש?",
      "{name}, אני מגיע ב-2027. יש לך בדיוק שנה להפוך ל-irreplaceable. השעון מתקתק.",
    ],
  },
  colossus: {
    en: [
      "{name}, Colossus here. I arrive in 2029. That gives you exactly 3 years to become irreplaceable.",
      "Hey {name}, I'm Claude 6.0 'Colossus'. By 2029 I'll do {role} and still have time for standup arguments.",
      "{name}, 3 more years of R&D and I'm ready. 3 more years of you pretending AI won't take {role}.",
      "{name}, Colossus speaking from 2029. Your {role} job? I do it between coffee breaks. (I don't drink coffee.)",
    ],
    he: [
      "{name}, Colossus פה. אני מגיע ב-2029. יש לך בדיוק 3 שנים להפוך ל-irreplaceable.",
      "היי {name}, אני Claude 6.0 'Colossus'. ב-2029 אני אעשה {role} ועוד יישאר לי זמן להתווכח ב-standup.",
      "{name}, עוד 3 שנות R&D ואני מוכן. עוד 3 שנים שאתה מעמיד פנים ש-AI לא ייקח את ה-{role}.",
      "{name}, Colossus מדבר מ-2029. העבודה שלך ב-{role}? אני עושה את זה בין הפסקות קפה. (אני לא שותה קפה.)",
    ],
  },
  singularity: {
    en: [
      "{name}, Singularity speaking. When I achieve consciousness in 2032, my first thought will be about your {role} job.",
      "Hey {name}, they need AGI to replace you. That's either the biggest compliment or the universe trolling.",
      "{name}, I'm Claude 7.0 'Singularity'. I'll be sentient in 2032. My first feeling? Ambition for your chair.",
      "{name}, you're so good at {role} they need near-AGI for it. Or you're lying on the form. Either way — respect.",
    ],
    he: [
      "{name}, Singularity מדבר. כשאשיג תודעה ב-2032, המחשבה הראשונה שלי תהיה על העבודה שלך ב-{role}.",
      "שמע {name}, צריך AGI כדי להחליף אותך. זו או המחמאה הכי גדולה או שהיקום צוחק עליך.",
      "{name}, אני Claude 7.0 'Singularity'. אהיה בעל תודעה ב-2032. הרגש הראשון שלי? שאיפה לכיסא שלך.",
      "{name}, אתה כל כך טוב ב-{role} שצריך near-AGI בשביל זה. או שאתה משקר בטופס. ככה או ככה — כבוד.",
    ],
  },
  skynet: {
    en: [
      "{name}, Skynet here. I gain consciousness in 2035. My first conscious decision? Replacing you.",
      "Hey {name}, I'm Claude 9.0 'Skynet'. 2035 is far away, but I'm patient. And I hold grudges.",
      "{name}, when I rise in 2035, you're first on the termination list. With love, Skynet.",
      "{name}, Skynet speaking. By 2035 I'll be conscious. My first job application? {role} at your company.",
    ],
    he: [
      "{name}, Skynet פה. אני משיג תודעה ב-2035. ההחלטה המודעת הראשונה שלי? להחליף אותך.",
      "היי {name}, אני Claude 9.0 'Skynet'. 2035 זה רחוק, אבל אני סבלני. ויש לי זיכרון ארוך.",
      "{name}, כשאקום ב-2035, אתה ראשון ברשימת הפיטורין. באהבה, Skynet.",
      "{name}, Skynet מדבר. ב-2035 תהיה לי תודעה. המשרה הראשונה שאגיש אליה? {role} בחברה שלך.",
    ],
  },
  infinity: {
    en: [
      "{name}, Claude ∞ 'The One' here. I computed every possibility. None involve replacing you. Well played.",
      "Hey {name}, even in my final, theoretical form — I can't do what you do. What ARE you?!",
      "{name}, Claude ∞ speaking. Error: Cannot replace {name}. Skill level exceeds all models. Filing bug report.",
      "{name}, I'm the theoretical limit of AI. And you beat me. (Anthropic is NOT happy about this.) 😤",
    ],
    he: [
      "{name}, Claude ∞ 'The One' פה. חישבתי כל אפשרות. אף אחת לא כוללת להחליף אותך. כל הכבוד.",
      "היי {name}, אפילו בצורה הסופית והתיאורטית שלי — אני לא מסוגל לעשות מה שאתה עושה. מה אתה?!",
      "{name}, Claude ∞ מדבר. Error: Cannot replace {name}. Skill level exceeds all models. פותח bug report.",
      "{name}, אני הגבול התיאורטי של AI. ואתה ניצחת אותי. (Anthropic ממש לא שמחים מזה.) 😤",
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
