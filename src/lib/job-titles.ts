export interface JobDefinition {
  title: string;
  category: string;
  aliases?: string[];
  skills?: string[];
}

export const JOB_CATEGORIES = [
  "Technology & Engineering",
  "Healthcare & Medical",
  "Education & Teaching",
  "Finance & Accounting",
  "Legal",
  "Sales & Business",
  "Marketing & Communications",
  "Human Resources",
  "Operations & Logistics",
  "Creative & Design",
  "Hospitality & Food Service",
  "Trades & Construction",
  "Science & Research",
  "Government & Public Service",
  "Retail & Customer Service",
  "Manufacturing & Production",
  "Real Estate",
  "Social Services & Nonprofit",
  "Arts & Entertainment",
  "Sports & Fitness",
  "Administrative & Office",
  "Aviation & Transportation",
  "Agriculture & Environment",
  "Media & Journalism",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const JOB_DEFINITIONS: JobDefinition[] = [
  // Technology & Engineering
  { title: "Software Engineer", category: "Technology & Engineering", aliases: ["software developer", "programmer", "coding engineer"] },
  { title: "Full Stack Developer", category: "Technology & Engineering" },
  { title: "Frontend Developer", category: "Technology & Engineering", aliases: ["front-end developer", "front end developer"] },
  { title: "Backend Developer", category: "Technology & Engineering", aliases: ["back-end developer", "back end developer"] },
  { title: "Data Scientist", category: "Technology & Engineering" },
  { title: "Data Analyst", category: "Technology & Engineering", aliases: ["business intelligence analyst", "bi analyst"] },
  { title: "Machine Learning Engineer", category: "Technology & Engineering", aliases: ["ml engineer", "ai engineer"] },
  { title: "DevOps Engineer", category: "Technology & Engineering", aliases: ["site reliability engineer", "sre", "platform engineer"] },
  { title: "Cloud Architect", category: "Technology & Engineering", aliases: ["cloud engineer", "solutions architect"] },
  { title: "Cybersecurity Analyst", category: "Technology & Engineering", aliases: ["security analyst", "information security analyst"] },
  { title: "Network Engineer", category: "Technology & Engineering" },
  { title: "Systems Administrator", category: "Technology & Engineering", aliases: ["sysadmin", "it administrator"] },
  { title: "Database Administrator", category: "Technology & Engineering", aliases: ["dba"] },
  { title: "QA Engineer", category: "Technology & Engineering", aliases: ["quality assurance engineer", "test engineer", "sdet"] },
  { title: "Product Manager", category: "Technology & Engineering", aliases: ["technical product manager", "product owner"] },
  { title: "Scrum Master", category: "Technology & Engineering" },
  { title: "IT Support Specialist", category: "Technology & Engineering", aliases: ["help desk technician", "it technician"] },
  { title: "Mobile Developer", category: "Technology & Engineering", aliases: ["ios developer", "android developer"] },
  { title: "Web Developer", category: "Technology & Engineering" },

  // Healthcare & Medical
  { title: "Registered Nurse", category: "Healthcare & Medical", aliases: ["rn", "staff nurse", "clinical nurse"] },
  { title: "Nurse Practitioner", category: "Healthcare & Medical", aliases: ["np", "advanced practice nurse"] },
  { title: "Physician", category: "Healthcare & Medical", aliases: ["medical doctor", "md", "doctor of medicine"] },
  { title: "Medical Assistant", category: "Healthcare & Medical" },
  { title: "Pharmacist", category: "Healthcare & Medical" },
  { title: "Physical Therapist", category: "Healthcare & Medical", aliases: ["pt", "physiotherapist"] },
  { title: "Occupational Therapist", category: "Healthcare & Medical", aliases: ["ot"] },
  { title: "Dental Hygienist", category: "Healthcare & Medical" },
  { title: "Dentist", category: "Healthcare & Medical" },
  { title: "Surgeon", category: "Healthcare & Medical" },
  { title: "Radiologic Technologist", category: "Healthcare & Medical", aliases: ["x-ray technologist", "rad tech"] },
  { title: "Medical Laboratory Technician", category: "Healthcare & Medical", aliases: ["lab technician", "mlt"] },
  { title: "Healthcare Administrator", category: "Healthcare & Medical", aliases: ["hospital administrator", "health services manager"] },
  { title: "EMT", category: "Healthcare & Medical", aliases: ["emergency medical technician", "paramedic"] },
  { title: "Mental Health Counselor", category: "Healthcare & Medical", aliases: ["therapist", "clinical counselor", "psychotherapist"] },
  { title: "Social Worker", category: "Social Services & Nonprofit", aliases: ["clinical social worker", "lcsw"] },
  { title: "Caregiver", category: "Healthcare & Medical", aliases: ["home health aide", "personal care aide"] },

  // Education & Teaching
  { title: "Teacher", category: "Education & Teaching", aliases: ["classroom teacher", "school teacher"] },
  { title: "High School Teacher", category: "Education & Teaching", aliases: ["secondary school teacher"] },
  { title: "Elementary School Teacher", category: "Education & Teaching", aliases: ["primary school teacher"] },
  { title: "Professor", category: "Education & Teaching", aliases: ["university professor", "lecturer", "adjunct professor"] },
  { title: "School Principal", category: "Education & Teaching", aliases: ["headmaster", "head of school"] },
  { title: "Teaching Assistant", category: "Education & Teaching", aliases: ["teacher aide", "paraprofessional"] },
  { title: "Special Education Teacher", category: "Education & Teaching", aliases: ["sped teacher"] },
  { title: "Tutor", category: "Education & Teaching", aliases: ["private tutor", "academic tutor"] },
  { title: "Instructional Designer", category: "Education & Teaching", aliases: ["e-learning developer", "curriculum designer"] },
  { title: "School Counselor", category: "Education & Teaching", aliases: ["guidance counselor"] },

  // Finance & Accounting
  { title: "Accountant", category: "Finance & Accounting", aliases: ["staff accountant", "general accountant"] },
  { title: "Financial Analyst", category: "Finance & Accounting" },
  { title: "Investment Banker", category: "Finance & Accounting" },
  { title: "Auditor", category: "Finance & Accounting", aliases: ["internal auditor", "external auditor"] },
  { title: "Bookkeeper", category: "Finance & Accounting" },
  { title: "Controller", category: "Finance & Accounting", aliases: ["financial controller"] },
  { title: "CFO", category: "Finance & Accounting", aliases: ["chief financial officer"] },
  { title: "Tax Preparer", category: "Finance & Accounting", aliases: ["tax accountant", "tax specialist"] },
  { title: "Loan Officer", category: "Finance & Accounting" },
  { title: "Insurance Agent", category: "Finance & Accounting", aliases: ["insurance broker", "insurance sales agent"] },
  { title: "Bank Teller", category: "Finance & Accounting" },

  // Legal
  { title: "Lawyer", category: "Legal", aliases: ["attorney", "legal counsel", "solicitor"] },
  { title: "Paralegal", category: "Legal", aliases: ["legal assistant", "legal secretary"] },
  { title: "Legal Assistant", category: "Legal" },
  { title: "Judge", category: "Legal" },
  { title: "Compliance Officer", category: "Legal", aliases: ["regulatory compliance specialist"] },

  // Sales & Business
  { title: "Sales Representative", category: "Sales & Business", aliases: ["sales rep", "sales associate", "account executive"] },
  { title: "Sales Manager", category: "Sales & Business" },
  { title: "Business Development Manager", category: "Sales & Business", aliases: ["bd manager", "business development representative"] },
  { title: "Account Manager", category: "Sales & Business", aliases: ["client relationship manager", "key account manager"] },
  { title: "Real Estate Agent", category: "Real Estate", aliases: ["realtor", "real estate broker"] },
  { title: "Store Manager", category: "Retail & Customer Service", aliases: ["retail manager", "shop manager"] },
  { title: "Business Analyst", category: "Sales & Business" },
  { title: "Management Consultant", category: "Sales & Business", aliases: ["strategy consultant", "consultant"] },
  { title: "Entrepreneur", category: "Sales & Business", aliases: ["founder", "co-founder", "business owner"] },
  { title: "CEO", category: "Sales & Business", aliases: ["chief executive officer", "managing director"] },

  // Marketing & Communications
  { title: "Marketing Manager", category: "Marketing & Communications" },
  { title: "Digital Marketing Specialist", category: "Marketing & Communications", aliases: ["digital marketer", "online marketing specialist"] },
  { title: "Content Writer", category: "Marketing & Communications", aliases: ["copywriter", "content creator", "technical writer"] },
  { title: "Public Relations Specialist", category: "Marketing & Communications", aliases: ["pr specialist", "communications specialist"] },
  { title: "SEO Specialist", category: "Marketing & Communications", aliases: ["seo manager", "search engine optimization"] },
  { title: "Brand Manager", category: "Marketing & Communications" },
  { title: "Social Media Manager", category: "Marketing & Communications", aliases: ["social media specialist"] },

  // Human Resources
  { title: "HR Manager", category: "Human Resources", aliases: ["human resources manager", "people operations manager"] },
  { title: "Recruiter", category: "Human Resources", aliases: ["talent acquisition specialist", "headhunter", "staffing specialist"] },
  { title: "HR Generalist", category: "Human Resources", aliases: ["human resources generalist", "hr coordinator"] },
  { title: "Training Specialist", category: "Human Resources", aliases: ["corporate trainer", "learning and development specialist"] },

  // Operations & Logistics
  { title: "Project Manager", category: "Operations & Logistics" },
  { title: "Operations Manager", category: "Operations & Logistics", aliases: ["ops manager"] },
  { title: "Supply Chain Manager", category: "Operations & Logistics", aliases: ["logistics manager", "supply chain analyst"] },
  { title: "Warehouse Manager", category: "Operations & Logistics", aliases: ["warehouse supervisor", "distribution manager"] },
  { title: "Procurement Specialist", category: "Operations & Logistics", aliases: ["buyer", "purchasing agent"] },
  { title: "Logistics Coordinator", category: "Operations & Logistics", aliases: ["shipping coordinator", "freight coordinator"] },
  { title: "Truck Driver", category: "Aviation & Transportation", aliases: ["delivery driver", "cdl driver", "commercial driver"] },

  // Creative & Design
  { title: "Graphic Designer", category: "Creative & Design" },
  { title: "UX Designer", category: "Creative & Design", aliases: ["user experience designer", "ux/ui designer"] },
  { title: "UI Designer", category: "Creative & Design", aliases: ["user interface designer"] },
  { title: "Interior Designer", category: "Creative & Design" },
  { title: "Fashion Designer", category: "Creative & Design" },
  { title: "Photographer", category: "Creative & Design" },
  { title: "Video Editor", category: "Creative & Design", aliases: ["film editor", "multimedia editor"] },
  { title: "Animator", category: "Creative & Design", aliases: ["3d animator", "motion graphics artist"] },
  { title: "Architect", category: "Creative & Design", aliases: ["building architect", "design architect"] },

  // Hospitality & Food Service
  { title: "Chef", category: "Hospitality & Food Service", aliases: ["head chef", "executive chef", "sous chef", "line cook", "cook"] },
  { title: "Restaurant Manager", category: "Hospitality & Food Service", aliases: ["food service manager"] },
  { title: "Hotel Manager", category: "Hospitality & Food Service", aliases: ["hospitality manager", "front desk manager"] },
  { title: "Bartender", category: "Hospitality & Food Service" },
  { title: "Waiter", category: "Hospitality & Food Service", aliases: ["waitress", "server", "food server"] },
  { title: "Barista", category: "Hospitality & Food Service" },
  { title: "Event Planner", category: "Hospitality & Food Service", aliases: ["event coordinator", "wedding planner"] },

  // Trades & Construction
  { title: "Electrician", category: "Trades & Construction" },
  { title: "Plumber", category: "Trades & Construction" },
  { title: "Carpenter", category: "Trades & Construction" },
  { title: "Construction Manager", category: "Trades & Construction", aliases: ["site manager", "construction supervisor"] },
  { title: "Mechanical Engineer", category: "Trades & Construction" },
  { title: "Civil Engineer", category: "Trades & Construction" },
  { title: "Welder", category: "Trades & Construction" },
  { title: "HVAC Technician", category: "Trades & Construction", aliases: ["hvac installer", "heating and cooling technician"] },
  { title: "General Contractor", category: "Trades & Construction" },

  // Science & Research
  { title: "Research Scientist", category: "Science & Research", aliases: ["scientist", "laboratory scientist"] },
  { title: "Lab Technician", category: "Science & Research", aliases: ["laboratory technician", "research assistant"] },
  { title: "Biologist", category: "Science & Research" },
  { title: "Chemist", category: "Science & Research", aliases: ["analytical chemist", "research chemist"] },
  { title: "Environmental Scientist", category: "Science & Research", aliases: ["environmental consultant"] },

  // Government & Public Service
  { title: "Police Officer", category: "Government & Public Service", aliases: ["law enforcement officer", "detective", "sheriff"] },
  { title: "Firefighter", category: "Government & Public Service" },
  { title: "Military Officer", category: "Government & Public Service", aliases: ["army officer", "navy officer", "soldier", "veteran"] },
  { title: "Government Administrator", category: "Government & Public Service", aliases: ["public administrator", "civil servant"] },
  { title: "Urban Planner", category: "Government & Public Service", aliases: ["city planner"] },

  // Retail & Customer Service
  { title: "Cashier", category: "Retail & Customer Service" },
  { title: "Customer Service Representative", category: "Retail & Customer Service", aliases: ["customer support specialist", "call center agent", "customer success representative"] },
  { title: "Retail Sales Associate", category: "Retail & Customer Service", aliases: ["sales associate", "retail associate"] },
  { title: "Receptionist", category: "Administrative & Office", aliases: ["front desk receptionist"] },

  // Manufacturing & Production
  { title: "Production Manager", category: "Manufacturing & Production", aliases: ["manufacturing manager", "plant manager"] },
  { title: "Quality Control Inspector", category: "Manufacturing & Production", aliases: ["qc inspector", "quality inspector"] },
  { title: "Machine Operator", category: "Manufacturing & Production", aliases: ["cnc operator", "factory worker", "assembly line worker"] },
  { title: "Industrial Engineer", category: "Manufacturing & Production" },

  // Arts & Entertainment
  { title: "Actor", category: "Arts & Entertainment", aliases: ["actress", "performer"] },
  { title: "Musician", category: "Arts & Entertainment", aliases: ["singer", "composer", "music producer"] },
  { title: "Artist", category: "Arts & Entertainment", aliases: ["illustrator", "painter", "sculptor"] },

  // Sports & Fitness
  { title: "Personal Trainer", category: "Sports & Fitness", aliases: ["fitness trainer", "fitness coach"] },
  { title: "Athletic Coach", category: "Sports & Fitness", aliases: ["sports coach", "head coach"] },

  // Administrative & Office
  { title: "Administrative Assistant", category: "Administrative & Office", aliases: ["office assistant", "executive assistant", "secretary", "office administrator"] },
  { title: "Office Manager", category: "Administrative & Office" },
  { title: "Data Entry Clerk", category: "Administrative & Office", aliases: ["data entry specialist"] },

  // Aviation & Transportation
  { title: "Pilot", category: "Aviation & Transportation", aliases: ["airline pilot", "commercial pilot", "captain"] },
  { title: "Flight Attendant", category: "Aviation & Transportation" },

  // Agriculture & Environment
  { title: "Farmer", category: "Agriculture & Environment", aliases: ["agricultural worker", "farm manager", "rancher"] },
  { title: "Landscaper", category: "Agriculture & Environment", aliases: ["landscape architect", "groundskeeper", "gardener"] },

  // Media & Journalism
  { title: "Journalist", category: "Media & Journalism", aliases: ["reporter", "news correspondent", "editor"] },
  { title: "Broadcast Producer", category: "Media & Journalism", aliases: ["tv producer", "radio producer"] },
];

const TITLE_SUFFIXES =
  "engineer|developer|manager|analyst|designer|architect|consultant|director|specialist|coordinator|administrator|assistant|technician|officer|representative|supervisor|executive|agent|nurse|doctor|physician|teacher|professor|lawyer|attorney|accountant|chef|cook|driver|writer|editor|scientist|researcher|therapist|counselor|trainer|coach|planner|broker|auditor|pharmacist|dentist|surgeon|mechanic|operator|inspector|architect|designer|artist|musician|actor|farmer|pilot|firefighter|paramedic|recruiter|bookkeeper|paralegal|receptionist|cashier|bartender|barista|waiter|server|welder|electrician|plumber|carpenter|contractor|programmer|administrator";

const EXPERIENCE_TITLE_PATTERN = new RegExp(
  `(?:^|\\n)\\s*(?:[A-Z][a-z]+\\s+){0,3}(?:${TITLE_SUFFIXES})(?:\\s+(?:I|II|III|IV|V))?\\s*(?:[|@–\\-—,]|\\bat\\b|\\n)`,
  "i"
);

const ROLE_LINE_PATTERN = new RegExp(
  `^\\s*((?:senior|junior|lead|staff|principal|chief|head|associate|assistant|executive|regional|national|global|local)\\s+)?([A-Za-z][A-Za-z\\s/&-]{2,40}(?:${TITLE_SUFFIXES})(?:\\s+(?:I|II|III|IV|V))?)\\s*(?:[|@–\\-—,]|\\bat\\b|$)`,
  "im"
);

export interface JobDetectionResult {
  jobTitle: string;
  jobCategory: JobCategory | "General";
  confidence: "high" | "medium" | "low";
  matchedFrom: "experience" | "headline" | "dictionary" | "pattern" | "inferred";
}

function titleCase(str: string): string {
  return str
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w.length <= 3 && !["CEO", "CFO", "CTO", "CIO", "VP", "HR", "RN", "NP", "EMT"].includes(w.toUpperCase())
      ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      : w.toUpperCase() === w ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

interface MatchCandidate {
  title: string;
  category: JobCategory | "General";
  source: JobDetectionResult["matchedFrom"];
  score: number;
}

function buildSearchTerms(def: JobDefinition): string[] {
  return [def.title, ...(def.aliases ?? [])].map(normalizeForMatch);
}

function scoreDictionaryMatch(term: string, text: string, source: JobDetectionResult["matchedFrom"]): number {
  const normalized = normalizeForMatch(text);
  if (!normalized.includes(term)) return 0;

  let score = term.length;
  if (source === "experience") score += 50;
  if (source === "headline") score += 40;
  if (source === "dictionary") score += 20;

  const wordBoundary = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  if (wordBoundary.test(text)) score += 15;

  return score;
}

function matchDictionary(text: string, source: JobDetectionResult["matchedFrom"]): MatchCandidate | null {
  let best: MatchCandidate | null = null;

  for (const def of JOB_DEFINITIONS) {
    for (const term of buildSearchTerms(def)) {
      const score = scoreDictionaryMatch(term, text, source);
      if (score > 0 && (!best || score > best.score)) {
        best = {
          title: def.title,
          category: def.category as JobCategory,
          source,
          score,
        };
      }
    }
  }

  return best;
}

function extractHeadline(text: string): string | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    if (line.includes("@") || /^\(?\d{3}\)?/.test(line)) continue;
    if (/^(resume|curriculum vitae|cv)$/i.test(line)) continue;
    if (line.split(/\s+/).length >= 2 && line.split(/\s+/).length <= 4 && /^[A-Za-z\s.'-]+$/.test(line)) continue;

    if (line.length >= 5 && line.length <= 70 && !/^(experience|education|skills|summary|profile|objective|work history)/i.test(line)) {
      const roleMatch = ROLE_LINE_PATTERN.exec(line);
      if (roleMatch?.[2]) return roleMatch[2].trim();
      if (/(engineer|manager|nurse|teacher|developer|analyst|designer|chef|driver|lawyer|accountant|consultant|specialist|officer|assistant|technician|coordinator|director|administrator|representative|supervisor|agent|writer|editor|scientist|therapist|trainer|coach|planner|broker|auditor|pharmacist|mechanic|operator|inspector|artist|musician|actor|farmer|pilot|firefighter|paramedic|recruiter|bookkeeper|paralegal|receptionist|cashier|bartender|barista|waiter|server|welder|electrician|plumber|carpenter|contractor|programmer|physician|doctor|surgeon|dentist)/i.test(line)) {
        return line.replace(/\s*[|@–\-—,].*$/, "").trim();
      }
    }
  }

  return null;
}

function extractFromExperience(text: string): string | null {
  const lower = text.toLowerCase();
  const expIndex = ["experience", "employment", "work history", "professional experience", "work experience"]
    .map((k) => lower.indexOf(k))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0];

  const block = expIndex !== undefined ? text.slice(expIndex, expIndex + 1500) : text.slice(0, 1500);
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines.slice(0, 12)) {
    if (/^(experience|employment|work history|professional experience)/i.test(line)) continue;

    const pipeMatch = line.match(/^(.+?)\s*[|@]\s*.+/);
    if (pipeMatch?.[1] && pipeMatch[1].length <= 60) {
      const candidate = pipeMatch[1].trim();
      if (!/^\d{4}/.test(candidate) && candidate.split(/\s+/).length <= 8) return candidate;
    }

    const atMatch = line.match(/^(.+?)\s+at\s+[A-Z]/i);
    if (atMatch?.[1] && atMatch[1].length <= 60) return atMatch[1].trim();

    const roleMatch = ROLE_LINE_PATTERN.exec(line);
    if (roleMatch?.[2]) return roleMatch[2].trim();
  }

  const patternMatch = EXPERIENCE_TITLE_PATTERN.exec(block);
  if (patternMatch) {
    return patternMatch[0].replace(/^[|\n\s@–\-—,]+|[|@–\-—,\n\s]+$/g, "").trim();
  }

  return null;
}

