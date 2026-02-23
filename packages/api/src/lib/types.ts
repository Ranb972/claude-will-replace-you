export interface ProfileInput {
  name: string;
  role: string;
  experience: number;
  description: string;
  technologies: string[];
  githubUrl?: string;
}

export interface SkillAnalysisItem {
  skill: string;
  replaced: boolean;
  comment: string;
}

export interface HumorContent {
  headline: string;
  quote: string;
  skillsAnalysis: SkillAnalysisItem[];
}
