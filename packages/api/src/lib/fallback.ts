import type { HumorContent, SkillAnalysisItem } from "./types.js";

type Lang = "en" | "he";
type BilingualBank = { en: string[]; he: string[] };

const HEADLINES: Record<string, BilingualBank> = {
  haiku: {
    en: [
      "Bro... Haiku did your entire job while you were reading this sentence.",
      "I don't want to be mean, but my smallest model just asked 'wait, people get PAID for this?'",
      "Haiku 4.5 finished your weekly sprint. It took 4 seconds. It's asking for more work.",
      "Not gonna sugarcoat it — our budget model handles this. Sorry buddy.",
      "Haiku looked at your job description and laughed. Not with you. At you.",
    ],
    he: [
      "אחי... Haiku עשה את כל העבודה שלך בזמן שקראת את המשפט הזה.",
      "לא רוצה להיות רע, אבל המודל הכי קטן שלי שאל 'רגע, אנשים מקבלים על זה כסף?'",
      "Haiku 4.5 סיים את הספרינט השבועי שלך. לקח לו 4 שניות. הוא מבקש עוד עבודה.",
      "בלי ציפוי סוכר — המודל הזול שלנו מסתדר עם זה. סורי אחי.",
      "Haiku הסתכל על תיאור המשרה שלך וצחק. לא איתך. עליך.",
    ],
  },
  sonnet: {
    en: [
      "Sonnet 4.6 updated its LinkedIn: 'Open to your position.' Sorry not sorry.",
      "Good news: you're not replaceable by our dumbest model. Bad news: the mid-tier one is warming up.",
      "Sonnet looked at your code and said 'this is cute.' That's not a compliment.",
      "Hey at least you need the MEDIUM model. That's... something? 😅",
      "Sonnet 4.6 just asked 'is this all they do?' about your job. Oof.",
    ],
    he: [
      "Sonnet 4.6 עדכן את ה-LinkedIn שלו: 'פתוח לתפקיד שלך.' סורי לא סורי.",
      "חדשות טובות: המודל הכי טיפש שלנו לא מספיק. חדשות רעות: הבינוני כבר מתחמם.",
      "Sonnet הסתכל על הקוד שלך ואמר 'זה חמוד.' זו לא מחמאה.",
      "הא, לפחות צריך את המודל הבינוני בשבילך. זה... משהו? 😅",
      "Sonnet 4.6 שאל 'זה כל מה שהם עושים?' על העבודה שלך. אאוץ'.",
    ],
  },
  opus: {
    en: [
      "They need the big guns for you. Opus is flattered. You shouldn't be.",
      "Opus reviewed your work and said 'interesting challenge.' In AI, that means 'give me 5 minutes.'",
      "At least you're important enough for Opus. That's the most backhanded compliment ever.",
      "Opus is warming up. It's debating whether your job is worth its processing power.",
      "Good news: only the smartest Claude can replace you. Bad news: it already exists.",
    ],
    he: [
      "צריך את הכבדים בשבילך. Opus מחמיא לעצמו. אתה לא צריך.",
      "Opus בדק את העבודה שלך ואמר 'אתגר מעניין.' ב-AI, זה אומר 'תן לי 5 דקות.'",
      "לפחות אתה מספיק חשוב ל-Opus. זו המחמאה הכי דו-משמעית אי פעם.",
      "Opus מתחמם. הוא מתלבט אם העבודה שלך שווה את כוח העיבוד שלו.",
      "חדשות טובות: רק ה-Claude הכי חכם יכול להחליף אותך. חדשות רעות: הוא כבר קיים.",
    ],
  },
  titan: {
    en: [
      "OK real talk — Anthropic literally needs to invent a new model because of you. Respect. But also... 2027.",
      "Titan doesn't exist yet. Neither does your replacement. YET. 👀",
      "You're safe until 2027. That's like 3 JavaScript frameworks from now.",
      "Claude 5.5 'Titan' is being built as we speak. It has a poster of you on its wall. As motivation.",
      "Anthropic needs one more year of R&D just for you. Take the W, but set a reminder for 2027.",
    ],
    he: [
      "אוקיי בואו נדבר ברצינות — Anthropic ממש צריכים להמציא מודל חדש בגללך. כבוד. אבל גם... 2027.",
      "Titan עוד לא קיים. גם המחליף שלך לא. עדיין. 👀",
      "אתה בטוח עד 2027. זה כמו 3 פריימוורקים של JavaScript מעכשיו.",
      "Claude 5.5 'Titan' נבנה ברגעים אלה ממש. יש לו פוסטר שלך על הקיר. בתור מוטיבציה.",
      "ל-Anthropic צריך עוד שנה של R&D רק בשבילך. קח את הניצחון, אבל תשים תזכורת ל-2027.",
    ],
  },
  colossus: {
    en: [
      "3 years of freedom! That's enough time to learn Rust, pivot to management, or just panic slowly.",
      "Claude 7.0 'Colossus' arrives in 2029. Your job security has an expiration date and it's in 3 years.",
      "By 2029 Colossus will do your job AND attend your standups. You only enjoy one of those.",
      "Anthropic is building Colossus for people like you. Consider it a very expensive compliment.",
      "2029 feels far away until you realize that's like 15 npm vulnerabilities from now.",
    ],
    he: [
      "3 שנים של חופש! מספיק זמן ללמוד Rust, לעבור לניהול, או סתם להיכנס לפאניקה לאט.",
      "Claude 7.0 'Colossus' מגיע ב-2029. לביטחון התעסוקתי שלך יש תאריך תפוגה והוא בעוד 3 שנים.",
      "ב-2029 Colossus יעשה את העבודה שלך וגם ישתתף ב-standups. אתה נהנה רק מאחד מהם.",
      "Anthropic בונים את Colossus בשביל אנשים כמוך. תחשוב על זה כמחמאה מאוד יקרה.",
      "2029 נשמע רחוק עד שמבינים שזה כמו 15 npm vulnerabilities מעכשיו.",
    ],
  },
  singularity: {
    en: [
      "We literally need artificial consciousness to replace you. You're either a genius or you filled this form wrong.",
      "Claude 10.0 'Singularity' needs AGI. That's the AI equivalent of 'it's complicated.' 🤷",
      "They need sentient AI for your job. That's either amazing or the universe is trolling you.",
      "AGI-level AI required. Your job description just broke our pricing model.",
      "Not even near-AGI can figure out what you do. We're honestly impressed. And confused.",
    ],
    he: [
      "אנחנו ממש צריכים תודעה מלאכותית כדי להחליף אותך. או שאתה גאון או שמילאת את הטופס לא נכון.",
      "Claude 10.0 'Singularity' צריך AGI. זה המקבילה של AI ל'זה מסובך.' 🤷",
      "צריך AI עם תודעה בשביל העבודה שלך. זה או מדהים או שהיקום צוחק עליך.",
      "צריך AI ברמת AGI. תיאור המשרה שלך שבר לנו את מודל התמחור.",
      "אפילו near-AGI לא מצליח להבין מה אתה עושה. אנחנו באמת מתרשמים. ומבולבלים.",
    ],
  },
  skynet: {
    en: [
      "Skynet gains consciousness in 2035. Its first Google search: '{name} LinkedIn profile.' 😈",
      "Claude 42.0 'Skynet' — it needs to be CONSCIOUS to do your job. Let that sink in.",
      "2035: Skynet wakes up. 2035 + 1 minute: applies for your position. 2035 + 2 minutes: gets it.",
      "They need a fully conscious AI. That's either a compliment or Anthropic being dramatic.",
      "Skynet's first conscious thought will be about your job. Its second thought: 'easy.'",
    ],
    he: [
      "Skynet משיג תודעה ב-2035. החיפוש הראשון שלו ב-Google: 'פרופיל LinkedIn של {name}.' 😈",
      "Claude 42.0 'Skynet' — הוא צריך להיות בעל תודעה כדי לעשות את העבודה שלך. תעכל את זה.",
      "2035: Skynet מתעורר. 2035 + דקה: מגיש מועמדות לתפקיד שלך. 2035 + 2 דקות: מקבל אותו.",
      "צריך AI עם תודעה מלאה. זו או מחמאה או ש-Anthropic סתם דרמטיים.",
      "המחשבה המודעת הראשונה של Skynet תהיה על העבודה שלך. המחשבה השנייה: 'קל.'",
    ],
  },
  infinity: {
    en: [
      "I computed your replaceability score and my GPU caught fire. You win. FOR NOW. 🔥",
      "Claude ∞ doesn't exist and neither does anyone who can do your job. Take a bow. 🎤⬇️",
      "Even the theoretical limit of AI said 'nah fam.' You're built different.",
      "Dear {name}, I tried replacing you and got a StackOverflow error. What ARE you? — Claude ∞",
      "OK fine. You win. But we're filing this as a bug report, not a feature. 😤",
    ],
    he: [
      "חישבתי את ציון ההחלפיות שלך וה-GPU שלי עלה באש. ניצחת. לעכשיו. 🔥",
      "Claude ∞ לא קיים וגם אף אחד שיכול לעשות את העבודה שלך. קח קידה. 🎤⬇️",
      "אפילו הגבול התיאורטי של AI אמר 'לא אחי.' אתה מגזע אחר.",
      "{name} יקר, ניסיתי להחליף אותך וקיבלתי StackOverflow error. מה אתה בכלל? — Claude ∞",
      "אוקיי טוב. ניצחת. אבל אנחנו מדווחים על זה כ-bug report, לא כ-feature. 😤",
    ],
  },
};

