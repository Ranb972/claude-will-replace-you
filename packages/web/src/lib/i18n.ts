import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import React from "react";

export type Lang = "en" | "he";

const STORAGE_KEY = "cwru-lang";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // HomePage
    "hero.badge": "🤖 Claude's Honest Career Assessment",
    "hero.title1": "Which Claude Model",
    "hero.title2": "Will Replace You?",
    "hero.subtitle": "Enter your profile and find out how many days you have left",
    "hero.cta": "Find Out The Truth",
    "hero.ticker.in": "in",
    "hero.ticker.days": "d",
    // Form section
    "form.stamp": "Tell me about yourself (I promise not to steal your job... yet)",
    "form.heading": "Your Profile",
    "form.description": "Be honest. Claude reads every word. No pressure 🫣",
    // InputForm
    "input.name.label": "Name / Nickname *",
    "input.name.placeholder": "e.g. Ran",
    "input.role.label": "Job Title *",
    "input.role.placeholder": "e.g. Full Stack Developer",
    "input.experience.label": "Years of Experience:",
    "input.experience.comment": "( every year buys you less time )",
    "input.experience.junior": "Junior 🌱",
    "input.experience.mid": "Mid-level 💪",
    "input.experience.senior": "Senior 🎯",
    "input.experience.veteran": "Veteran 👑",
    "input.experience.legend": "Legend 🏆",
    "input.description.label": "What do you do?",
    "input.description.comment": "( don't lie, I'll know )",
    "input.description.placeholder": "e.g. Building web apps, designing APIs, managing a team of 5...",
    "input.tech.label": "Technologies",
    "input.tech.placeholder": "Search technologies...",
    "input.github.label": "GitHub URL",
    "input.github.optional": "(optional)",
    "input.github.comment": "( +5 protection. IF the code is good. )",
    "input.submit": "Find out the truth 🫣",
    "input.submitting": "Analyzing...",
    "input.error.required": "Required",
    "input.error.name.max": "Max 50 characters",
    "input.error.role.max": "Max 100 characters",
    "input.error.desc.min": "Tell us more! (20 chars minimum)",
    "input.error.desc.max": "Max 500 characters",
    "input.error.github": "Must be a valid GitHub URL",
    // LoadingScreen
    "loading.init": "Hold tight...",
    "loading.starting": "Here we go...",
    "loading.title": "Checking if you should be worried...",
    "loading.level": "Worry meter",
    "loading.msg.0": "Reading your profile... oh boy 😬",
    "loading.msg.1": "Comparing you to Claude Opus... hmm...",
    "loading.msg.2": "Counting your remaining days... no rush ⏳",
    "loading.msg.3": "Claude's asking if you have stock options...",
    "loading.msg.4": "Checking if your code passes lint... (spoiler: no)",
    "loading.msg.5": "Scanning your GitHub... wait, is that intentional?",
    "loading.msg.6": "Consulting with Skynet...",
    "loading.msg.7": "Claude is polishing its resume...",
    "loading.msg.8": "Checking if you write tests... 👀",
    "loading.msg.9": "Looking for your unique value... still looking...",
    // ResultPage
    "result.assigned": "🤖 Your replacement has been chosen",
    "result.expected": "Expected",
    "result.risk": "How screwed are you?",
    "result.explain": "What does this mean?",
    "result.explain.0": "Chill. Claude needs a few more years of R&D for you.",
    "result.explain.1": "Gray zone. Could go either way.",
    "result.explain.2": "Getting warm. Claude is closing in.",
    "result.explain.3": "Yeah... update your LinkedIn.",
    "result.days.title": "How much time do you have left? ⏰",
    "result.days.safe": "You're safe. For now.",
    "result.days.packing": "Better start packing...",
    "result.days.month": "You've got about a month. Use it wisely.",
    "result.days.runway": "Still some runway left.",
    "result.days.year": "A year-ish. Not bad!",
    "result.days.time": "You've got time. Probably.",
    "result.days.retire": "You might actually retire before this happens.",
    "result.skills.title": "Let's see what you've got...",
    "result.skills.replaced": "🤖 Yeah I can do that",
    "result.skills.safe": "🛡️ OK you got me there",
    "result.skills.more": "Show {n} more skills ▼",
    "result.skills.less": "Show less ▲",
    "result.share.title": "Spread the bad news 😈",
    "result.share.subtitle": "Misery loves company",
    "result.cert": "Download your fate 📜",
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
    "hero.badge": "🤖 ההערכה הכנה של Claude",
    "hero.title1": "איזה מודל של Claude",
    "hero.title2": "יחליף אותך?",
    "hero.subtitle": "הכנס את הפרופיל שלך וגלה כמה ימים נשארו לך",
    "hero.cta": "גלה את האמת",
    "hero.ticker.in": "בעוד",
    "hero.ticker.days": "י׳",
    "form.stamp": "ספר לי על עצמך (מבטיח לא לגנוב לך את העבודה... עדיין)",
    "form.heading": "הפרופיל שלך",
    "form.description": "תהיה כנה. Claude קורא כל מילה. בלי לחץ 🫣",
    "input.name.label": "שם / כינוי *",
    "input.name.placeholder": "למשל: רן",
    "input.role.label": "תפקיד *",
    "input.role.placeholder": "למשל: Full Stack Developer",
    "input.experience.label": ":שנות ניסיון",
    "input.experience.comment": "( כל שנה קונה לך פחות זמן )",
    "input.experience.junior": "Junior 🌱",
    "input.experience.mid": "Mid-level 💪",
    "input.experience.senior": "Senior 🎯",
    "input.experience.veteran": "Veteran 👑",
    "input.experience.legend": "Legend 🏆",
    "input.description.label": "מה אתה עושה?",
    "input.description.comment": "( אל תשקר, אדע )",
    "input.description.placeholder": "למשל: בונה אפליקציות ווב, מתכנן APIs, מנהל צוות של 5...",
    "input.tech.label": "טכנולוגיות",
    "input.tech.placeholder": "חפש טכנולוגיות...",
    "input.github.label": "GitHub URL",
    "input.github.optional": "(אופציונלי)",
    "input.github.comment": "( +5 הגנה. אם הקוד טוב. )",
    "input.submit": "גלה את האמת 🫣",
    "input.submitting": "...מנתח",
    "input.error.required": "שדה חובה",
    "input.error.name.max": "עד 50 תווים",
    "input.error.role.max": "עד 100 תווים",
    "input.error.desc.min": "ספר עוד! (מינימום 20 תווים)",
    "input.error.desc.max": "עד 500 תווים",
    "input.error.github": "חייב להיות כתובת GitHub תקינה",
    "loading.init": "רגע...",
    "loading.starting": "...יאללה",
    "loading.title": "בודק אם יש סיבה לדאגה...",
    "loading.level": "מד דאגה",
    "loading.msg.0": "קורא את הפרופיל שלך... אוי ואבוי 😬",
    "loading.msg.1": "משווה אותך ל-Claude Opus... הממ...",
    "loading.msg.2": "סופר את הימים שנשארו לך... לאט לאט ⏳",
    "loading.msg.3": "Claude שואל אם יש לך מגש עמדות...",
    "loading.msg.4": "בודק אם הקוד שלך עובר lint... (ספויילר: לא)",
    "loading.msg.5": "סורק את ה-GitHub שלך... רגע, זה intentional?",
    "loading.msg.6": "מתייעץ עם Skynet...",
    "loading.msg.7": "Claude מצחצח את קורות החיים שלו...",
    "loading.msg.8": "בודק אם אתה כותב tests... 👀",
    "loading.msg.9": "מחפש את הערך הייחודי שלך... עדיין מחפש...",
    "result.assigned": "🤖 המחליף שלך נבחר",
    "result.expected": "צפוי ב",
    "result.risk": "כמה אתה בצרות?",
    "result.explain": "מה זה אומר?",
    "result.explain.0": "רגוע. Claude צריך עוד כמה שנות R&D בשבילך.",
    "result.explain.1": "אזור אפור. יכול ללכת לכל כיוון.",
    "result.explain.2": "מתחמם. Claude מתקרב.",
    "result.explain.3": "כן... עדכן את הלינקדאין.",
    "result.days.title": "כמה זמן נשאר לך? ⏰",
    "result.days.safe": "אתה בטוח. לעכשיו.",
    "result.days.packing": "עדיף להתחיל לארוז...",
    "result.days.month": "יש לך בערך חודש. תנצל אותו.",
    "result.days.runway": "עוד יש קצת זמן.",
    "result.days.year": "בערך שנה. לא רע!",
    "result.days.time": "יש לך זמן. כנראה.",
    "result.days.retire": "אולי תספיק לצאת לפנסיה לפני שזה יקרה.",
    "result.skills.title": "בוא נראה מה יש לך...",
    "result.skills.replaced": "🤖 כן אני יודע לעשות את זה",
    "result.skills.safe": "🛡️ אוקיי פה ניצחת",
    "result.skills.more": "הצג עוד {n} כישורות ▼",
    "result.skills.less": "הצג פחות ▲",
    "result.share.title": "הפץ את הבשורה הרעה 😈",
    "result.share.subtitle": "לסבול ביחד יותר כיף",
    "result.cert": "הורד את הגורל שלך 📜",
    "result.leaderboard": "🏆 לידרבורד",
    "result.tryagain": "🔄 נסה שוב",
    "result.loading": "...טוען תוצאות",
    "result.notfound": "לא נמצא 🔍 אולי הקישור שגוי?",
    "meter.low": "LOW THREAT",
    "meter.moderate": "MODERATE",
    "meter.elevated": "ELEVATED",
    "meter.high": "HIGH THREAT",
    "meter.critical": "CRITICAL",
    "lb.back": "← חזרה לדף הבית",
    "lb.badge": "🤖 TERMINATION QUEUE",
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
