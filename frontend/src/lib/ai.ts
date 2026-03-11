import { api } from './api-client';

export async function aiGenerateSummary(jobTitle: string, experience: string): Promise<string> {
  const data = await api.ai.generateSummary(jobTitle, experience);
  return data.result;
}

export async function aiImproveExperience(description: string): Promise<string> {
  const data = await api.ai.improveExperience(description);
  return data.result;
}

export async function aiSuggestSkills(jobTitle: string): Promise<string[]> {
  const data = await api.ai.suggestSkills(jobTitle);
  return data.result;
}