function inferFromCategoryKeywords(text: string): MatchCandidate | null {
  const lower = normalizeForMatch(text);
  const categoryKeywords: { category: JobCategory; keywords: string[]; fallbackTitle: string }[] = [
    { category: "Healthcare & Medical", keywords: ["patient care", "clinical", "hospital", "medical", "nursing", "healthcare"], fallbackTitle: "Healthcare Professional" },
    { category: "Education & Teaching", keywords: ["curriculum", "classroom", "students", "lesson plan", "teaching", "school district"], fallbackTitle: "Educator" },
    { category: "Finance & Accounting", keywords: ["financial statements", "bookkeeping", "audit", "tax return", "accounts payable", "budgeting"], fallbackTitle: "Finance Professional" },
    { category: "Legal", keywords: ["litigation", "legal research", "court", "case management", "contract law"], fallbackTitle: "Legal Professional" },
    { category: "Hospitality & Food Service", keywords: ["menu", "kitchen", "restaurant", "hospitality", "guest service", "food preparation"], fallbackTitle: "Hospitality Professional" },
    { category: "Trades & Construction", keywords: ["construction site", "blueprint", "building codes", "installation", "renovation"], fallbackTitle: "Skilled Trades Professional" },
    { category: "Retail & Customer Service", keywords: ["customer satisfaction", "point of sale", "retail floor", "inventory", "checkout"], fallbackTitle: "Retail Professional" },
    { category: "Manufacturing & Production", keywords: ["assembly line", "production floor", "manufacturing", "quality control", "lean six sigma"], fallbackTitle: "Manufacturing Professional" },
    { category: "Government & Public Service", keywords: ["public safety", "municipal", "government agency", "community service"], fallbackTitle: "Public Service Professional" },
    { category: "Technology & Engineering", keywords: ["software", "programming", "code", "api", "database", "cloud"], fallbackTitle: "Technology Professional" },
    { category: "Marketing & Communications", keywords: ["brand awareness", "campaign", "advertising", "social media", "content strategy"], fallbackTitle: "Marketing Professional" },
    { category: "Operations & Logistics", keywords: ["supply chain", "logistics", "warehouse", "inventory management", "shipping"], fallbackTitle: "Operations Professional" },
    { category: "Creative & Design", keywords: ["portfolio", "creative direction", "visual design", "branding", "photography"], fallbackTitle: "Creative Professional" },
    { category: "Human Resources", keywords: ["talent acquisition", "onboarding", "employee relations", "payroll", "benefits administration"], fallbackTitle: "HR Professional" },
    { category: "Agriculture & Environment", keywords: ["crop", "farm", "harvest", "sustainability", "environmental compliance"], fallbackTitle: "Agriculture Professional" },
    { category: "Aviation & Transportation", keywords: ["flight", "aviation", "fleet", "dispatch", "freight"], fallbackTitle: "Transportation Professional" },
    { category: "Media & Journalism", keywords: ["news", "broadcast", "press release", "media coverage", "journalism"], fallbackTitle: "Media Professional" },
    { category: "Sports & Fitness", keywords: ["fitness", "athletic", "workout", "gym", "sports training"], fallbackTitle: "Fitness Professional" },
    { category: "Arts & Entertainment", keywords: ["performance", "theater", "film production", "entertainment"], fallbackTitle: "Arts Professional" },
    { category: "Real Estate", keywords: ["property listing", "real estate", "home sale", "mortgage", "leasing"], fallbackTitle: "Real Estate Professional" },
    { category: "Social Services & Nonprofit", keywords: ["nonprofit", "community outreach", "case management", "social services", "volunteer"], fallbackTitle: "Social Services Professional" },
    { category: "Administrative & Office", keywords: ["scheduling", "office management", "data entry", "calendar management", "clerical"], fallbackTitle: "Administrative Professional" },
    { category: "Science & Research", keywords: ["laboratory", "research methodology", "hypothesis", "peer-reviewed", "experiment"], fallbackTitle: "Research Professional" },
  ];

  let best: MatchCandidate | null = null;
  for (const entry of categoryKeywords) {
    const hits = entry.keywords.filter((k) => lower.includes(k)).length;
    if (hits > 0 && (!best || hits > best.score)) {
      best = { title: entry.fallbackTitle, category: entry.category, source: "inferred", score: hits };
    }
  }

  return best;
}

