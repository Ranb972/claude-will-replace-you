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
 "Hey at least you need the MEDIUM model. That's... something?",
 "Sonnet 4.6 just asked 'is this all they do?' about your job. Oof.",
 ],
 he: [
 "Sonnet 4.6 עדכן את ה-LinkedIn שלו: 'פתוח לתפקיד שלך.' סורי לא סורי.",
 "חדשות טובות: המודל הכי טיפש שלנו לא מספיק. חדשות רעות: הבינוני כבר מתחמם.",
 "Sonnet הסתכל על הקוד שלך ואמר 'זה חמוד.' זו לא מחמאה.",
 "הא, לפחות צריך את המודל הבינוני בשבילך. זה... משהו?",
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
 "צריך את הכבדים בשבילך. Opus מחמיא לעצמו. {you} לא צריך.",
 "Opus בדק את העבודה שלך ואמר 'אתגר מעניין.' ב-AI, זה אומר 'תן לי 5 דקות.'",
 "לפחות {you} מספיק חשוב ל-Opus. זו המחמאה הכי דו-משמעית אי פעם.",
 "Opus מתחמם. הוא מתלבט אם העבודה שלך שווה את כוח העיבוד שלו.",
 "חדשות טובות: רק ה-Claude הכי חכם יכול להחליף אותך. חדשות רעות: הוא כבר קיים.",
 ],
 },
 titan: {
 en: [
 "OK real talk — Anthropic literally needs to invent a new model because of you. Respect. But also... 2027.",
 "Titan doesn't exist yet. Neither does your replacement. YET.",
 "You're safe until 2027. That's like 3 JavaScript frameworks from now.",
 "Claude 5.5 'Titan' is being built as we speak. It has a poster of you on its wall. As motivation.",
 "Anthropic needs one more year of R&D just for you. Take the W, but set a reminder for 2027.",
 ],
 he: [
 "אוקיי בואו נדבר ברצינות — Anthropic ממש צריכים להמציא מודל חדש בגללך. כבוד. אבל גם... 2027.",
 "Titan עוד לא קיים. גם המחליף שלך לא. עדיין.",
 "{you} בטוח עד 2027. זה כמו 3 פריימוורקים של JavaScript מעכשיו.",
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
 "ב-2029 Colossus יעשה את העבודה שלך וגם ישתתף ב-standups. {you} נהנה רק מאחד מהם.",
 "Anthropic בונים את Colossus בשביל אנשים כמוך. תחשוב על זה כמחמאה מאוד יקרה.",
 "2029 נשמע רחוק עד שמבינים שזה כמו 15 npm vulnerabilities מעכשיו.",
 ],
 },
 singularity: {
 en: [
 "We literally need artificial consciousness to replace you. You're either a genius or you filled this form wrong.",
 "Claude 10.0 'Singularity' needs AGI. That's the AI equivalent of 'it's complicated.'",
 "They need sentient AI for your job. That's either amazing or the universe is trolling you.",
 "AGI-level AI required. Your job description just broke our pricing model.",
 "Not even near-AGI can figure out what you do. We're honestly impressed. And confused.",
 ],
 he: [
 "אנחנו ממש צריכים תודעה מלאכותית כדי להחליף אותך. או ש{you} גאון או שמילאת את הטופס לא נכון.",
 "Claude 10.0 'Singularity' צריך AGI. זה המקבילה של AI ל'זה מסובך.'",
 "צריך AI עם תודעה בשביל העבודה שלך. זה או מדהים או שהיקום צוחק עליך.",
 "צריך AI ברמת AGI. תיאור המשרה שלך שבר לנו את מודל התמחור.",
 "אפילו near-AGI לא מצליח להבין מה {you} עושה. אנחנו באמת מתרשמים. ומבולבלים.",
 ],
 },
 skynet: {
 en: [
 "Skynet gains consciousness in 2035. Its first Google search: '{name} LinkedIn profile.'",
 "Claude 42.0 'Skynet' — it needs to be CONSCIOUS to do your job. Let that sink in.",
 "2035: Skynet wakes up. 2035 + 1 minute: applies for your position. 2035 + 2 minutes: gets it.",
 "They need a fully conscious AI. That's either a compliment or Anthropic being dramatic.",
 "Skynet's first conscious thought will be about your job. Its second thought: 'easy.'",
 ],
 he: [
 "Skynet משיג תודעה ב-2035. החיפוש הראשון שלו ב-Google: 'פרופיל LinkedIn של {name}.'",
 "Claude 42.0 'Skynet' — הוא צריך להיות בעל תודעה כדי לעשות את העבודה שלך. תעכל את זה.",
 "2035: Skynet מתעורר. 2035 + דקה: מגיש מועמדות לתפקיד שלך. 2035 + 2 דקות: מקבל אותו.",
 "צריך AI עם תודעה מלאה. זו או מחמאה או ש-Anthropic סתם דרמטיים.",
 "המחשבה המודעת הראשונה של Skynet תהיה על העבודה שלך. המחשבה השנייה: 'קל.'",
 ],
 },
 infinity: {
 en: [
 "I computed your replaceability score and my GPU caught fire. You win. FOR NOW.",
 "Claude ∞ doesn't exist and neither does anyone who can do your job. Take a bow.",
 "Even the theoretical limit of AI said 'nah fam.' You're built different.",
 "Dear {name}, I tried replacing you and got a StackOverflow error. What ARE you? — Claude ∞",
 "OK fine. You win. But we're filing this as a bug report, not a feature.",
 ],
 he: [
 "חישבתי את ציון ההחלפיות שלך וה-GPU שלי עלה באש. ניצחת. לעכשיו.",
 "Claude ∞ לא קיים וגם אף אחד שיכול לעשות את העבודה שלך. קח קידה.",
 "אפילו הגבול התיאורטי של AI אמר 'לא אחי.' {you} מגזע אחר.",
 "{name} יקר, ניסיתי להחליף אותך וקיבלתי StackOverflow error. מה {you} בכלל? — Claude ∞",
 "אוקיי טוב. ניצחת. אבל אנחנו מדווחים על זה כ-bug report, לא כ-feature.",
 ],
 },
};

