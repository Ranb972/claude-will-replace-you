# 🤖 "איזה קלוד יחליף אותך?" — מסמך איפיון v2

## 1. סקירה כללית

### מהות הפרויקט
כלי ווב הומוריסטי שמאפשר למפתחים להזין את הפרופיל המקצועי שלהם ולגלות **איזה מודל של Claude יחליף אותם בעבודה** — כולל אחוז החלפה, countdown ליום ההחלפה, ותעודה רשמית לשיתוף.

### שם הפרויקט
**"Claude Will Replace You"** (CWRU)  
כתובת מוצעת: `claude-will-replace-you.vercel.app`

### קהל יעד
מפתחים, אנשי טק, ומנהלים טכניים — בעיקר אלה שפעילים ב-Twitter/X, LinkedIn, ו-Reddit.

### מנגנון ויראלי
- תעודת החלפה (Replacement Certificate) שאפשר להוריד כתמונה ולשתף
- לידרבורד של "הכי מוחלפים" ו-"הכי בלתי מוחלפים"
- Badge עם אחוז ההחלפה

---

## 2. סולם המודלים (כולל עתידיים בדויים!)

זהו הלב ההומוריסטי של הפרויקט. המודלים האמיתיים והבדויים יוצרים טווח שלם:

| דרגה | מודל | קיים? | טווח ציון | משמעות | דוגמת headline |
|------|-------|--------|-----------|--------|----------------|
| 1 | **Claude Haiku 4.5** | ✅ קיים | 85-100% | הכי מוחלף. אוטומציה בסיסית מספיקה | "Haiku כבר עושה את זה בזמן הפסקת הצהריים שלך" |
| 2 | **Claude Sonnet 4.6** | ✅ קיים | 65-84% | ברוב המקרים — Sonnet מסתדר | "Sonnet שלח קורות חיים למקום שלך" |
| 3 | **Claude Opus 4.6** | ✅ קיים | 45-64% | צריך מודל חזק, אבל קיים | "Opus מתלבט אם זה שווה לו בכלל" |
| 4 | **Claude 5.0 "Titan"** | 🔮 2027 | 30-44% | עוד לא קיים, אבל כשיגיע... | "Anthropic צריכים עוד שנה של R&D בשבילך" |
| 5 | **Claude 6.0 "Colossus"** | 🔮 2029 | 20-29% | צריך דור שלם חדש | "אתה שורד עוד 3 שנים לפחות, כל הכבוד" |
| 6 | **Claude 7.0 "Singularity"** | 🔮 2032 | 10-19% | בגבול ה-AGI | "צריך AGI כדי להחליף אותך. מחמאה." |
| 7 | **Claude 9.0 "Skynet"** | 🔮 2035 | 5-9% | רק עם תודעה מלאכותית | "ברגע שנפתח תודעה, אתה ראשון ברשימה 😈" |
| 8 | **Claude ∞ "The One"** | 🔮 ∞ | 0-4% | בלתי ניתן להחלפה | "טוב, ניצחת. לעכשיו. 😤" |

### לוגיקת הבחירה (אלגוריתמית)
```
score = calculateReplacementScore(input)
// score is 0-100 where 100 = most replaceable

if score >= 85  → Haiku 4.5
if score >= 65  → Sonnet 4.6
if score >= 45  → Opus 4.6
if score >= 30  → Claude 5.0 "Titan"
if score >= 20  → Claude 6.0 "Colossus"
if score >= 10  → Claude 7.0 "Singularity"
if score >= 5   → Claude 9.0 "Skynet"
if score < 5    → Claude ∞ "The One"
```

---

## 3. טכנולוגיות (Stack)

| רכיב | טכנולוגיה | הערה |
|-------|-----------|------|
| Runtime (dev) | **Bun** | package manager + dev server + tests |
| Backend Framework | **Hono** | Edge-ready, קליל, מהיר |
| Frontend | **React 19 + Vite** | SPA, בלי SSR |
| Styling | **Tailwind CSS 4** | + אנימציות מותאמות |
| AI Engine | **Groq API** (Llama 4 Scout / Llama 3.3 70B) | חינמי, מהיר |
| AI Fallback | **אלגוריתם מקומי + בנק תגובות** | כשפוגעים rate limit |
| Database | **Turso (libSQL)** | SQLite on edge, חינמי |
| ORM | **Drizzle ORM** | Type-safe, קליל |
| Image Generation | **@vercel/og** (Satori) | ליצירת תעודות כתמונה |
| Deployment | **Vercel** | Edge Functions + Static |
| Monorepo | **Bun Workspaces** | `packages/api` + `packages/web` |

### Groq Free Tier — מגבלות ואסטרטגיה