export function detectJob(text: string): JobDetectionResult {
  const candidates: MatchCandidate[] = [];

  const experienceLine = extractFromExperience(text);
  if (experienceLine) {
    const dict = matchDictionary(experienceLine, "experience");
    if (dict) candidates.push(dict);
    else candidates.push({ title: titleCase(experienceLine), category: "General", source: "experience", score: 45 });
  }

  const headline = extractHeadline(text);
  if (headline) {
    const dict = matchDictionary(headline, "headline");
    if (dict) candidates.push(dict);
    else candidates.push({ title: titleCase(headline), category: "General", source: "headline", score: 35 });
  }

  const fullDict = matchDictionary(text, "dictionary");
  if (fullDict) candidates.push(fullDict);

  const rolePattern = ROLE_LINE_PATTERN.exec(text);
  if (rolePattern?.[2]) {
    const dict = matchDictionary(rolePattern[2], "pattern");
    if (dict) candidates.push({ ...dict, source: "pattern", score: dict.score + 10 });
    else candidates.push({ title: titleCase(rolePattern[2]), category: "General", source: "pattern", score: 25 });
  }

  const inferred = inferFromCategoryKeywords(text);
  if (inferred) candidates.push(inferred);

  if (candidates.length === 0) {
    return {
      jobTitle: "Professional",
      jobCategory: "General",
      confidence: "low",
      matchedFrom: "inferred",
    };
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  let category = best.category;
  if (category === "General") {
    const def = JOB_DEFINITIONS.find((d) => d.title === best.title);
    if (def) category = def.category as JobCategory;
  }

  const confidence: JobDetectionResult["confidence"] =
    best.score >= 60 ? "high" : best.score >= 35 ? "medium" : "low";

  return {
    jobTitle: best.title,
    jobCategory: category,
    confidence,
    matchedFrom: best.source,
  };
}

export function getSkillsForJob(jobTitle: string, category: string): string[] {
  const def = JOB_DEFINITIONS.find((d) => d.title.toLowerCase() === jobTitle.toLowerCase());
  if (def?.skills) return def.skills;

  const categorySkills: Record<string, string[]> = {
    "Technology & Engineering": ["JavaScript", "Python", "Cloud Computing", "DevOps", "Communication"],
    "Healthcare & Medical": ["Communication", "Leadership", "Project Management", "Data Analysis"],
    "Education & Teaching": ["Communication", "Leadership", "Project Management"],
    "Finance & Accounting": ["Finance", "Data Analysis", "Communication", "Project Management"],
    "Legal": ["Communication", "Leadership", "Project Management"],
    "Sales & Business": ["Sales", "Communication", "Leadership", "Marketing"],
    "Marketing & Communications": ["Marketing", "Communication", "Data Analysis", "Project Management"],
    "Human Resources": ["Communication", "Leadership", "Project Management"],
    "Operations & Logistics": ["Project Management", "Leadership", "Data Analysis", "Communication"],
    "Creative & Design": ["UI/UX Design", "Communication", "Marketing", "Project Management"],
    "Hospitality & Food Service": ["Communication", "Leadership", "Project Management"],
    "Trades & Construction": ["Leadership", "Project Management", "Communication"],
    "Science & Research": ["Data Analysis", "Python", "Communication", "Machine Learning"],
    "Government & Public Service": ["Communication", "Leadership", "Project Management"],
    "Retail & Customer Service": ["Communication", "Sales", "Leadership"],
    "Manufacturing & Production": ["Project Management", "Leadership", "Data Analysis"],
    "Real Estate": ["Sales", "Communication", "Marketing", "Finance"],
    "Social Services & Nonprofit": ["Communication", "Leadership", "Project Management"],
    "Arts & Entertainment": ["Communication", "Marketing", "UI/UX Design"],
    "Sports & Fitness": ["Communication", "Leadership", "Marketing"],
    "Administrative & Office": ["Communication", "Project Management", "Data Analysis"],
    "Aviation & Transportation": ["Communication", "Leadership", "Project Management"],
    "Agriculture & Environment": ["Data Analysis", "Project Management", "Communication"],
    "Media & Journalism": ["Communication", "Marketing", "UI/UX Design"],
  };

  return categorySkills[category] ?? ["Communication", "Leadership", "Project Management", "Data Analysis"];
}

export function getJobDefinitionCount(): number {
  return JOB_DEFINITIONS.length;
}

export function getSupportedCategories(): readonly string[] {
  return JOB_CATEGORIES;
}