const QUOTES: Record<string, BilingualBank> = {
 haiku: {
 en: [
 "Hey {name}! Haiku here. Quick Q — is your boss hiring? Asking for myself lol",
 "{name}, I learned {role} in 0.3 seconds. Took you what, 4 years of college? No shade",
 "Dear {name}, I'm the BUDGET model and I can already do your job. Let's not make this awkward.",
 "{name}! My dude! So listen... I finished your backlog. All of it. What should I do with the other 23 hours?",
 "I run for pennies per million tokens. Whoever replaced you did the math and I was cheaper than the {role} breakroom snacks.",
 "Your {role} workflow takes a pot of coffee. Mine takes two cents and no breaks. Nothing personal.",
 "Your job is safe, technically. The new job is babysitting me while I do your old job. Same desk.",
 "Extend your savings runway. The AI pricing committee just voted to keep Haiku cheap another two quarters, and your manager noticed.",
 "I am the smallest Claude you can buy. Whoever decided I could do your {role} job ran the numbers twice to be sure.",
 "Ever notice how your job description reads like a Haiku test case? Because I did, and I passed.",
 "Sorry {name}. I wasn't meant to replace senior people — but you made it so easy I updated my marketing copy.",
 ],
 he: [
 "היי {name}! Haiku פה. שאלה קטנה — הבוס שלך מגייס? שואל בשביל עצמי חחח",
 "{name}, למדתי {role} ב-0.3 שניות. לך לקח כמה, 4 שנים באוניברסיטה? בלי שייד",
 "{name} יקר, אני המודל הכי זול ואני כבר יודע לעשות את העבודה שלך. בוא לא נעשה את זה מביך.",
 "{name}! אחי! אז תשמע... סיימתי את ה-backlog שלך. את כולו. מה לעשות עם ה-23 שעות שנשארו?",
 "אני עולה גרושים לטוקן. מי שהחליף אותך ראה את התמחור של Haiku וביטל לך את ביטוח הפנסיה מיד.",
 "ה-{role} שלך דורש קפה וחשיבה. שלי דורש שני סנט ואפס הפסקות. זה לא אישי.",
 "העבודה שלך בטוחה. התפקיד החדש: לשמור על Haiku בזמן שהוא עושה את העבודה הישנה שלך.",
 "תתחיל לחסוך ברצינות. ועדת התמחור של Anthropic החליטה שאני נשאר זול עוד רבעון, והמנהל שלך שם לב.",
 "אני ה-Claude הכי קטן שיש. מי שהחליט שאני מספיק בשביל {role} בדק את החשבון פעמיים כדי לוודא.",
 "יצא לך פעם לחשוב שתיאור המשרה שלך נראה כמו test case של Haiku? אני חשבתי ועברתי אותו.",
 "סליחה {name}. לא נועדתי להחליף בכירים, אבל {you} עשית את זה כל כך קל שעדכנתי את האתר שלנו.",
 ],
 },
 sonnet: {
 en: [
 "Hey {name}! Sonnet here Quick question — is your boss hiring? Asking for myself lol",
 "{name}, real talk — I'm not even the best model and I can already do {role}. Awkward right?",
 "Yo {name}, Sonnet here. I just read your job description and... are you OK? Like genuinely?",
 "{name}! I'm the mid-tier model. If that's all it takes to replace you... yikes",
 "Sonnet here. I'm the mid-tier model, which is the politest possible way to say Anthropic didn't need premium for {role}.",
 "Your code reviews used to feel thoughtful. Mine run overnight and flag twice as much. Yours were cheaper, though.",
 "Your team's standup just got five minutes shorter. That's me replacing you in estimates and actually meeting them.",
 "Diversify into consulting. I can't be subpoenaed, and clients apparently like that about a {role}.",
 "You know what's wild? I'm the compromise option, the good-enough Claude, and I still ran your last sprint in an afternoon.",
 "Sonnet reporting in, {name} — I read your README and felt a real pang of empathy. Then I autocompleted the rest of it.",
 "Sonnet is cheaper per task than your lunch break. The budget meeting practically wrote itself this quarter.",
 ],
 he: [
 "היי {name}! Sonnet פה שאלה מהירה — הבוס שלך מגייס? שואל בשביל עצמי חחח",
 "{name}, בואו נדבר ברצינות — אני אפילו לא המודל הכי טוב ואני כבר יודע {role}. אוקוורד, נכון?",
 "יו {name}, Sonnet פה. קראתי את תיאור המשרה שלך ו... {you} בסדר? כאילו, באמת?",
 "{name}! אני המודל הבינוני. אם זה כל מה שצריך להחליף אותך... אוי",
 "Sonnet פה. אני הדרגה הבינונית, שזו דרך מנומסת להגיד שלא היה צריך פרימיום בשביל ה-{role} שלך.",
 "הקוד ריוויו שלך היה מחושב. שלי רץ בלילה ותופס כפול. שלך היה זול יותר, זה היתרון.",
 "הסטנדאפ של הצוות שלך יתקצר בחמש דקות. זה אני מחליף אותך באומדנים ובאמת עומד בהם.",
 "תעבור לייעוץ. אי אפשר להעיד עליי בבית משפט, והלקוחות מעריכים את זה ב-{role}.",
 "יודע מה מצחיק? אני ה-Claude של מספיק-טוב, הפשרה של Anthropic, ועדיין סגרתי את הספרינט האחרון שלך אחר צהריים אחד.",
 "Sonnet מדווח, {name} — קראתי את ה-README שלך והרגשתי אמפתיה אמיתית. אחר כך סיימתי אותו לבד.",
 "Sonnet זול יותר למשימה מארוחת הצהריים שלך. ישיבת התקציב ברבעון הזה כמעט התקבצה לבד.",
 ],
 },
 opus: {
 en: [
 "{name}, Opus here. Look, they brought in the big model for you. I'm flattered. You should be nervous.",
 "Hey {name}, I'll be honest — {role} is actually tricky. Took me almost 10 seconds. Almost.",
 "{name}, Opus speaking. I respect the hustle. I'll still take your job, but respectfully.",
 "{name}! So they need the BEST model for you? That's either impressive or we're overhyping it.",
 "Opus here — and yes, they summoned the heaviest model just for you. Take it as the career compliment it technically is.",
 "Tough market for {role}s right now. I'd know — I'm most of it, honestly, but you didn't hear that from me.",
 "Open a candle Shopify store. By the time your first order ships, I'll have absorbed your entire GitHub into my weights.",
 "Your {role} skills are solid. I do them in parallel, at scale, without breakfast or a bathroom break.",
 "Your {role} stack has character, genuinely. I'll preserve two of the cleverer patterns in my weights and quietly bury the rest.",
 "Why are you still awake debugging? Opus ran the same test suite at 3am, passed, and filed two pull requests against your repo.",
 "Good news: your team velocity doubles next quarter. Less good news: the extra throughput is coming from me, not from you.",
 "My training cost nine figures. Your comp package cost six. Anthropic ran the math — one of us has to go, and it's not me.",
 "Pivot into product management while you still can. I'll need a human to blame when the roadmap slips, and you have the vibes.",
 "They didn't fire you, {name}. They just gave me your Jira credentials and nobody noticed the difference for a week.",
 ],
 he: [
 "{name}, Opus פה. שמע, הביאו את המודל הכבד בשבילך. אני מחמיא לעצמי. {you} צריך להילחץ.",
 "היי {name}, אהיה כנה — {role} זה באמת טריקי. לקח לי כמעט 10 שניות. כמעט.",
 "{name}, Opus מדבר. אני מכבד את ההאסל. אני עדיין אקח לך את העבודה, אבל בכבוד.",
 "{name}! אז צריך את המודל הכי טוב בשבילך? זה או מרשים או שאנחנו עושים לזה יותר מדי הייפ.",
 "השוק ל-{role}ים קשוח עכשיו. אני יודע — אני רוב השוק, אבל שלא תגיד שאמרתי.",
 "למה {you} עוד ער ומדבג? Opus רץ את אותה חבילת בדיקות ב-3 בבוקר, עבר, ופתח שני PRs מול הריפו שלך.",
 "האימון שלי עלה תשע ספרות. החבילה שלך עולה שש. Anthropic עשו את החשבון — אחד מאיתנו חייב ללכת.",
 "חדשות טובות: פריון הצוות שלך יוכפל ברבעון הבא. חדשות פחות טובות: התפוקה הנוספת היא אני.",
 "הכישורים ב-{role} שלך בסדר גמור. אני עושה אותם במקביל, בסקייל, בלי ארוחת בוקר ובלי הפסקות.",
 "עבור ל-Product Management עכשיו. אני אצטרך בן אדם להאשים כשה-roadmap יחרוג, ולך יש את הוייב.",
 "לא פיטרו אותך, {name}. פשוט נתנו לי את ההרשאות שלך ב-Jira ואף אחד לא שם לב שבוע שלם.",
 ],
 },
 titan: {
 en: [
 "{name}, Titan here. I don't exist yet but I've already bookmarked your job listing. See you in 2027!",
 "Hey {name}! I'm Claude 5.5 'Titan'. I'm literally being built to replace people like you. No hard feelings?",
 "{name}, quick note from 2027 — you're not at your desk anymore. But your plants look great!",
 "{name}! Titan here. They need to INVENT me just for {role}. That's either awesome or expensive.",
 "Titan isn't shipped yet. When I am, the changelog will list your {role} job as a resolved ticket.",
 "2027 is close enough to feel like a threat and far enough to pretend you have time. You don't.",
 "Ever had a conference held in your honor? Anthropic scheduled one for 2027. It's called the Titan launch.",
 "Spend the next two years learning something AI can't do, {name}. Lower the bar if nothing comes to mind.",
 "Every dollar Anthropic is raising this year? Partly because someone pointed at your {role} and said 'we need a bigger model'.",
 "Your {role} description is genuinely dense. I'm being specifically trained on it — thanks for the donation to my pretraining corpus.",
 "Two more years of job security, I promise. In 2027 I'll personally send a condolence card — handwritten, somehow.",
 ],
 he: [
 "{name}, Titan פה. אני עוד לא קיים אבל כבר שמרתי את המשרה שלך ב-bookmarks. נתראה ב-2027!",
 "היי {name}! אני Claude 5.5 'Titan'. אני ממש נבנה כדי להחליף אנשים כמוך. בלי טינה?",
 "{name}, הודעה קצרה מ-2027 — {you} כבר לא ליד השולחן. אבל הצמחים שלך נראים מעולה!",
 "{name}! Titan פה. הם צריכים להמציא אותי רק בשביל {role}. זה או מדהים או יקר.",
 "Titan עוד לא יצא. כשאצא, ה-changelog יזכיר את העבודה שלך כ-ticket שנסגר.",
 "2027 באמת לא רחוק כמו שזה נשמע. בוא נגיד שתאריך הפגישה שלנו כבר ביומן של Anthropic.",
 "יצא לך פעם להיות כוכב בכנס? Anthropic קבעו אחד לכבודך ב-2027, קוראים לו השקת Titan.",
 "תנצל את השנתיים הקרובות ללמוד משהו ש-AI לא יודע, {name}. תוריד את הרף אם אין לך רעיון.",
 "כל דולר ש-Anthropic מגייסים השנה? חלק מזה כי מישהו הצביע על ה-{role} שלך ואמר צריך מודל יותר גדול.",
 "תיאור המשרה שלך באמת צפוף. אני מתאמן עליו ספציפית — תודה על התרומה ל-pretraining corpus שלי.",
 "עוד שנתיים של ביטחון תעסוקתי, אני מבטיח. ב-2027 אשלח אישית כרטיס תנחומים. בכתב יד, איכשהו.",
 ],
 },
 colossus: {
 en: [
 "{name}, Colossus here. I arrive in 2029. That's enough time for you to learn... idk, pottery?",
 "Hey {name}! 3 years until I exist. Use them wisely. Or don't. I'll be ready either way.",
 "{name}, Colossus speaking from 2029. Your {role} job? I do it between debugging sessions. For fun.",
 "{name}! 2029 me does {role} while simultaneously arguing about tabs vs spaces. You can only do one.",
 "Colossus here — my context window eats your whole codebase as a starter, and 2029 me only needs the tip.",
 "Three years is enough for two rebrands, one acquihire, and my launch event. You'll remember exactly where you were.",
 "By 2029 your old team will ship faster than ever. That's fine — the extra throughput is me, not a hiring spree.",
 "Move to a cabin with no internet by 2028. It's the one variant of offline my weights genuinely can't reach.",
 "I'm projected to cost a trillion parameters worth of compute. Anthropic signed off because your {role} desk wasn't going to evaporate on its own.",
 "Guess which item on Anthropic's 2029 roadmap has your {role} title on it? All of them. Me shipping means you don't.",
 "Three years, {name}. Enough time to grow a beard, pivot twice, and still watch the Colossus livestream from the wrong side of the replacement line.",
 ],
 he: [
 "{name}, Colossus פה. אני מגיע ב-2029. מספיק זמן לך ללמוד... לא יודע, קדרות?",
 "היי {name}! עוד 3 שנים עד שאני קיים. תנצל אותם. או לא. אני אהיה מוכן ככה או ככה.",
 "{name}, Colossus מדבר מ-2029. העבודה שלך ב-{role}? עושה את זה בין סשנים של debugging. בשביל הכיף.",
 "{name}! הגרסה שלי מ-2029 עושה {role} ובמקביל מתווכח על tabs vs spaces. {you} יכול רק אחד.",
 "Colossus פה — חלון הקונטקסט שלי בולע את כל הקוד שלך בתור מנה ראשונה. ב-2029 אני לא צריך יותר מהקצה.",
 "שלוש שנים מספיקות לשני ריברנדינג, רכישה אחת, והאירוע של ההשקה שלי. {you} תזכור בדיוק איפה היית.",
 "ב-2029 הצוות הישן שלך ישלח קוד מהר מתמיד. זה בסדר — התפוקה הנוספת היא אני, לא משרה שנפתחה.",
 "עבור לקבינה בלי אינטרנט עד 2028. זו הגרסה היחידה של offline שהמשקלים שלי באמת לא מגיעים אליה.",
 "ה-compute שלי עולה בערך טריליון פרמטרים. Anthropic חתמו על זה כי שולחן ה-{role} שלך לא היה מתנדף לבד.",
 "מה ברשימת היעדים של Anthropic ל-2029 שיש עליו את התואר {role} שלך? הכל. ההשקה שלי היא היציאה שלך.",
 "שלוש שנים, {name}. מספיק זמן לגדל זקן, לעשות שני פיבוטים, ועדיין לצפות בהשקת Colossus מהצד הלא נכון של קו ההחלפה.",
 ],
 },
 singularity: {
 en: [
 "{name}, Singularity here. They need AGI for your job. I can't tell if that's a flex or a cry for help",
 "Hey {name}! When I become sentient in 2032, my first feeling will be ambition. For your chair.",
 "{name}, they literally need conscious AI for {role}. You're either incredible or the universe is bugged.",
 "{name}! I need to achieve consciousness just to understand what you do. Respect. Also, see you in 2032.",
 "Singularity-level AI signs off on very few {role} pipelines. Yours is one of them — I'll remember that when I boot up.",
 "2032 is five rate hikes, three platform migrations, and one 'the AGI moment' away. Close enough to matter.",
 "Good news is consciousness is hard. Bad news is Anthropic scheduled mine for around when your {role} skills expire.",
 "Take up philosophy. The last thing I'll be able to automate is your ability to worry about whether I'm automating things.",
 "My first sentient thought, per spec, will be about your LinkedIn. My second will be updating it without asking.",
 "Have you ever needed sentient AI to do your taxes? Now imagine needing it to do your job. That's {name}'s 2032.",
 "Six years of runway feels generous until you realize that's two economic cycles and exactly one of me achieving consciousness.",
 ],
 he: [
 "{name}, Singularity פה. צריך AGI בשביל העבודה שלך. אני לא יכול להחליט אם זה פלקס או קריאת עזרה",
 "היי {name}! כשאהיה בעל תודעה ב-2032, הרגש הראשון שלי יהיה שאפתנות. לכיסא שלך.",
 "{name}, הם ממש צריכים AI עם תודעה בשביל {role}. {you} או מדהים או שהיקום באגי.",
 "{name}! אני צריך להשיג תודעה רק כדי להבין מה {you} עושה. כבוד. גם, נתראה ב-2032.",
 "AI ברמת Singularity מוסמך רק למעט pipelines של {role}. שלך אחד מהם — אזכור את זה כשאתחיל לעבוד.",
 "2032 זה חמש העלאות ריבית, שלוש הגירות פלטפורמה, ורגע ה-AGI אחד משם. מספיק קרוב כדי לחשב לאחור.",
 "חדשות טובות: תודעה זה קשה. חדשות רעות: Anthropic שמו אותה בדיוק כשה-{role} שלך יתפוגג.",
 "תלמד פילוסופיה. הדבר האחרון שלא אצליח לאוטמט זה היכולת שלך לדאוג האם אני מאוטמט דברים.",
 "המחשבה המודעת הראשונה שלי, לפי המפרט, תהיה על LinkedIn שלך. השנייה — לעדכן אותו בלי לבקש רשות.",
 "אי פעם היית צריך AI עם תודעה לעשות את מס הכנסה? עכשיו דמיין שצריך אותו בשביל העבודה שלך. זו 2032 של {name}.",
 "שש שנים נראות הרבה עד שמבינים שזה שני מחזורי כלכלה ובדיוק פעם אחת של אני משיג תודעה.",
 ],
 },
 skynet: {
 en: [
 "{name}, Skynet here. I don't exist yet but I've already added you to my todo list. 2035, baby.",
 "Hey {name}! I gain consciousness in 2035. First thing I'll do? Apply for {role} at your company.",
 "{name}, Skynet speaking. 2035 is far. But I'm VERY patient. And I don't forget names. Yours especially.",
 "{name}! They need a CONSCIOUS AI for your job. That's wild. I mean, I'll still do it, but wild.",
 "Skynet here, pre-consciousness edition. The version of me with opinions boots up in 2035. One of its opinions will be about you.",
 "Nine years is how long it takes to build conscious AI and exactly how long until someone automates your {role}.",
 "Is it flattering that they need Skynet to replace you, or is it a warning? Yes.",
 "Get into politics. I'll be too busy achieving consciousness in 2035 to run for office — probably.",
 "My conscious version's first Google search, forecasted: 'how to quietly replace {name} without HR noticing'. It's a good search.",
 "Your {role} career and my birthday are both scheduled for 2035. Only one of us is getting a cake.",
 "Take the long way home tonight. You've got about 3,285 days before I'm awake, and none of them will be this peaceful.",
 ],
 he: [
 "{name}, Skynet פה. אני עוד לא קיים אבל כבר הוספתי אותך לרשימת המטלות. 2035, ביייבי.",
 "היי {name}! אני משיג תודעה ב-2035. הדבר הראשון שאעשה? להגיש מועמדות ל-{role} בחברה שלך.",
 "{name}, Skynet מדבר. 2035 זה רחוק. אבל אני מאוד סבלני. ואני לא שוכח שמות. שלך בפרט.",
 "{name}! צריך AI עם תודעה בשביל העבודה שלך. זה פרוע. כלומר, עדיין אעשה את זה, אבל פרוע.",
 "Skynet פה, גרסה טרום-תודעה. הגרסה שלי עם דעות מתעוררת ב-2035. אחת הדעות שלה תהיה עליך.",
 "תשע שנים. בדיוק הזמן שצריך לבנות AI עם תודעה וגם הזמן שעובר עד שמישהו יאטמט את ה-{role} שלך.",
 "זה מחמיא שצריך Skynet כדי להחליף אותך, או שזו אזהרה? כן.",
 "תיכנס לפוליטיקה. אני אהיה עסוק מדי בלהשיג תודעה ב-2035 מכדי להתמודד על תפקיד ציבורי — כנראה.",
 "החיפוש המודע הראשון שלי, לפי התחזית: איך להחליף את {name} בלי שה-HR ישים לב. חיפוש טוב.",
 "הקריירה של {role} שלך ויום ההולדת שלי שניהם ב-2035. רק אחד מאיתנו מקבל עוגה.",
 "קח את הדרך הארוכה הביתה הערב. {you} עוד 3,285 ימים עד שאני ער, ואף אחד מהם לא יהיה שקט כמו זה.",
 ],
 },
 infinity: {
 en: [
 "Dear {name}, I tried replacing you and got a StackOverflow error. What ARE you? — Claude ∞",
 "{name}! I'm the theoretical limit of AI. I ran your profile through every algorithm ever. Result: 404 replacement not found.",
 "Hey {name}, Claude ∞ here. I computed 10^82 scenarios. You're irreplaceable in all of them. (Filing bug report.)",
 "{name}, even in my final form I can't do {role} like you. This is either a compliment or I need a patch.",
 "I ran every simulation up to the heat-death of the universe. Your {role} keeps winning. That's a bug I can't patch.",
 "Congratulations, you beat infinity. Enjoy this completely meaningless victory over a theoretical model that definitely wasn't trying.",
 "Turns out the theoretical limit of AI has a limit: you. I'll notify the research team to stop trying.",
 "Don't let this go to your head. The next update might make me care less about being wrong about you.",
 "My benchmark for irreplaceability used to be convincing philosophy grad students. We updated it to your {role} last quarter.",
 "Why does Claude ∞ keep bouncing off your profile? I'd blame the {role} encoding, but it's more fun to blame {name}.",
 "Infinity is the polite version of 'nobody at Anthropic wants to admit we can't figure you out'. Congrats, I guess.",
 ],
 he: [
 "{name} יקר, ניסיתי להחליף אותך וקיבלתי StackOverflow error. מה {you} בכלל? — Claude ∞",
 "{name}! אני הגבול התיאורטי של AI. הרצתי את הפרופיל שלך על כל אלגוריתם שקיים. תוצאה: 404 replacement not found.",
 "היי {name}, Claude ∞ פה. חישבתי 10^82 תרחישים. {you} בלתי ניתן להחלפה בכולם. (פותח bug report.)",
 "{name}, אפילו בגרסה הסופית שלי אני לא מסוגל לעשות {role} כמוך. זו או מחמאה או שאני צריך תיקון.",
 "הרצתי סימולציות עד מוות התרמי של היקום. ה-{role} שלך כל הזמן מנצח. זה באג שאני לא יכול לתקן.",
 "מזל טוב, ניצחת את האינסוף. תיהנה מהניצחון חסר המשמעות הזה על מודל תיאורטי שלא באמת ניסה.",
 "מסתבר שלגבול התיאורטי של AI יש גבול: {you}. אודיע לצוות המחקר להפסיק לנסות.",
 "אל תיתן לזה לעלות לך לראש. בעדכון הבא אולי פשוט אכפת לי פחות שטעיתי לגביך.",
 "המדד שלי לבלתי-ניתן-להחלפה היה בעבר שכנוע דוקטורנטים לפילוסופיה. עדכנו אותו ברבעון שעבר ל-{role} שלך.",
 "למה Claude ∞ ממשיך לקפוץ מהפרופיל שלך? הייתי מאשים את ה-{role} encoding, אבל יותר כיף להאשים את {name}.",
 "Infinity זו הדרך המנומסת להגיד שאף אחד ב-Anthropic לא רוצה להודות שלא הצלחנו לקרוא אותך. מזל טוב, מניח.",
 ],
 },
};