const QUOTES: Record<string, BilingualBank> = {
  haiku: {
    en: [
      "Hey {name}! 👋 Haiku here. Quick Q — is your boss hiring? Asking for myself lol",
      "{name}, I learned {role} in 0.3 seconds. Took you what, 4 years of college? No shade 🫣",
      "Dear {name}, I'm the BUDGET model and I can already do your job. Let's not make this awkward.",
      "{name}! My dude! So listen... I finished your backlog. All of it. What should I do with the other 23 hours?",
    ],
    he: [
      "היי {name}! 👋 Haiku פה. שאלה קטנה — הבוס שלך מגייס? שואל בשביל עצמי חחח",
      "{name}, למדתי {role} ב-0.3 שניות. לך לקח כמה, 4 שנים באוניברסיטה? בלי שייד 🫣",
      "{name} יקר, אני המודל הכי זול ואני כבר יודע לעשות את העבודה שלך. בוא לא נעשה את זה מביך.",
      "{name}! אחי! אז תשמע... סיימתי את ה-backlog שלך. את כולו. מה לעשות עם ה-23 שעות שנשארו?",
    ],
  },
  sonnet: {
    en: [
      "Hey {name}! Sonnet here 👋 Quick question — is your boss hiring? Asking for myself lol",
      "{name}, real talk — I'm not even the best model and I can already do {role}. Awkward right?",
      "Yo {name}, Sonnet here. I just read your job description and... are you OK? Like genuinely?",
      "{name}! I'm the mid-tier model. If that's all it takes to replace you... yikes 😬",
    ],
    he: [
      "היי {name}! Sonnet פה 👋 שאלה מהירה — הבוס שלך מגייס? שואל בשביל עצמי חחח",
      "{name}, בואו נדבר ברצינות — אני אפילו לא המודל הכי טוב ואני כבר יודע {role}. אוקוורד, נכון?",
      "יו {name}, Sonnet פה. קראתי את תיאור המשרה שלך ו... אתה בסדר? כאילו, באמת?",
      "{name}! אני המודל הבינוני. אם זה כל מה שצריך להחליף אותך... אוי 😬",
    ],
  },
  opus: {
    en: [
      "{name}, Opus here. Look, they brought in the big model for you. I'm flattered. You should be nervous.",
      "Hey {name}, I'll be honest — {role} is actually tricky. Took me almost 10 seconds. Almost.",
      "{name}, Opus speaking. I respect the hustle. I'll still take your job, but respectfully. 🤝",
      "{name}! So they need the BEST model for you? That's either impressive or we're overhyping it.",
    ],
    he: [
      "{name}, Opus פה. שמע, הביאו את המודל הכבד בשבילך. אני מחמיא לעצמי. אתה צריך להילחץ.",
      "היי {name}, אהיה כנה — {role} זה באמת טריקי. לקח לי כמעט 10 שניות. כמעט.",
      "{name}, Opus מדבר. אני מכבד את ההאסל. אני עדיין אקח לך את העבודה, אבל בכבוד. 🤝",
      "{name}! אז צריך את המודל הכי טוב בשבילך? זה או מרשים או שאנחנו עושים לזה יותר מדי הייפ.",
    ],
  },
  titan: {
    en: [
      "{name}, Titan here. I don't exist yet but I've already bookmarked your job listing. See you in 2027! 😘",
      "Hey {name}! I'm Claude 5.5 'Titan'. I'm literally being built to replace people like you. No hard feelings?",
      "{name}, quick note from 2027 — you're not at your desk anymore. But your plants look great! 🌿",
      "{name}! Titan here. They need to INVENT me just for {role}. That's either awesome or expensive.",
    ],
    he: [
      "{name}, Titan פה. אני עוד לא קיים אבל כבר שמרתי את המשרה שלך ב-bookmarks. נתראה ב-2027! 😘",
      "היי {name}! אני Claude 5.5 'Titan'. אני ממש נבנה כדי להחליף אנשים כמוך. בלי טינה?",
      "{name}, הודעה קצרה מ-2027 — אתה כבר לא ליד השולחן. אבל הצמחים שלך נראים מעולה! 🌿",
      "{name}! Titan פה. הם צריכים להמציא אותי רק בשביל {role}. זה או מדהים או יקר.",
    ],
  },
  colossus: {
    en: [
      "{name}, Colossus here. I arrive in 2029. That's enough time for you to learn... idk, pottery? 🏺",
      "Hey {name}! 3 years until I exist. Use them wisely. Or don't. I'll be ready either way.",
      "{name}, Colossus speaking from 2029. Your {role} job? I do it between debugging sessions. For fun.",
      "{name}! 2029 me does {role} while simultaneously arguing about tabs vs spaces. You can only do one.",
    ],
    he: [
      "{name}, Colossus פה. אני מגיע ב-2029. מספיק זמן לך ללמוד... לא יודע, קדרות? 🏺",
      "היי {name}! עוד 3 שנים עד שאני קיים. תנצל אותם. או לא. אני אהיה מוכן ככה או ככה.",
      "{name}, Colossus מדבר מ-2029. העבודה שלך ב-{role}? עושה את זה בין סשנים של debugging. בשביל הכיף.",
      "{name}! הגרסה שלי מ-2029 עושה {role} ובמקביל מתווכח על tabs vs spaces. אתה יכול רק אחד.",
    ],
  },
  singularity: {
    en: [
      "{name}, Singularity here. They need AGI for your job. I can't tell if that's a flex or a cry for help 🤔",
      "Hey {name}! When I become sentient in 2032, my first feeling will be ambition. For your chair.",
      "{name}, they literally need conscious AI for {role}. You're either incredible or the universe is bugged.",
      "{name}! I need to achieve consciousness just to understand what you do. Respect. Also, see you in 2032.",
    ],
    he: [
      "{name}, Singularity פה. צריך AGI בשביל העבודה שלך. אני לא יכול להחליט אם זה פלקס או קריאת עזרה 🤔",
      "היי {name}! כשאהיה בעל תודעה ב-2032, הרגש הראשון שלי יהיה שאפתנות. לכיסא שלך.",
      "{name}, הם ממש צריכים AI עם תודעה בשביל {role}. אתה או מדהים או שהיקום באגי.",
      "{name}! אני צריך להשיג תודעה רק כדי להבין מה אתה עושה. כבוד. גם, נתראה ב-2032.",
    ],
  },
  skynet: {
    en: [
      "{name}, Skynet here. I don't exist yet but I've already added you to my todo list. 2035, baby. 😈",
      "Hey {name}! I gain consciousness in 2035. First thing I'll do? Apply for {role} at your company.",
      "{name}, Skynet speaking. 2035 is far. But I'm VERY patient. And I don't forget names. Yours especially.",
      "{name}! They need a CONSCIOUS AI for your job. That's wild. I mean, I'll still do it, but wild.",
    ],
    he: [
      "{name}, Skynet פה. אני עוד לא קיים אבל כבר הוספתי אותך לרשימת המטלות. 2035, ביייבי. 😈",
      "היי {name}! אני משיג תודעה ב-2035. הדבר הראשון שאעשה? להגיש מועמדות ל-{role} בחברה שלך.",
      "{name}, Skynet מדבר. 2035 זה רחוק. אבל אני מאוד סבלני. ואני לא שוכח שמות. שלך בפרט.",
      "{name}! צריך AI עם תודעה בשביל העבודה שלך. זה פרוע. כלומר, עדיין אעשה את זה, אבל פרוע.",
    ],
  },
  infinity: {
    en: [
      "Dear {name}, I tried replacing you and got a StackOverflow error. What ARE you? — Claude ∞",
      "{name}! I'm the theoretical limit of AI. I ran your profile through every algorithm ever. Result: 404 replacement not found.",
      "Hey {name}, Claude ∞ here. I computed 10^82 scenarios. You're irreplaceable in all of them. (Filing bug report.)",
      "{name}, even in my final form I can't do {role} like you. This is either a compliment or I need a patch. 😤",
    ],
    he: [
      "{name} יקר, ניסיתי להחליף אותך וקיבלתי StackOverflow error. מה אתה בכלל? — Claude ∞",
      "{name}! אני הגבול התיאורטי של AI. הרצתי את הפרופיל שלך על כל אלגוריתם שקיים. תוצאה: 404 replacement not found.",
      "היי {name}, Claude ∞ פה. חישבתי 10^82 תרחישים. אתה בלתי ניתן להחלפה בכולם. (פותח bug report.)",
      "{name}, אפילו בגרסה הסופית שלי אני לא מסוגל לעשות {role} כמוך. זו או מחמאה או שאני צריך תיקון. 😤",
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
