import { analyzeResume } from "./resume-analyzer";
import type { BenchmarkComparison, BenchmarkResumeType } from "./types";

export const BENCHMARK_RESUMES: BenchmarkResumeType[] = [
  {
    id: "entry-level",
    name: "Entry-Level Graduate",
    description: "Recent graduate with internships, academic projects, and foundational skills.",
    category: "experience",
    sampleText: `Alex Rivera
alex.rivera@email.com | (555) 123-4567 | linkedin.com/in/alexrivera

PROFESSIONAL SUMMARY
Motivated Computer Science graduate with internship experience in full-stack development. Passionate about building scalable web applications and eager to contribute to innovative engineering teams.

EDUCATION
Bachelor of Science in Computer Science
State University | GPA: 3.7 | 2024

SKILLS
Technical: JavaScript, Python, React, Node.js, SQL, Git
Soft Skills: Communication, Teamwork, Problem Solving

EXPERIENCE
Software Engineering Intern | TechStart Inc. | Summer 2023
- Developed REST API endpoints serving 10,000+ daily users using Node.js and PostgreSQL
- Collaborated with a team of 5 engineers in an Agile environment
- Reduced page load time by 25% through frontend optimization

PROJECTS
Career Tracker App | React, Firebase
- Built a full-stack job application tracker used by 200+ students

CERTIFICATIONS
AWS Cloud Practitioner | 2024`,
  },
  {
    id: "mid-career",
    name: "Mid-Career Professional",
    description: "5–8 years of experience with quantified achievements and leadership exposure.",
    category: "experience",
    sampleText: `Jordan Kim
jordan.kim@email.com | (555) 234-5678 | linkedin.com/in/jordankim

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 6 years of experience building high-performance web applications. Proven track record of delivering features that increased user engagement by 40%.

WORK EXPERIENCE
Senior Software Engineer | CloudScale Corp | 2021 – Present
- Led development of microservices architecture serving 2M+ monthly active users
- Managed a team of 4 engineers, improving sprint velocity by 35%
- Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes

Software Engineer | DataFlow Systems | 2018 – 2021
- Developed React dashboards used by 500+ enterprise clients
- Optimized database queries, reducing API response time by 60%
- Achieved 95% test coverage across critical application modules

EDUCATION
B.S. Computer Science | Tech Institute | 2018

SKILLS
JavaScript, TypeScript, Python, React, Node.js, AWS, Docker, Kubernetes, Agile, Leadership

CERTIFICATIONS
AWS Solutions Architect Associate | 2022`,
  },
  {
    id: "senior-executive",
    name: "Senior / Executive",
    description: "10+ years with strategic impact, P&L ownership, and executive presence.",
    category: "experience",
    sampleText: `Morgan Chen
morgan.chen@email.com | (555) 345-6789 | linkedin.com/in/morganchen

EXECUTIVE SUMMARY
Technology executive with 15+ years driving digital transformation and scaling engineering organizations from 20 to 200+ engineers. Delivered $50M+ in revenue growth through platform modernization.

PROFESSIONAL EXPERIENCE
VP of Engineering | Enterprise SaaS Co. | 2019 – Present
- Scaled engineering org from 45 to 180 engineers across 6 product teams
- Led cloud migration saving $3.2M annually in infrastructure costs
- Drove 99.99% uptime SLA across mission-critical platform serving Fortune 500 clients

Director of Engineering | GrowthTech | 2014 – 2019
- Increased platform throughput by 300% while reducing operational costs by 40%
- Built and mentored high-performing engineering leadership team of 12 managers
- Launched 4 product lines generating $25M in annual recurring revenue

EDUCATION
M.S. Computer Science | Stanford University | 2009
B.S. Electrical Engineering | MIT | 2007

SKILLS
Leadership, Strategy, Cloud Computing, DevOps, Project Management, Communication, P&L Management

CERTIFICATIONS
PMP | AWS Solutions Architect Professional`,
  },
  {
    id: "technical-specialist",
    name: "Technical Specialist",
    description: "Deep domain expertise in engineering, data, or infrastructure roles.",
    category: "industry",
    sampleText: `Sam Patel
sam.patel@email.com | (555) 456-7890 | linkedin.com/in/sampatel

PROFESSIONAL SUMMARY
Staff Machine Learning Engineer specializing in NLP and recommendation systems. 8 years building production ML pipelines processing 500M+ events daily.

EXPERIENCE
Staff ML Engineer | AI Platform Inc. | 2020 – Present
- Architected real-time recommendation engine increasing click-through rate by 22%
- Built ML pipeline on Kubernetes reducing model training time by 70%
- Led migration to feature store architecture supporting 50+ production models

ML Engineer | DataCorp | 2016 – 2020
- Developed fraud detection model reducing false positives by 45%
- Implemented A/B testing framework used across 12 product teams

EDUCATION
M.S. Machine Learning | Carnegie Mellon | 2016

SKILLS
Python, Machine Learning, TensorFlow, PyTorch, AWS, Kubernetes, Docker, SQL, Data Analysis

CERTIFICATIONS
Google Professional ML Engineer | 2023`,
  },
  {
    id: "career-changer",
    name: "Career Changer",
    description: "Transitioning industries with transferable skills highlighted prominently.",
    category: "style",
    sampleText: `Taylor Brooks
taylor.brooks@email.com | (555) 567-8901 | linkedin.com/in/taylorbrooks

PROFESSIONAL SUMMARY
Former marketing manager transitioning to Product Management. 7 years of experience driving cross-functional projects, user research, and data-informed decision making. Completed Product Management certification.

EXPERIENCE
Product Management Fellow | Product School | 2024
- Led end-to-end product discovery for B2B SaaS prototype
- Conducted 30+ user interviews and defined MVP roadmap

Marketing Manager | BrandCo | 2019 – 2024
- Managed $2M annual marketing budget with 150% ROI
- Led cross-functional team of 8 across design, engineering, and sales
- Increased lead conversion by 35% through data-driven campaign optimization

Marketing Coordinator | AdAgency | 2017 – 2019
- Developed content marketing strategy reaching 100K+ monthly impressions

EDUCATION
B.A. Business Administration | State College | 2017
Product Management Certificate | Product School | 2024

SKILLS
Project Management, Communication, Data Analysis, Leadership, Agile, User Research`,
  },
  {
    id: "creative-portfolio",
    name: "Creative / Design",
    description: "Portfolio-driven resume emphasizing visual work and creative impact.",
    category: "industry",
    sampleText: `Riley Santos
riley.santos@email.com | (555) 678-9012 | linkedin.com/in/rileysantos | rileysantos.design

PROFESSIONAL SUMMARY
Senior UX Designer with 5 years crafting intuitive digital experiences for fintech and healthcare products. Increased user task completion rates by 40% through research-driven design.

EXPERIENCE
Senior UX Designer | FinTech Labs | 2021 – Present
- Redesigned onboarding flow reducing drop-off rate by 55%
- Led design system adoption across 3 product teams using Figma
- Conducted usability testing with 200+ participants informing product roadmap

UX Designer | HealthApp | 2019 – 2021
- Designed mobile app interface achieving 4.8 App Store rating
- Created wireframes and prototypes for 15+ feature releases

EDUCATION
B.F.A. Graphic Design | Art Institute | 2019

SKILLS
UI/UX Design, Figma, User Research, Wireframing, Communication, JavaScript, Design Systems

CERTIFICATIONS
Google UX Design Certificate | 2020`,
  },
  {
    id: "academic-research",
    name: "Academic / Research",
    description: "Publications, grants, and research focus for academia and R&D roles.",
    category: "industry",
    sampleText: `Dr. Casey Nguyen
c.nguyen@university.edu | (555) 789-0123 | linkedin.com/in/caseynguyen

PROFESSIONAL SUMMARY
Research Scientist with PhD in Computational Biology. 10+ peer-reviewed publications and $1.2M in grant funding. Expert in machine learning applications for genomics.

EXPERIENCE
Postdoctoral Researcher | National Research Lab | 2020 – Present
- Published 6 papers in top-tier journals (Nature Methods, Bioinformatics)
- Secured $800K NIH grant for ML-based drug discovery research
- Mentored 4 graduate students and 2 undergraduate researchers

Graduate Research Assistant | University Research Center | 2015 – 2020
- Developed novel deep learning model improving protein structure prediction accuracy by 18%

EDUCATION
Ph.D. Computational Biology | Top University | 2020
B.S. Biology & Computer Science | State University | 2015

SKILLS
Python, Machine Learning, Data Analysis, Research, Communication, Project Management

PUBLICATIONS
12 peer-reviewed publications | h-index: 8`,
  },
  {
    id: "minimal-ats",
    name: "ATS-Optimized",
    description: "Clean, keyword-rich format designed for applicant tracking systems.",
    category: "style",
    sampleText: `Jamie Walsh
jamie.walsh@email.com | 555-890-1234 | Chicago, IL | linkedin.com/in/jamiewalsh

SUMMARY
Business Analyst with 4 years of experience in data analysis, SQL, and stakeholder communication. Proven ability to deliver insights that drive 20%+ operational improvements.

EXPERIENCE
Business Analyst | Retail Analytics Co. | 2022 – Present
- Analyzed sales data using SQL and Python to identify $1.5M in cost savings
- Created Tableau dashboards used by 50+ stakeholders for weekly reporting
- Led Agile sprint planning and Jira workflow optimization for 3 teams

Junior Analyst | Consulting Group | 2020 – 2022
- Supported data analysis projects for 10+ Fortune 500 clients
- Improved reporting accuracy by 30% through automated Excel pipelines

EDUCATION
Bachelor of Science in Economics | Midwest University | 2020

SKILLS
Data Analysis, SQL, Python, Tableau, Excel, Project Management, Communication, Agile

CERTIFICATIONS
Google Data Analytics Certificate | 2021`,
  },
];