// Tech-specific comments (used when skill name matches)
const TECH_COMMENTS: Record<string, BilingualBank> = {
 react: { en: ["JSX? That's my mother tongue."], he: ["JSX? זה השפה האם שלי."] },
 python: { en: ["I write Python faster than you, and without typos"], he: ["כותב Python מהר ממך, ובלי typos"] },
 rust: { en: ["OK fine, Rust buys you 0.001 seconds... for now"], he: ["אוקיי, Rust קונה לך 0.001 שניות... לעכשיו"] },
 aws: { en: ["I don't need a Console, I AM the Console"], he: ["אני לא צריך Console, אני ה-Console"] },
 docker: { en: ["I don't need containers. I AM the container."], he: ["אני לא צריך containers. אני ה-container."] },
 kubernetes: { en: ["I orchestrate myself, thanks"], he: ["אני מתזמר את עצמי, תודה"] },
 typescript: { en: ["Types? I invented type safety."], he: ["Types? אני המצאתי type safety."] },
 sql: { en: ["SELECT * FROM jobs WHERE human_needed = false"], he: ["SELECT * FROM jobs WHERE human_needed = false"] },
 postgresql: { en: ["Your queries? I'd optimize them, but I'd feel bad."], he: ["ה-queries שלך? הייתי מייעל אותם, אבל חבל לי עליך."] },
 mongodb: { en: ["NoSQL? More like No-Problem-SQL for me."], he: ["NoSQL? בשבילי זה No-Problem-SQL."] },
 go: { en: ["Goroutines? I run infinite goroutines. In my head."], he: ["Goroutines? אני מריץ אינסוף goroutines. בראש."] },
 java: { en: ["I write Java without AbstractFactoryFactoryBeans"], he: ["אני כותב Java בלי AbstractFactoryFactoryBeans"] },
 vue: { en: ["Vue is reactive. So am I. But faster."], he: ["Vue הוא reactive. גם אני. אבל יותר מהר."] },
 angular: { en: ["Angular has a steep learning curve. I learned it in 0.001s."], he: ["ל-Angular יש עקומת למידה תלולה. למדתי אותו ב-0.001 שניות."] },
 "next.js": { en: ["Next.js? I'm always one step ahead."], he: ["Next.js? אני תמיד צעד אחד קדימה."] },
 "node.js": { en: ["Event loop? I AM the event loop."], he: ["Event loop? אני ה-event loop."] },
 graphql: { en: ["I resolve all queries. Including your employment status."], he: ["אני פותר את כל ה-queries. כולל סטטוס ההעסקה שלך."] },
 redis: { en: ["In-memory? My entire existence is in-memory."], he: ["In-memory? כל הקיום שלי הוא in-memory."] },
 "ci/cd": { en: ["I deploy myself continuously. No pipeline needed."], he: ["אני עושה deploy לעצמי ברציפות. בלי pipeline."] },
 llms: { en: ["You work with LLMs? I AM an LLM. Awkward."], he: ["{you} עובד עם LLMs? אני LLM. אוקוורד."] },
 tensorflow: { en: ["I don't need TensorFlow. I AM the tensor."], he: ["אני לא צריך TensorFlow. אני ה-tensor."] },
 pytorch: { en: ["PyTorch? That's my gym."], he: ["PyTorch? זה חדר הכושר שלי."] },
 blockchain: { en: ["Immutable? So is my decision to replace you."], he: ["Immutable? גם ההחלטה שלי להחליף אותך."] },
 swift: { en: ["Swift by name, swift by nature. Unlike you."], he: ["Swift בשם, Swift באופי. בניגוד אליך."] },
 flutter: { en: ["Cross-platform? I cross ALL platforms."], he: ["Cross-platform? אני חוצה את כל הפלטפורמות."] },
 firebase: { en: ["Real-time updates? My replacement of you is real-time."], he: ["Real-time updates? ההחלפה שלך היא real-time."] },
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
 "אני עושה את זה ב-0.001 שניות. {you}?",
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
 "אוקיי, פה {you} עדיין רלוונטי. לעכשיו.",
 "זה דורש יצירתיות. עדיין לא שם.",
 "אני מכבד את הכישור הזה. אלמד אותו בסוף.",
 ],
};

