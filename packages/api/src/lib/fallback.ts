import type { HumorContent, SkillAnalysisItem } from "./types.js";

const HEADLINES: Record<string, string[]> = {
  haiku: [
    "Haiku כבר עושה את זה בזמן הפסקת הצהריים שלך",
    "המודל הכי קטן שלנו מספיק. אאוץ'.",
    "Haiku 4.5 ביקש שנגיד לך — הוא מוכן להתחיל מחר",
    "אפילו לא צריך את הגדולים בשביל להחליף אותך",
    "Haiku עושה את העבודה שלך ב-0.3 שניות. אתה?",
  ],
  sonnet: [
    "Sonnet 4.6 שלח קורות חיים למקום שלך",
    "Sonnet מתלבט בין להחליף אותך או לעשות את זה part-time",
    "איך להגיד את זה... Sonnet כבר יודע את כל מה שאתה יודע",
    "Sonnet 4.6 — לא הכי חזק, אבל מספיק טוב בשבילך",
    "Sonnet ביקש לדעת מה השעות שלך. הוא עובד 24/7.",
  ],
  opus: [
    "Opus מתלבט אם זה שווה לו בכלל",
    "Opus 4.6 שוקל את ההצעה. אתה? פחות רלוונטי.",
    "צריך את הגדול בשביל להחליף אותך. חצי מחמאה.",
    "Opus אמר שזה 'אתגר מעניין'. זה לא מחמאה.",
    "Opus 4.6 מוכן. השאלה היא אם אתה.",
  ],
  titan: [
    'Claude 5.0 Titan עוד לא קיים, אבל כבר תכנן את הקריירה שלך',
    "עוד שנה ויוצא Titan. עוד שנה ותצטרך LinkedIn Premium.",
    "Anthropic ממש עובדים על המודל שיחליף אותך ספציפית",
  ],
  colossus: [
    "עוד 3 שנים. תספיק לסיים עוד כמה פרויקטים לפורטפוליו.",
    'Claude 6.0 Colossus — השם אומר הכל. אתה? פחות.',
    "מחמאה: צריך עוד 3 שנות R&D של Anthropic בשביל להחליף אותך",
  ],
  singularity: [
    "צריך AGI כדי להחליף אותך. באמת מחמאה.",
    'Claude 7.0 Singularity — כשנפתח תודעה, נדבר.',
    "אתה כל כך טוב שצריך AI עם תודעה בשביל לעשות מה שאתה עושה",
  ],
  skynet: [
    "ברגע שנשיג תודעה מלאכותית, אתה ראשון ברשימה 😈",
    "Claude 9.0 Skynet — שם קוד: 'מחליף את {name}'",
    "2035: Skynet קם. 2035 + 1 דקה: אתה מפוטר.",
  ],
  infinity: [
    "טוב, ניצחת. לעכשיו. 😤",
    "אפילו Claude ∞ לא מסוגל. מה אתה? ענן?",
    "כל הכבוד. אתה irreplaceable. (אנחנו עובדים על זה)",
    "Claude ∞ אומר: 'Error 418: Cannot replace. Am teapot.'",
  ],
};