function computeSimilarity(
  userScore: number,
  benchmarkScore: number,
  userSkills: string[],
  benchmarkSkills: string[]
): number {
  const scoreDiff = 100 - Math.abs(userScore - benchmarkScore);
  const skillOverlap =
    userSkills.length > 0
      ? userSkills.filter((s) => benchmarkSkills.includes(s)).length / Math.max(benchmarkSkills.length, 1)
      : 0;
  return Math.round(scoreDiff * 0.6 + skillOverlap * 100 * 0.4);
}

function getComparisonInsights(
  userScore: number,
  benchmarkScore: number,
  benchmarkName: string
): string[] {
  const diff = benchmarkScore - userScore;
  if (diff > 15) {
    return [
      `This ${benchmarkName} benchmark scores ${diff} points higher overall.`,
      "Study its structure: strong summary, quantified bullets, and complete sections.",
      "Adopt similar action verbs and metrics formatting from top examples.",
    ];
  }
  if (diff > 0) {
    return [
      `You're close — only ${diff} points behind this benchmark.`,
      "Minor improvements to content depth and section completeness would match this standard.",
    ];
  }
  if (diff > -10) {
    return [
      `Your resume meets or exceeds this ${benchmarkName} benchmark.`,
      "Maintain this quality while tailoring content to your target role.",
    ];
  }
  return [
    `Your resume outperforms this ${benchmarkName} benchmark by ${Math.abs(diff)} points.`,
    "This archetype may not be your target — focus benchmarks matching your career level.",
  ];
}

