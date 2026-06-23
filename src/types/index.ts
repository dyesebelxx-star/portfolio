export type WorkType = "video" | "image";

export type WorkCategory = string;

export interface WorkSection {
  id: string;
  title: string;
  type: "markdown" | "images" | "prompts" | "steps";
  content: string;
  images: string[];
  prompts: PromptItem[];
  steps: WorkflowStep[];
  order: number;
  hidden: boolean;
}

export interface PromptItem {
  title: string;
  content: string;
  model: string;
  notes: string;
}

export interface WorkflowStep {
  order: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Work {
  id: string;
  slug: string;
  title: string;
  type: WorkType;
  category: WorkCategory;
  tags: string[];
  coverImage: string;
  description: string;
  content: string;
  images: string[];
  videoUrl: string | null;
  prompts: PromptItem[];
  workflow: WorkflowStep[];
  summary: string;
  sections: WorkSection[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkFormData = Omit<Work, "id" | "createdAt" | "updatedAt">;
