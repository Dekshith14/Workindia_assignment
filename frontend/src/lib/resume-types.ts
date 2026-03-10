export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  duration: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'creative' | 'tech' | 'executive';

export interface ResumeRecord {
  id: string;
  user_id: string;
  title: string;
  template: TemplateId;
  data: ResumeData;
  is_paid_template_unlocked: boolean;
  created_at: string;
  updated_at: string;
}

export const emptyResumeData: ResumeData = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
};