export function compareAgainstBenchmarks(
  userAnalysis: ReturnType<typeof analyzeResume>
): BenchmarkComparison[] {
  return BENCHMARK_RESUMES.map((benchmark) => {
    const benchmarkAnalysis = analyzeResume(benchmark.sampleText);
    const similarity = computeSimilarity(
      userAnalysis.overallScore,
      benchmarkAnalysis.overallScore,
      userAnalysis.skills.detected,
      benchmarkAnalysis.skills.detected
    );

    return {
      id: benchmark.id,
      name: benchmark.name,
      description: benchmark.description,
      category: benchmark.category,
      benchmarkScore: benchmarkAnalysis.overallScore,
      userScore: userAnalysis.overallScore,
      scoreDelta: userAnalysis.overallScore - benchmarkAnalysis.overallScore,
      similarity,
      layoutScore: benchmarkAnalysis.layoutScore,
      contentScore: benchmarkAnalysis.contentScore,
      detectedSkills: benchmarkAnalysis.skills.detected,
      insights: getComparisonInsights(
        userAnalysis.overallScore,
        benchmarkAnalysis.overallScore,
        benchmark.name
      ),
      sectionsPresent: benchmarkAnalysis.sections.filter((s) => s.found).map((s) => s.name),
    };
  }).sort((a, b) => b.similarity - a.similarity);
}

export function getBestMatchingArchetype(comparisons: BenchmarkComparison[]): BenchmarkComparison {
  return comparisons[0];
}