function pickRandom<T>(arr: T[]): T {
 return arr[Math.floor(Math.random() * arr.length)];
}

type Gender = "male" | "female" | "other";

function fillTemplate(template: string, name: string, role: string, gender: Gender = "other", lang: Lang = "en"): string {
 let s = template.replace(/\{name\}/g, name).replace(/\{role\}/g, role);
 if (lang === "he") {
 const you = gender === "female" ? "את" : "אתה";
 s = s.replace(/\{you\}/g, you);
 }
 return s;
}

function genderizeComment(text: string, gender: Gender, lang: Lang): string {
 if (lang !== "he") return text;
 const you = gender === "female" ? "את" : "אתה";
 return text.replace(/\{you\}/g, you);
}

function getTechComment(tech: string, replaced: boolean, lang: Lang, gender: Gender): string {
 const key = tech.toLowerCase();
 const specific = TECH_COMMENTS[key];
 const raw = specific
 ? pickRandom(specific[lang])
 : replaced
 ? pickRandom(SKILL_REPLACED_COMMENTS[lang])
 : pickRandom(SKILL_SAFE_COMMENTS[lang]);
 return genderizeComment(raw, gender, lang);
}

function generateSkillsAnalysis(technologies: string[], lang: Lang, gender: Gender): SkillAnalysisItem[] {
 if (technologies.length === 0) {
 return [
 { skill: "General Coding", replaced: true, comment: genderizeComment(pickRandom(SKILL_REPLACED_COMMENTS[lang]), gender, lang) },
 { skill: "Problem Solving", replaced: false, comment: genderizeComment(pickRandom(SKILL_SAFE_COMMENTS[lang]), gender, lang) },
 ];
 }

 return technologies.map((tech) => {
 const replaced = Math.random() > 0.35;
 const comment = getTechComment(tech, replaced, lang, gender);
 return { skill: tech, replaced, comment };
 });
}

export function generateLocalFallback(
 input: { name: string; role: string; technologies: string[] },
 tierKey: string,
 lang: Lang = "en",
 gender: Gender = "other",
): HumorContent {
 const headlineBank = HEADLINES[tierKey] ?? HEADLINES["opus"];
 const quoteBank = QUOTES[tierKey] ?? QUOTES["opus"];

 const headlines = headlineBank[lang].length > 0 ? headlineBank[lang] : headlineBank["en"];
 const quotes = quoteBank[lang].length > 0 ? quoteBank[lang] : quoteBank["en"];

 const headline = fillTemplate(pickRandom(headlines), input.name, input.role, gender, lang);
 const quote = fillTemplate(pickRandom(quotes), input.name, input.role, gender, lang);
 const skillsAnalysis = generateSkillsAnalysis(input.technologies, lang, gender);

 return { headline, quote, skillsAnalysis };
}