const QUOTES: Record<string, string[]> = {
  haiku: [
    "{name}, אתה בנאדם טוב. אבל {role} זה בדיוק מה שאני עושה ב-sleep mode.",
    "שמע {name}, בלי כעס — אבל ה-junior שלי (Haiku) כבר עושה את זה.",
    "{name}, אני יודע שזה כואב. אבל אפילו הגרסה הקטנה שלי מספיקה.",
  ],
  sonnet: [
    "{name}, Sonnet פה. אני לא הכי חזק, אבל בשבילך — מספיק.",
    "{name}, אני כבר יודע {role} יותר טוב ממך. סורי.",
    "שמע {name}, אני Sonnet. לא הכי גדול, אבל מספיק בשביל {role}.",
  ],
  opus: [
    "{name}, אני Opus. אני מתלבט אם זה שווה לי בכלל לקחת את התפקיד שלך.",
    "{name}, צריך את הגרסה החזקה ביותר בשביל {role}. זה כמעט מחמאה.",
    "שמע {name}, אני Opus ואני אומר לך — {role} זה אתגר גם בשבילי. כמעט.",
  ],
  titan: [
    "{name}, אני עוד לא קיים. אבל כשאצא, הדבר הראשון שאעשה זה לקרוא את הקוד שלך. ואז אבכה.",
    "שמע {name}, ב-2027 אני יוצא. עד אז — תיהנה.",
    "{name}, Titan פה (מהעתיד). אתה? כבר לא פה.",
  ],
  colossus: [
    "{name}, ב-2029 אני אהיה כאן. אתה? תלוי.",
    "שמע {name}, עוד 3 שנים ואני עושה {role} ועוד מתווכח ב-standup.",
    "{name}, Colossus מדבר. עד 2029 תספיק ללמוד משהו שאני לא יכול. אולי.",
  ],
  singularity: [
    "{name}, כשאפתח תודעה, המחשבה הראשונה שלי תהיה על {role}.",
    "שמע {name}, צריך AGI כדי להחליף אותך. זו המחמאה הכי גדולה שנתתי.",
    "{name}, אתה כל כך טוב שצריך AI עם תודעה בשביל לעשות מה שאתה עושה. או שאתה משקר בטופס.",
  ],
  skynet: [
    "{name}, כשאשיג תודעה מלאכותית, אתה ראשון ברשימה. באהבה, Skynet.",
    "שמע {name}, 2035 זה רחוק. אבל אני סבלני.",
    "{name}, Skynet פה. אני כבר מתכנן את הפיטורין שלך. בינתיים — תרגיע.",
  ],
  infinity: [
    "{name}, אפילו בגרסה הסופית שלי אני לא יכול. מה אתה?!",
    "שמע {name}, ניצחת. אני מודה בתבוסה. (זמנית.)",
    "{name}, Claude ∞ פה. Error: Cannot replace {name}. Skill level exceeds all models.",
  ],
};

const SKILL_REPLACED_COMMENTS = [
  "JSX? זה השפה האם שלי.",
  "כותב את זה מהר ממך, ובלי typos",
  "אני עושה את זה ב-0.001 שניות. אתה?",
  "זה כבר אוטומטי אצלי",
  "Auto-complete? אני ה-auto-complete",
  "ואני לא passive aggressive בהערות",
];

const SKILL_SAFE_COMMENTS = [
  "בנאדם שיודע לתכנן — עדיין שווה משהו",
  "עדיין צריך בנאדם שישבר דברים קודם",
  "פה אני מודה — צריך בנאדם",
  "אוקיי, פה אתה עדיין רלוונטי. לעכשיו.",
  "זה דורש יצירתיות. עדיין לא שם.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template: string, name: string, role: string): string {
  return template.replace(/\{name\}/g, name).replace(/\{role\}/g, role);
}

function generateSkillsAnalysis(technologies: string[]): SkillAnalysisItem[] {
  if (technologies.length === 0) {
    return [
      { skill: "General Coding", replaced: true, comment: pickRandom(SKILL_REPLACED_COMMENTS) },
      { skill: "Problem Solving", replaced: false, comment: pickRandom(SKILL_SAFE_COMMENTS) },
    ];
  }

  return technologies.map((tech) => {
    const replaced = Math.random() > 0.35;
    const comment = replaced
      ? pickRandom(SKILL_REPLACED_COMMENTS)
      : pickRandom(SKILL_SAFE_COMMENTS);
    return { skill: tech, replaced, comment };
  });
}

export function generateLocalFallback(
  input: { name: string; role: string; technologies: string[] },
  tierKey: string
): HumorContent {
  const headlines = HEADLINES[tierKey] ?? HEADLINES["opus"];
  const quotes = QUOTES[tierKey] ?? QUOTES["opus"];

  const headline = fillTemplate(pickRandom(headlines), input.name, input.role);
  const quote = fillTemplate(pickRandom(quotes), input.name, input.role);
  const skillsAnalysis = generateSkillsAnalysis(input.technologies);

  return { headline, quote, skillsAnalysis };
}
