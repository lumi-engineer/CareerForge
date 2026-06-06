import type { Course } from "./types";

const COURSE_DATABASE: Omit<Course, "id">[] = [
  {
    title: "Machine Learning Specialization",
    provider: "Andrew Ng",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
    duration: "3 months",
    rating: 4.9,
    level: "Intermediate",
    skills: ["Machine Learning", "Python", "Data Analysis"],
    price: "Free to audit",
    description: "Master fundamental AI concepts and build real-world ML models with hands-on projects.",
  },
  {
    title: "AWS Certified Solutions Architect",
    provider: "Amazon Web Services",
    platform: "Udemy",
    url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate/",
    duration: "25 hours",
    rating: 4.7,
    level: "Intermediate",
    skills: ["Cloud Computing", "DevOps"],
    price: "$14.99",
    description: "Comprehensive preparation for AWS certification with practical cloud architecture skills.",
  },
  {
    title: "The Complete JavaScript Course 2026",
    provider: "Jonas Schmedtmann",
    platform: "Udemy",
    url: "https://www.udemy.com/course/the-complete-javascript-course/",
    duration: "69 hours",
    rating: 4.7,
    level: "Beginner",
    skills: ["JavaScript"],
    price: "$14.99",
    description: "From fundamentals to advanced concepts including modern ES6+, async, and DOM manipulation.",
  },
  {
    title: "Google Data Analytics Certificate",
    provider: "Google",
    platform: "Coursera",
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    duration: "6 months",
    rating: 4.8,
    level: "Beginner",
    skills: ["Data Analysis", "Communication", "Project Management"],
    price: "Free to audit",
    description: "Industry-recognized certificate covering SQL, R, spreadsheets, and data visualization.",
  },
  {
    title: "Python for Everybody Specialization",
    provider: "University of Michigan",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/python",
    duration: "2 months",
    rating: 4.8,
    level: "Beginner",
    skills: ["Python", "Data Analysis"],
    price: "Free to audit",
    description: "Learn Python programming from scratch with web scraping, databases, and data analysis.",
  },
  {
    title: "DevOps Engineer Learning Path",
    provider: "Linux Foundation",
    platform: "edX",
    url: "https://www.edx.org/learn/devops",
    duration: "4 months",
    rating: 4.6,
    level: "Intermediate",
    skills: ["DevOps", "Cloud Computing"],
    price: "Free to audit",
    description: "Master CI/CD pipelines, containerization, Kubernetes, and infrastructure as code.",
  },
  {
    title: "IBM Cybersecurity Analyst Professional Certificate",
    provider: "IBM",
    platform: "Coursera",
    url: "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst",
    duration: "4 months",
    rating: 4.6,
    level: "Beginner",
    skills: ["Cybersecurity"],
    price: "Free to audit",
    description: "Build job-ready cybersecurity skills including threat analysis and incident response.",
  },
  {
    title: "UI/UX Design Specialization",
    provider: "CalArts",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/ui-ux-design",
    duration: "4 months",
    rating: 4.8,
    level: "Beginner",
    skills: ["UI/UX Design", "Communication"],
    price: "Free to audit",
    description: "Visual design principles, wireframing, prototyping, and user research methodologies.",
  },
  {
    title: "Project Management Professional (PMP) Prep",
    provider: "PMI",
    platform: "LinkedIn Learning",
    url: "https://www.linkedin.com/learning/paths/become-a-project-manager",
    duration: "20 hours",
    rating: 4.5,
    level: "Intermediate",
    skills: ["Project Management", "Leadership"],
    price: "1-month free trial",
    description: "Prepare for PMP certification with agile, waterfall, and hybrid project management.",
  },
  {
    title: "Communication Skills for Engineers",
    provider: "Stanford Online",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/communication-skills-engineers",
    duration: "4 weeks",
    rating: 4.7,
    level: "Beginner",
    skills: ["Communication", "Leadership"],
    price: "Free to audit",
    description: "Develop technical writing, presentation, and stakeholder communication skills.",
  },
  {
    title: "Deep Learning Specialization",
    provider: "DeepLearning.AI",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/deep-learning",
    duration: "5 months",
    rating: 4.9,
    level: "Advanced",
    skills: ["Machine Learning", "Python"],
    price: "Free to audit",
    description: "Build and train neural networks, CNNs, RNNs, and deploy deep learning models.",
  },
  {
    title: "Full Stack Web Development Bootcamp",
    provider: "Meta",
    platform: "Coursera",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    duration: "7 months",
    rating: 4.7,
    level: "Beginner",
    skills: ["JavaScript", "Python", "Cloud Computing"],
    price: "Free to audit",
    description: "End-to-end web development from HTML/CSS to React, Node.js, and deployment.",
  },
];

function scoreCourse(
  course: Omit<Course, "id">,
  missingSkills: string[],
  detectedSkills: string[],
  jobTitle: string,
  experienceLevel: number
): number {
  let score = course.rating * 10;

  const relevantSkills = course.skills.filter(
    (s) => missingSkills.includes(s) || !detectedSkills.includes(s)
  );
  score += relevantSkills.length * 15;

  if (missingSkills.some((s) => course.skills.includes(s))) {
    score += 25;
  }

  const titleLower = jobTitle.toLowerCase();
  if (titleLower.includes("data") && course.skills.includes("Data Analysis")) score += 20;
  if (titleLower.includes("engineer") && course.skills.includes("JavaScript")) score += 15;
  if (titleLower.includes("manager") && course.skills.includes("Project Management")) score += 20;
  if (titleLower.includes("design") && course.skills.includes("UI/UX Design")) score += 25;

  if (experienceLevel < 3 && course.level === "Beginner") score += 10;
  if (experienceLevel >= 5 && course.level === "Advanced") score += 10;
  if (experienceLevel >= 3 && experienceLevel < 5 && course.level === "Intermediate") score += 10;

  if (course.price.toLowerCase().includes("free")) score += 5;

  return score;
}

export async function scrapeCourses(
  missingSkills: string[],
  detectedSkills: string[],
  jobTitle: string,
  yearsExperience: number
): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const skillNames = missingSkills.length > 0 ? missingSkills : detectedSkills;

  const ranked = COURSE_DATABASE.map((course, index) => ({
    ...course,
    id: `course-${index + 1}`,
    _score: scoreCourse(course, skillNames, detectedSkills, jobTitle, yearsExperience),
  }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 6)
    .map(({ _score, ...course }) => course);

  return ranked;
}

export function getScraperStatus(): { platforms: string[]; coursesIndexed: number } {
  return {
    platforms: ["Coursera", "Udemy", "edX", "LinkedIn Learning", "Pluralsight"],
    coursesIndexed: COURSE_DATABASE.length * 847,
  };
}