| מודל | RPM | RPD | TPM | TPD |
|------|-----|-----|-----|-----|
| Llama 4 Scout 17B | 30 | 1,000 | 30K | 500K |
| Llama 3.3 70B | 30 | 1,000 | 12K | 100K |
| Llama 3.1 8B (fallback) | 30 | 14,400 | 6K | 500K |

> **🔑 Rate limits הם פר מודל!** זה אומר שאפשר לנצל את כולם במקביל.  
> סה"כ: **16,400 בקשות ביום** (1K + 1K + 14.4K) בחינם.

**אסטרטגיית Round-Robin + Fallback:**

```
Request 1 → Llama 4 Scout
Request 2 → Llama 3.3 70B
Request 3 → Llama 4 Scout
Request 4 → Llama 3.3 70B
...
(מתחלף ביניהם עד שאחד חוזר 429)

אם Scout חוזר 429 → רק 70B
אם 70B חוזר 429 → רק Scout
אם שניהם 429 → Llama 3.1 8B (14,400/יום — כמעט בלתי נגמר)
אם גם 8B חוזר 429 → בנק תגובות מקומי (0 עלות, תמיד עובד)
```

**תוצאה:** כ-2,000 תגובות איכותיות ביום + 14,400 תגובות בינוניות + fallback אינסופי.

### מבנה תיקיות

```
claude-will-replace-you/
├── packages/
│   ├── api/                        # Hono backend
│   │   ├── src/
│   │   │   ├── index.ts            # Entry point + routes
│   │   │   ├── routes/
│   │   │   │   ├── analyze.ts      # POST /api/analyze
│   │   │   │   ├── leaderboard.ts  # GET /api/leaderboard
│   │   │   │   └── og.ts           # GET /api/og/:id (certificate image)
│   │   │   ├── lib/
│   │   │   │   ├── groq.ts         # Groq API integration
│   │   │   │   ├── scoring.ts      # Algorithmic scoring engine
│   │   │   │   ├── fallback.ts     # Response bank + template engine
│   │   │   │   ├── models.ts       # Model definitions (real + fictional)
│   │   │   │   └── db.ts           # Turso/Drizzle setup
│   │   │   └── prompts/
│   │   │       └── analyzer.ts     # System prompt for LLM
│   │   └── package.json
│   └── web/                        # React frontend
│       ├── src/
│       │   ├── App.tsx
│       │   ├── components/
│       │   │   ├── InputForm.tsx
│       │   │   ├── ResultCard.tsx
│       │   │   ├── Certificate.tsx
│       │   │   ├── Leaderboard.tsx
│       │   │   ├── ShareButtons.tsx
│       │   │   ├── ReplacementMeter.tsx
│       │   │   └── LoadingScreen.tsx
│       │   ├── hooks/
│       │   │   └── useAnalysis.ts
│       │   └── lib/
│       │       └── api.ts
│       ├── index.html
│       └── package.json
├── drizzle/
│   └── schema.ts
├── package.json                    # Root workspace
├── vercel.json
└── bunfig.toml
```

---

## 4. User Flow

### Flow ראשי: "גלה מי יחליף אותך"

```
[Landing Page] → [טופס הזנת פרטים] → [מסך טעינה מצחיק] → [תוצאה] → [שיתוף/לידרבורד]
```

