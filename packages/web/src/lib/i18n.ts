import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import React from "react";

export type Lang = "en" | "he";

const STORAGE_KEY = "cwru-lang";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // HomePage
    "hero.badge": "🤖 AI HR DEPARTMENT — OFFICIAL NOTICE",
    "hero.title1": "Which Claude Model",
    "hero.title2": "Will Replace You?",
    "hero.subtitle": "Enter your profile and find out how many days you have left",
    "hero.cta": "Find Out The Truth",
    "hero.ticker.in": "in",
    "hero.ticker.days": "d",
    // Form section
    "form.stamp": "📋 CLASSIFIED — PERSONNEL FILE",
    "form.heading": "Your Profile",
    "form.description": "Tell us about yourself and we'll calculate your replacement odds",
    // InputForm
    "input.name.label": "Name / Nickname *",
    "input.name.placeholder": "e.g. Ran",
    "input.role.label": "Job Title *",
    "input.role.placeholder": "e.g. Full Stack Developer",
    "input.experience.label": "Years of Experience:",
    "input.experience.comment": "( each year worth less )",
    "input.experience.junior": "Junior 🌱",
    "input.experience.mid": "Mid-level 💪",
    "input.experience.senior": "Senior 🎯",
    "input.experience.veteran": "Veteran 👑",
    "input.experience.legend": "Legend 🏆",
    "input.description.label": "What do you do? *",
    "input.description.comment": "( Claude reads every word )",
    "input.description.placeholder": "e.g. Building web apps, designing APIs, managing a team of 5...",
    "input.tech.label": "Technologies",
    "input.github.label": "GitHub URL",
    "input.github.optional": "(optional)",
    "input.github.comment": "( +5 protection. if the code's good. )",
    "input.submit": "📋 Submit for AI Review",
    "input.submitting": "Analyzing...",
    "input.error.required": "Required",
    "input.error.name.max": "Max 50 characters",
    "input.error.role.max": "Max 100 characters",
    "input.error.desc.min": "Tell us more! (20 chars minimum)",
    "input.error.desc.max": "Max 500 characters",
    "input.error.github": "Must be a valid GitHub URL",
    // LoadingScreen
    "loading.init": "INITIALIZING SCAN",
    "loading.starting": "Starting scan...",
    "loading.title": "THREAT ASSESSMENT IN PROGRESS",
    "loading.level": "THREAT LEVEL",
    "loading.msg.0": "Scanning your resume... 😬",
    "loading.msg.1": "Comparing you to Claude Opus... hmm...",
    "loading.msg.2": "Calculating days until termination... ⏳",
    "loading.msg.3": "Claude's asking if you have stock options...",
    "loading.msg.4": "Checking if your code passes lint... (spoiler: no)",
    "loading.msg.5": "Scanning your GitHub... wait, is that intentional?",
    "loading.msg.6": "Consulting with Skynet...",
    "loading.msg.7": "Claude is sending out resumes...",
    "loading.msg.8": "Checking if you write tests... 👀",
    "loading.msg.9": "Searching for your added value... still searching...",
    // ResultPage
    "result.assigned": "🤖 AI REPLACEMENT ASSIGNED",
    "result.expected": "Expected",
    "result.risk": "REPLACEMENT RISK ASSESSMENT",
    "result.explain": "What does this mean?",
    "result.explain.0": "Relatively safe. Claude needs a few more years of R&D",
    "result.explain.1": "Gray zone. Depends on the day.",
    "result.explain.2": "High risk. Claude is closing in.",
    "result.explain.3": "Almost there. Update your LinkedIn.",
    "result.days.title": "DAYS UNTIL TERMINATION",
    "result.days.safe": "You're safe. For now.",
    "result.days.packing": "Better start packing...",
    "result.days.month": "You've got about a month. Use it wisely.",
    "result.days.runway": "Still some runway left.",
    "result.days.year": "A year-ish. Not bad!",
    "result.days.time": "You've got time. Probably.",
    "result.days.retire": "You might actually retire before this happens.",
    "result.skills.title": "SKILLS CLEARANCE STATUS",
    "result.skills.replaced": "🤖 Claude already knows",
    "result.skills.safe": "🛡️ Still safe",
    "result.skills.more": "Show {n} more skills ▼",
    "result.skills.less": "Show less ▲",
    "result.share.title": "Share Your Verdict",
    "result.share.subtitle": "Let the world know who's replacing you",
    "result.cert": "📜 Download Termination Certificate",
    "result.leaderboard": "🏆 Leaderboard",
    "result.tryagain": "🔄 Try Again",
    "result.loading": "Loading results...",
    "result.notfound": "Not found 🔍 Maybe the link is wrong?",
    // ReplacementMeter
    "meter.low": "LOW THREAT",
    "meter.moderate": "MODERATE",
    "meter.elevated": "ELEVATED",
    "meter.high": "HIGH THREAT",
    "meter.critical": "CRITICAL",
    // Leaderboard
    "lb.back": "← Back to home",
    "lb.badge": "🤖 TERMINATION QUEUE",
    "lb.title": "Termination Queue 🔥",
    "lb.count": "{n} developers already found out the truth",
    "lb.empty.title": "No results yet — be the first!",
    "lb.tab.highest": "🔥 Most Replaced",
    "lb.tab.lowest": "🛡️ Most Safe",
    "lb.tab.recent": "🕐 Recent",
    "lb.th.rank": "#",
    "lb.th.name": "Name",
    "lb.th.role": "Role",
    "lb.th.score": "Score",
    "lb.th.model": "Replaced By",
    "lb.th.days": "Days",
    "lb.more": "Load more",
    "lb.loading": "Loading...",
    "lb.showing": "Showing {a} of {b}",
    "lb.empty.cta": "Check yourself and be the first",
    "lb.retry": "Try again",
    "lb.days.dead": "Already 💀",
    "lb.days.days": "{n} days",
    "lb.days.months": "{n} months",
    "lb.days.years": "{n} years",
    "lb.days.inf": "♾️",
  },
  he: {
    "hero.badge": "🤖 מחלקת משאבי AI — הודעה רשמית",
    "hero.title1": "איזה מודל של Claude",
    "hero.title2": "יחליף אותך?",
    "hero.subtitle": "הכנס את הפרופיל שלך וגלה כמה ימים נשארו לך",
    "hero.cta": "גלה את האמת",
    "hero.ticker.in": "בעוד",
    "hero.ticker.days": "י׳",
    "form.stamp": "📋 מסווג — תיק אישי",
    "form.heading": "הפרופיל שלך",
    "form.description": "ספר לנו על עצמך ונחשב את סיכוי ההחלפה שלך",
    "input.name.label": "שם / כינוי *",
    "input.name.placeholder": "למשל: רן",
    "input.role.label": "תפקיד *",
    "input.role.placeholder": "למשל: Full Stack Developer",
    "input.experience.label": ":שנות ניסיון",
    "input.experience.comment": "( כל שנה שווה פחות )",
    "input.experience.junior": "ג'וניור 🌱",
    "input.experience.mid": "מידלוול 💪",
    "input.experience.senior": "סיניור 🎯",
    "input.experience.veteran": "ותיק 👑",
    "input.experience.legend": "לג'נדה 🏆",
    "input.description.label": "מה אתה עושה? *",
    "input.description.comment": "( Claude קורא כל מילה )",
    "input.description.placeholder": "למשל: בונה אפליקציות ווב, מתכנן APIs, מנהל צוות של 5...",
    "input.tech.label": "טכנולוגיות",
    "input.github.label": "GitHub URL",
    "input.github.optional": "(אופציונלי)",
    "input.github.comment": "( +5 הגנה. אם הקוד טוב. )",
    "input.submit": "📋 שלח לבדיקת AI",
    "input.submitting": "...מנתח",
    "input.error.required": "שדה חובה",
    "input.error.name.max": "עד 50 תווים",
    "input.error.role.max": "עד 100 תווים",
    "input.error.desc.min": "ספר עוד! (מינימום 20 תווים)",
    "input.error.desc.max": "עד 500 תווים",
    "input.error.github": "חייב להיות כתובת GitHub תקינה",
    "loading.init": "מאתחל סריקה",
    "loading.starting": "...מתחיל סריקה",
    "loading.title": "הערכת איום בתהליך",
    "loading.level": "רמת איום",
    "loading.msg.0": "סורק את קורות החיים שלך... 😬",
    "loading.msg.1": "משווה אותך ל-Claude Opus... הממ...",
    "loading.msg.2": "מחשב ימים עד פיטורין... ⏳",
    "loading.msg.3": "Claude שואל אם יש לך מגש עמדות...",
    "loading.msg.4": "בודק אם הקוד שלך עובר lint... (ספויילר: לא)",
    "loading.msg.5": "סורק את הגיטהאב שלך... רגע, זה intentional?",
    "loading.msg.6": "מתייעץ עם Skynet...",
    "loading.msg.7": "Claude מוציא קורות חיים...",
    "loading.msg.8": "בודק אם אתה כותב tests... 👀",
    "loading.msg.9": "מחפש את הערך המוסף שלך... עדיין מחפש...",
    "result.assigned": "🤖 שובץ מחליף AI",
    "result.expected": "צפוי ב",
    "result.risk": "הערכת סיכון החלפה",
    "result.explain": "מה זה אומר?",
    "result.explain.0": "בטוח יחסית. Claude צריך עוד כמה שנות פיתוח",
    "result.explain.1": "אזור האפור. תלוי ביום.",
    "result.explain.2": "סיכון גבוה. Claude כבר מתקרב.",
    "result.explain.3": "כמעט שם. עדכן את הלינקדאין.",
    "result.days.title": "ימים עד פיטורין",
    "result.days.safe": "אתה בטוח. לעכשיו.",
    "result.days.packing": "עדיף להתחיל לארוז...",
    "result.days.month": "יש לך בערך חודש. תנצל אותו.",
    "result.days.runway": "עוד יש קצת זמן.",
    "result.days.year": "בערך שנה. לא רע!",
    "result.days.time": "יש לך זמן. כנראה.",
    "result.days.retire": "אולי תספיק לצאת לפנסיה לפני שזה יקרה.",
    "result.skills.title": "סטטוס כישורים",
    "result.skills.replaced": "🤖 Claude כבר יודע",
    "result.skills.safe": "🛡️ עדיין בטוח",
    "result.skills.more": "הצג עוד {n} כישורות ▼",
    "result.skills.less": "הצג פחות ▲",
    "result.share.title": "שתף את גזר הדין שלך",
    "result.share.subtitle": "תן לעולם לדעת מי יחליף אותך",
    "result.cert": "📜 הורד תעודת פיטורין",
    "result.leaderboard": "🏆 לידרבורד",
    "result.tryagain": "🔄 נסה שוב",
    "result.loading": "...טוען תוצאות",
    "result.notfound": "לא נמצא 🔍 אולי הקישור שגוי?",
    "meter.low": "איום נמוך",
    "meter.moderate": "בינוני",
    "meter.elevated": "מוגבר",
    "meter.high": "איום גבוה",
    "meter.critical": "קריטי",
    "lb.back": "← חזרה לדף הבית",
    "lb.badge": "🤖 תור לפיטורין",
    "lb.title": "תור לפיטורין 🔥",
    "lb.count": "{n} מפתחים כבר גילו את האמת",
    "lb.empty.title": "עדיין אין תוצאות — תהיה הראשון!",
    "lb.tab.highest": "🔥 הכי מוחלפים",
    "lb.tab.lowest": "🛡️ הכי בטוחים",
    "lb.tab.recent": "🕐 אחרונים",
    "lb.th.rank": "#",
    "lb.th.name": "שם",
    "lb.th.role": "תפקיד",
    "lb.th.score": "ציון",
    "lb.th.model": "מחליף",
    "lb.th.days": "ימים",
    "lb.more": "טען עוד",
    "lb.loading": "...טוען",
    "lb.showing": "מציג {a} מתוך {b}",
    "lb.empty.cta": "תבדוק את עצמך ותהיה הראשון",
    "lb.retry": "נסה שוב",
    "lb.days.dead": "כבר 💀",
    "lb.days.days": "{n} ימים",
    "lb.days.months": "{n} חודשים",
    "lb.days.years": "{n} שנים",
    "lb.days.inf": "♾️",
  },
};

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem(STORAGE_KEY) as Lang) || "en";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = translations[lang][key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [lang],
  );

  const dir = lang === "he" ? "rtl" as const : "ltr" as const;

  return React.createElement(LangContext.Provider, { value: { lang, setLang, t, dir } }, children);
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