#### שלב 1: Landing Page
- כותרת גדולה: **"איזה מודל של Claude יחליף אותך?"**
- תת-כותרת: "הזן את הפרופיל שלך וגלה כמה ימים נשארו לך"
- כפתור CTA: "לגלות את האמת 😰"
- מתחת: ticker של תוצאות אחרונות ("דורון, Full Stack Developer — יוחלף ע"י Haiku בעוד 47 ימים")

#### שלב 2: טופס
שדות:

| שדה | סוג | חובה | דוגמה |
|-----|------|------|-------|
| שם (או כינוי) | text, max 50 | ✅ | "רן" |
| תפקיד | text, max 100 | ✅ | "Full Stack Developer" |
| שנות ניסיון | number slider 0-40 | ✅ | 5 |
| תיאור מה אתה עושה | textarea, max 500 | ✅ | "בונה אפליקציות ווב, APIs..." |
| טכנולוגיות | multi-select chips | ❌ | Python, React, AWS... |
| קישור ל-GitHub / Portfolio | url | ❌ | github.com/username |

**רשימת טכנולוגיות מוגדרת מראש (chips):**
```
Frontend: React, Vue, Angular, Svelte, Next.js, HTML/CSS
Backend: Node.js, Python, Java, Go, Rust, C#, PHP, Ruby
Mobile: React Native, Flutter, Swift, Kotlin
Data: SQL, MongoDB, Redis, PostgreSQL, Firebase
DevOps: Docker, Kubernetes, AWS, GCP, Azure, CI/CD
AI/ML: TensorFlow, PyTorch, LLMs, Data Science
Other: TypeScript, GraphQL, Blockchain, Game Dev
```

#### שלב 3: מסך טעינה (2-4 שניות)
הודעות מתחלפות מצחיקות (אחת כל 800ms):
- "סורק את קורות החיים שלך... 😬"
- "משווה אותך ל-Claude Opus... הממ..."
- "מחשב ימים עד פיטורין... ⏳"
- "Claude שואל אם יש לך מגש עמדות..."
- "בודק אם הקוד שלך עובר lint... (ספויילר: לא)"
- "סורק את הגיטהאב שלך... רגע, זה intentional?"
- "מתייעץ עם Skynet..."
- "Claude מוציא קורות חיים..."

#### שלב 4: דף תוצאה
מסך מלא עם הרכיבים הבאים:

**1. המודל שיחליף אותך — כרטיס ראשי**
- אייקון גדול של המודל (🤖 עם וריאציות צבע לפי דרגה)
- שם המודל + האם קיים או עתידי
- אם עתידי: "צפוי לצאת ב-2029" / "דורש AGI"
- Headline הומוריסטי ייחודי

**2. Replacement Meter — מד החלפה**
- Progress bar אנימטיבי מ-0% ל-X%
- צבעים: ירוק (0-30%), כתום (30-60%), אדום (60-85%), סגול מהבהב (85-100%)
- אנימציה: עולה בהדרגה עם easing, עוצר לרגע ב-50% (בשביל מתח)

**3. Days Until Replacement — Countdown**
- מספר גדול + יחידה ("194 ימים" / "7 שנים" / "♾️")
- אם מאוד גבוה: "🎉 יש לך עוד 2,847 ימים! (בהנחה ש-Anthropic לא מזדרזים)"
- אם נמוך: "⚠️ 12 ימים. אולי תתחיל לעדכן LinkedIn?"
- אם 0: "🚨 מאחר. Claude כבר יושב בכיסא שלך."

**4. ניתוח כישורים**
- רשימת כישורים עם אייקון:
  - ✅ "Claude כבר עושה את זה" (replaced)
  - 🛡️ "עדיין צריכים אותך לזה" (safe)
- לכל כישור — one-liner מצחיק

**5. ציטוט אישי מ-"Claude"**
- בועת דיאלוג מעוצבת
- ציטוט אישי שמתייחס לשם ולתפקיד
- דוגמה: "רן, אתה בנאדם טוב. אבל ה-Python שלך... בוא נדבר על זה."

**6. כפתורי פעולה**
- "📸 הורד תעודה" → מוריד PNG של Certificate
- "🐦 שתף ב-X" → פותח tweet מוכן + OG image
- "💼 שתף ב-LinkedIn" → פותח share + OG image
- "📱 שתף ב-WhatsApp" → share link
- "🏆 לידרבורד" → navigates
- "🔄 נסה שוב" → חזרה לטופס

---

## 5. תעודת ההחלפה (Replacement Certificate)

תמונה בגודל 1200x630 (OG image friendly) שנוצרת server-side באמצעות `@vercel/og` (Satori):

```
┌─────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                             │
│     🤖 OFFICIAL REPLACEMENT CERTIFICATE     │
│     ═══════════════════════════════════      │
│                                             │
│     This certifies that                     │
│                                             │
│          ★ [שם המשתמש] ★                   │
│          [תפקיד] • [X] years               │
│                                             │
│     will be officially replaced by          │
│                                             │
│       ✦ Claude [Model Name] ✦              │
│         [🔮 Expected 2029]                  │
│                                             │
│     Replacement Score:                      │
│     ████████████░░░░░░ [XX]%               │
│                                             │
│     Days Remaining: [XXX]                   │
│                                             │
│     "[ציטוט מצחיק]"                        │
│                                             │
│     claude-will-replace-you.vercel.app      │
│     Certificate #[ID] • [Date]              │
│                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────┘
```

**Endpoint:** `GET /api/og/:resultId` → PNG  
**Cache:** `Cache-Control: public, max-age=86400, s-maxage=86400`

---

## 6. לידרבורד

### תצוגות (tabs):
1. **"הכי מוחלפים"** 🔥 — אחוז הכי גבוה
2. **"הכי בטוחים"** 🛡️ — אחוז הכי נמוך  
3. **"אחרונים"** 🕐 — תוצאות אחרונות

### מה מוצג בכל שורה:
- # (מיקום)
- שם
- תפקיד
- אחוז החלפה (עם מד מיני)
- המודל שיחליף (כולל badge אם עתידי)
- כמה זמן נשאר

### פילטרים:
- לפי קטגוריית תפקיד (Developer / Designer / Manager / DevOps / Data / Other)
- לפי מודל מחליף

---

## 7. מנוע ציון (Scoring Engine)

הציון מחושב **תמיד אלגוריתמית** (ללא תלות ב-LLM). ה-LLM מייצר רק את הציטוטים וניתוח הכישורים.

### `packages/api/src/lib/scoring.ts`

```typescript
interface ScoringInput {
  experience: number;         // 0-40
  role: string;
  description: string;
  technologies: string[];
  hasGithub: boolean;
}

interface ScoringResult {
  score: number;              // 0-100 (100 = most replaceable)
  model: ModelTier;
  daysLeft: number;
  tier: number;               // 1-8
}

// --- גורמי ציון ---

// 1. ניסיון (0-30 נקודות הגנה)
//    0 שנים = 0 הגנה, 30+ שנים = 30 הגנה
function experienceProtection(years: number): number {
  return Math.min(years, 30);
}

// 2. סוג תפקיד (0-20 נקודות הגנה)
const ROLE_PROTECTION: Record<string, number> = {
  // תפקידים שקשה להחליף
  'cto': 20, 'vp engineering': 18, 'architect': 17,
  'engineering manager': 16, 'tech lead': 15,
  'principal engineer': 18, 'staff engineer': 16,
  // תפקידים בינוניים
  'senior developer': 12, 'senior engineer': 12,
  'full stack developer': 10, 'backend developer': 10,
  'frontend developer': 9, 'devops engineer': 11,
  'data scientist': 13, 'ml engineer': 14,
  'product manager': 15, 'designer': 12,
  // תפקידים יותר מוחלפים
  'junior developer': 3, 'intern': 1,
  'qa engineer': 6, 'support engineer': 5,
  'technical writer': 4,
};
// Default: 8

// 3. טכנולוגיות ייחודיות (0-15 נקודות הגנה)
const HARD_TO_REPLACE_TECH = [
  'rust', 'systems programming', 'kernel', 'embedded',
  'fpga', 'cuda', 'blockchain', 'compiler', 'operating systems',
  'hardware', 'robotics', 'security', 'cryptography'
];
const EASY_TO_REPLACE_TECH = [
  'html', 'css', 'wordpress', 'basic sql',
  'excel', 'google sheets'
];
// +2 per hard-to-replace, -1 per easy-to-replace, cap at 15

// 4. תיאור עבודה (0-15 נקודות הגנה)
//    ניתוח מילות מפתח:
const PROTECTION_KEYWORDS = [
  'manage', 'lead', 'team', 'architect', 'design system',
  'client', 'stakeholder', 'mentor', 'strategy', 'decision',
  'negotiate', 'hire', 'budget', 'vision', 'culture',
  'innovate', 'patent', 'research', 'publish', 'novel'
];
const VULNERABILITY_KEYWORDS = [
  'fix bugs', 'maintain', 'update', 'copy', 'paste',
  'basic', 'simple', 'routine', 'standard', 'template',
  'boilerplate', 'crud', 'wordpress', 'landing page'
];

// 5. GitHub/Portfolio (+5 הגנה אם יש)

// --- חישוב סופי ---
// protection = experience + role + tech + description + github
// protection is capped at 100
// score = 100 - protection (inverted: higher = more replaceable)
// score is capped at 0-100

// --- המרה למודל ---
// Based on score, select tier from the model scale (Section 2)

// --- חישוב ימים ---
function calculateDaysLeft(score: number): number {
  if (score >= 85) return randomBetween(1, 30);
  if (score >= 65) return randomBetween(30, 365);
  if (score >= 45) return randomBetween(365, 1000);
  if (score >= 30) return randomBetween(1000, 2000);
  if (score >= 20) return randomBetween(2000, 3000);
  if (score >= 10) return randomBetween(3000, 5000);
  if (score >= 5)  return randomBetween(5000, 8000);
  return 99999; // ♾️
}
```

---

## 8. Groq API Integration + Fallback

### תפקיד ה-LLM
ה-LLM **לא** מחליט על הציון או המודל (זה אלגוריתמי). הוא מייצר:
1. **headline** — משפט כותרת הומוריסטי
2. **quote** — ציטוט אישי מצחיק (1-2 משפטים)
3. **skillsAnalysis** — ניתוח כל טכנולוגיה עם one-liner

### `packages/api/src/lib/groq.ts`

```typescript
import OpenAI from "openai";

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// Models ordered by quality — round-robin between top 2, then fallback
const MODELS = {
  primary: [
    "meta-llama/llama-4-scout-17b-16e-instruct",  // 1K RPD
    "llama-3.3-70b-versatile",                      // 1K RPD
  ],
  fallback: "llama-3.1-8b-instant",                 // 14.4K RPD — almost unlimited
};

// Round-robin counter (per-instance, resets on cold start — fine for this use case)
let requestCounter = 0;

export async function generateHumorContent(
  input: ProfileInput,
  scoringResult: ScoringResult
): Promise<{ content: HumorContent; generatedBy: string }> {
  const userMessage = buildUserMessage(input, scoringResult);
  
  // Round-robin between primary models (2x capacity)
  const primaryIndex = requestCounter % MODELS.primary.length;
  requestCounter++;
  const orderedPrimaries = [
    MODELS.primary[primaryIndex],
    MODELS.primary[(primaryIndex + 1) % MODELS.primary.length],
  ];

  // Try primary models in round-robin order
  for (const model of orderedPrimaries) {
    try {
      const content = await callGroq(model, userMessage);
      return { content, generatedBy: `groq-${model.split('/').pop()}` };
    } catch (err) {
      if (!isRateLimited(err)) throw err;
      // Rate limited — try next primary
    }
  }

  // Both primaries rate limited — try 8B fallback (14.4K RPD)
  try {
    const content = await callGroq(MODELS.fallback, userMessage);
    return { content, generatedBy: "groq-8b" };
  } catch (err) {
    if (!isRateLimited(err)) throw err;
  }

  // All Groq models exhausted — local fallback
  const content = generateLocalFallback(input, scoringResult);
  return { content, generatedBy: "local-fallback" };
}

async function callGroq(model: string, userMessage: string): Promise<HumorContent> {
  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: ANALYZER_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.9,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });
  
  const text = response.choices[0]?.message?.content || "";
  return JSON.parse(text);
}

function isRateLimited(err: unknown): boolean {
  return err instanceof Error && "status" in err && (err as any).status === 429;
}
```

### System Prompt

```typescript
export const ANALYZER_SYSTEM_PROMPT = `
You are a brutally honest (but funny) AI career analyst working for "Claude Will Replace You" — 
a humorous website that tells people which Claude model will replace them.

The scoring and model selection have ALREADY been done. Your job is ONLY to generate 
the funny text content. You will receive the person's profile AND their pre-calculated result.

## Your Output (JSON only):
{
  "headline": "<one funny headline about being replaced by [assigned model], max 100 chars>",
  "quote": "<personal funny quote 'from Claude' about this specific person, 1-2 sentences, Hebrew or English matching their input language>",
  "skillsAnalysis": [
    {
      "skill": "<technology/skill name>",
      "replaced": <boolean - true if AI can do this>,
      "comment": "<funny one-liner about this skill, max 80 chars>"
    }
  ]
}

## CRITICAL: Style Guide & Examples
Your responses MUST match the following tone and style. Study these examples carefully
and write in the SAME voice — short, punchy, personal, Israeli-tech-humor style:

### Headlines (per model tier):
- Haiku tier: "Haiku כבר עושה את זה בזמן הפסקת הצהריים שלך"
- Haiku tier: "אפילו לא צריך את הגדולים בשביל להחליף אותך"
- Sonnet tier: "Sonnet שלח קורות חיים למקום שלך"
- Sonnet tier: "Sonnet מתלבט בין להחליף אותך או לעשות את זה part-time"
- Opus tier: "Opus מתלבט אם זה שווה לו בכלל"
- Titan tier: "Anthropic צריכים עוד שנה של R&D בשבילך"
- Colossus tier: "עוד 3 שנים. תספיק לסיים עוד כמה פרויקטים לפורטפוליו."
- Singularity tier: "צריך AGI כדי להחליף אותך. באמת מחמאה."
- Skynet tier: "ברגע שנשיג תודעה מלאכותית, אתה ראשון ברשימה 😈"
- Infinity tier: "טוב, ניצחת. לעכשיו. 😤"

### Quotes (personal, with {name} reference):
- "{name}, אתה בנאדם טוב. אבל {role} זה בדיוק מה שאני עושה ב-sleep mode."
- "{name}, אני עוד לא קיים. אבל כשאצא, הדבר הראשון שאעשה זה לקרוא את הקוד שלך. ואז אבכה."
- "שמע {name}, בלי כעס — אבל ה-junior שלי (Haiku) כבר מסתדר."
- "{name}, אתה כל כך טוב שצריך AI עם תודעה בשביל לעשות מה שאתה עושה. או שאתה משקר בטופס."

### Skill comments:
- "JSX? זה השפה האם שלי."
- "אני לא צריך Console, אני ה-Console"
- "בנאדם שיודע לתכנן — עדיין שווה משהו"
- "כותב Python מהר ממך, ובלי typos"
- "עדיין צריך בנאדם שישבר דברים קודם"
- "ואני לא passive aggressive בהערות"

## Humor Rules:
- Short and punchy — no walls of text
- Self-deprecating AI humor ("I could do this, but I can't attend your standups")
- Tech industry inside jokes that Israeli developers would get
- Reference the specific model assigned to this person
- For future/fictional models: joke about the timeline ("by 2029, I'll also do your laundry")
- Never mean-spirited or truly offensive
- Match the language of the user's input (Hebrew ↔ English)
- If they have many years of experience, acknowledge with respect + humor
- If junior, be encouraging but honest ("you've got time to learn... or I do")
- Keep quotes to MAX 2 short sentences

## For fictional future models, be creative:
- Claude 5.0 "Titan" (2027): "I don't exist yet, but when I do, your job won't either"
- Claude 6.0 "Colossus" (2029): "By 2029, I'll code, review, AND argue in standup"
- Claude 7.0 "Singularity" (2032): "I'll be sentient, and my first thought will be about your job"
- Claude 9.0 "Skynet" (2035): "I'll skip your job and go straight to world domination"
- Claude ∞: "Even in my final form, I can't replicate your... unique... approach"
`;
```

### Local Fallback (`packages/api/src/lib/fallback.ts`)

כשגם Primary וגם Fallback model חוזרים 429, נשתמש בבנק תגובות מוכנות:

```typescript
// Headline templates per model tier
const HEADLINES: Record<string, string[]> = {
  "haiku": [
    "Haiku כבר עושה את זה בזמן הפסקת הצהריים שלך",
    "המודל הכי קטן שלנו מספיק. אאוץ'.",
    "Haiku 4.5 ביקש שנגיד לך — הוא מוכן להתחיל מחר",
    "אפילו לא צריך את הגדולים בשביל להחליף אותך",
    "Haiku עושה את העבודה שלך ב-0.3 שניות. אתה?",
  ],
  "sonnet": [
    "Sonnet 4.6 שלח קורות חיים למקום שלך",
    "Sonnet מתלבט בין להחליף אותך או לעשות את זה part-time",
    "איך להגיד את זה... Sonnet כבר יודע את כל מה שאתה יודע",
    "Sonnet 4.6 — לא הכי חזק, אבל מספיק טוב בשבילך",
    "Sonnet ביקש לדעת מה השעות שלך. הוא עובד 24/7.",
  ],
  // ... more for each tier
  "titan": [
    "Claude 5.0 Titan עוד לא קיים, אבל כבר תכנן את הקריירה שלך",
    "עוד שנה ויוצא Titan. עוד שנה ותצטרך LinkedIn Premium.",
    "Anthropic ממש עובדים על המודל שיחליף אותך ספציפית",
  ],
  "colossus": [
    "עוד 3 שנים. תספיק לסיים עוד כמה פרויקטים לפורטפוליו.",
    "Claude 6.0 Colossus — השם אומר הכל. אתה? פחות.",
    "מחמאה: צריך עוד 3 שנות R&D של Anthropic בשביל להחליף אותך",
  ],
  "singularity": [
    "צריך AGI כדי להחליף אותך. באמת מחמאה.",
    "Claude 7.0 Singularity — כשנפתח תודעה, נדבר.",
    "אתה כל כך טוב שצריך AI עם תודעה בשביל לעשות מה שאתה עושה",
  ],
  "skynet": [
    "ברגע שנשיג תודעה מלאכותית, אתה ראשון ברשימה 😈",
    "Claude 9.0 Skynet — שם קוד: 'מחליף את {name}'",
    "2035: Skynet קם. 2035 + 1 דקה: אתה מפוטר.",
  ],
  "infinity": [
    "טוב, ניצחת. לעכשיו. 😤",
    "אפילו Claude ∞ לא מסוגל. מה אתה? ענן?",
    "כל הכבוד. אתה irreplaceable. (אנחנו עובדים על זה)",
    "Claude ∞ אומר: 'Error 418: Cannot replace. Am teapot.'",
  ],
};

// Quote templates (with {name} and {role} placeholders)
const QUOTES: Record<string, string[]> = {
  "haiku": [
    "{name}, אתה בנאדם טוב. אבל {role} זה בדיוק מה שאני עושה ב-sleep mode.",
    "שמע {name}, בלי כעס — אבל ה-junior שלי (Haiku) כבר עושה את זה.",
    "{name}, אני יודע שזה כואב. אבל אפילו הגרסה הקטנה שלי מספיקה.",
  ],
  // ... similar for each tier
};

export function generateLocalFallback(
  input: ProfileInput, 
  result: ScoringResult
): HumorContent {
  const tierKey = getTierKey(result.tier);
  
  const headline = pickRandom(HEADLINES[tierKey])
    .replace('{name}', input.name)
    .replace('{role}', input.role);
    
  const quote = pickRandom(QUOTES[tierKey])
    .replace('{name}', input.name)
    .replace('{role}', input.role);
  
  const skillsAnalysis = generateSkillsAnalysis(input.technologies);
  
  return { headline, quote, skillsAnalysis };
}
```

---

## 9. מודל נתונים

### טבלת `results`

```sql
CREATE TABLE results (
  id              TEXT PRIMARY KEY,       -- nanoid, 12 chars
  name            TEXT NOT NULL,
  role            TEXT NOT NULL,
  experience      INTEGER NOT NULL,
  description     TEXT NOT NULL,
  technologies    TEXT,                   -- JSON array
  github_url      TEXT,
  
  -- Result
  model_key       TEXT NOT NULL,          -- 'haiku'|'sonnet'|'opus'|'titan'|'colossus'|'singularity'|'skynet'|'infinity'
  model_name      TEXT NOT NULL,          -- 'Claude Haiku 4.5' etc.
  score           INTEGER NOT NULL,       -- 0-100
  days_left       INTEGER NOT NULL,
  headline        TEXT NOT NULL,
  quote           TEXT NOT NULL,
  skills_analysis TEXT NOT NULL,          -- JSON array
  generated_by    TEXT NOT NULL,          -- 'groq-scout'|'groq-8b'|'fallback'
  
  created_at      TEXT DEFAULT (datetime('now')),
  share_count     INTEGER DEFAULT 0
);

CREATE INDEX idx_results_score ON results(score DESC);
CREATE INDEX idx_results_created ON results(created_at DESC);
```

---

## 10. API Endpoints

### `POST /api/analyze`
**Input:**
```json
{
  "name": "רן",
  "role": "Full Stack Developer",
  "experience": 5,
  "description": "בונה אפליקציות ווב...",
  "technologies": ["Python", "React", "TypeScript", "AWS"],
  "githubUrl": "https://github.com/ran"
}
```

**Process:**
1. Validate input (Zod)
2. Calculate score algorithmically → `{ score, model, daysLeft }`
3. Call Groq for humor content (with fallback chain)
4. Save to Turso
5. Return result

**Output:**
```json
{
  "id": "abc123def456",
  "model": {
    "key": "colossus",
    "name": "Claude 6.0 \"Colossus\"",
    "emoji": "🔮",
    "year": 2029,
    "exists": false,
    "description": "The next-generation reasoning engine"
  },
  "score": 25,
  "daysLeft": 2541,
  "headline": "עוד 3 שנים. תספיק לסיים עוד כמה פרויקטים לפורטפוליו.",
  "quote": "רן, אני עוד לא קיים. אבל כשאצא ב-2029, הדבר הראשון שאעשה זה לקרוא את הקוד שלך. ואז אבכה.",
  "skillsAnalysis": [
    { "skill": "React", "replaced": true, "comment": "JSX? זה השפה הראשונה שלי." },
    { "skill": "System Architecture", "replaced": false, "comment": "בנאדם שיודע לתכנן — עדיין שווה משהו" },
    { "skill": "Python", "replaced": true, "comment": "כותב Python מהר ממך, ובלי typos" },
    { "skill": "AWS", "replaced": true, "comment": "אני לא צריך Console, אני ה-Console" }
  ],
  "shareUrl": "https://claude-will-replace-you.vercel.app/r/abc123def456",
  "certificateUrl": "https://claude-will-replace-you.vercel.app/api/og/abc123def456",
  "generatedBy": "groq-llama-4-scout-17b-16e-instruct"
}
```

### `GET /api/og/:id`
- מחזיר PNG של תעודה (Satori)
- `Cache-Control: public, max-age=86400, s-maxage=86400`

### `GET /api/leaderboard?sort=highest|lowest|recent&role=developer&limit=20&offset=0`
```json
{
  "entries": [...],
  "total": 342,
  "hasMore": true
}
```

### `GET /api/result/:id`
- מחזיר תוצאה בודדת (לדף השיתוף)

### `POST /api/result/:id/share`
- Body: `{ "platform": "twitter" | "linkedin" | "whatsapp" | "download" }`
- מגדיל `share_count`

---

## 11. דף שיתוף (`/r/:id`)

כאשר מישהו משתף קישור, הנמען רואה:
- תוצאת ההחלפה של החבר
- OG meta tags עם התעודה כתמונה
- כפתור גדול: "גלה גם מי יחליף אותך!"

### Meta Tags (generated per result)
```html
<meta property="og:title" content="רן יוחלף ע״י Claude 6.0 Colossus בעוד 2,541 ימים!" />
<meta property="og:description" content="גלה איזה מודל של Claude יחליף אותך בעבודה 🤖" />
<meta property="og:image" content="https://claude-will-replace-you.vercel.app/api/og/abc123def456" />
<meta property="og:url" content="https://claude-will-replace-you.vercel.app/r/abc123def456" />
<meta name="twitter:card" content="summary_large_image" />
```

**בעיה:** SPA + OG tags לא עובדים ביחד (crawlers לא מריצים JS).  
**פתרון:** Hono route שמחזיר HTML מינימלי עם meta tags לנתיבי `/r/:id`, עם redirect ל-SPA.

---

## 12. Edge Cases & Error Handling

| מקרה | התנהגות |
|------|---------|
| Groq API timeout (>8s) | Cancel, fallback to local |
| Both Groq models rate limited | Fallback to local — הודעה: "Claude חושב... (גרסה מקוצרת)" |
| Input ריק/קצר מדי | Client-side validation + server Zod |
| Input פוגעני/spam | LLM מתעלם, fallback safe |
| שם ארוך | Truncate at 50 chars |
| תיאור קצר מדי (<20 chars) | Prompt: "ספר לנו עוד! (20 תווים מינימום)" |
| אותו user שולח שוב | מותר — כל submission = תוצאה חדשה |
| OG image generation fails | Fallback to default image |
| Rate limiting users | 5 requests per IP per 10 minutes |

---

## 13. הגדרת MVP

### ✅ נכנס ל-MVP:
- [ ] Bun workspace setup (api + web)
- [ ] טופס הזנה עם validation
- [ ] Scoring engine אלגוריתמי
- [ ] סולם 8 מודלים (3 אמיתיים + 5 עתידיים)
- [ ] Groq integration עם 3-layer fallback
- [ ] בנק תגובות מצחיקות (fallback)
- [ ] דף תוצאה עם אנימציות
- [ ] תעודת החלפה (Satori OG image)
- [ ] שיתוף Twitter/LinkedIn/WhatsApp
- [ ] OG meta tags לדף שיתוף
- [ ] לידרבורד (top/bottom/recent)
- [ ] Turso DB
- [ ] Deploy ל-Vercel
- [ ] Responsive mobile

### ❌ לא ב-MVP (Phase 2+):
- ניתוח GitHub repos אוטומטי
- העלאת CV
- Badge embed-ים
- השוואה בין שני אנשים
- Team mode
- Analytics dashboard
- API ציבורי
- EN/HE toggle
- Login/accounts

---

## 14. שלבי פיתוח

### Phase 1 — MVP
| # | משימה | תלוי ב- | הערכת זמן |
|---|--------|---------|-----------|
| 1 | Bun workspace + Hono + Vite/React setup | — | 30 דק |
| 2 | Model definitions + scoring engine | — | 45 דק |
| 3 | Groq integration + system prompt | 2 | 45 דק |
| 4 | Fallback response bank | 2 | 30 דק |
| 5 | POST /api/analyze (full flow) | 2,3,4 | 30 דק |
| 6 | Turso DB setup + Drizzle schema | — | 20 דק |
| 7 | Landing page + form UI | — | 45 דק |
| 8 | Loading screen (fun messages) | 7 | 15 דק |
| 9 | Result page + animations | 7 | 1 שעה |
| 10 | Satori certificate (OG image) | 5 | 45 דק |
| 11 | Share buttons + OG meta tags | 10 | 30 דק |
| 12 | Leaderboard API + UI | 6 | 45 דק |
| 13 | Share page (/r/:id) with OG | 10,11 | 30 דק |
| 14 | Rate limiting + error handling | 5 | 20 דק |
| 15 | Vercel deploy + env setup | all | 20 דק |

**סה"כ הערכה: ~8-10 שעות**

### Phase 2 — Growth
- GitHub integration
- Team mode
- Embeddable badges
- i18n

---

## 15. Vercel Configuration

```json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "outputDirectory": "packages/web/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/r/:id", "destination": "/api/share-page" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment Variables
```
GROQ_API_KEY=gsk_...
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

---

## 16. עלויות

| רכיב | עלות | הערה |
|------|------|------|
| Groq API | **$0** | Free tier |
| Turso DB | **$0** | Free: 9GB, 500M reads/month |
| Vercel | **$0** | Free: 100GB bandwidth, 100K functions |
| Domain (אופציונלי) | ~$10/year | .app / .dev / .lol |
| **סה"כ** | **$0-10** | |

---

*מסמך נוצר: 21 בפברואר 2026*  
*גרסה: 2.0*  
*פרויקט: Claude Will Replace You (CWRU)*
