/**
 * API Client for interacting with the backend server.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchWithAuth(path: string, options: RequestInit = {}, userId?: string) {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId || '',
    ...options.headers,
  } as Record<string, string>;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API Request failed' }));
    throw new Error(error.error || 'API Request failed');
  }

  return response.json();
}

export const api = {
  resumes: {
    list: (userId: string) => fetchWithAuth('/resumes', {}, userId),
    get: (id: string, userId: string) => fetchWithAuth(`/resumes/${id}`, {}, userId),
    create: (data: any, userId: string) => fetchWithAuth('/resumes', { method: 'POST', body: JSON.stringify(data) }, userId),
    update: (id: string, data: any, userId: string) => fetchWithAuth(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(data) }, userId),
    delete: (id: string, userId: string) => fetchWithAuth(`/resumes/${id}`, { method: 'DELETE' }, userId),
  },
  versions: {
    list: (resumeId: string, userId: string) => fetchWithAuth(`/versions/${resumeId}`, {}, userId),
    create: (resumeId: string, data: any, userId: string) => fetchWithAuth(`/versions/${resumeId}`, { method: 'POST', body: JSON.stringify({ data }) }, userId),
  },
  ai: {
    generateSummary: (jobTitle: string, experience: string) => fetchWithAuth('/ai/summary', { method: 'POST', body: JSON.stringify({ jobTitle, experience }) }),
    improveExperience: (description: string) => fetchWithAuth('/ai/improve', { method: 'POST', body: JSON.stringify({ description }) }),
    suggestSkills: (jobTitle: string) => fetchWithAuth('/ai/skills', { method: 'POST', body: JSON.stringify({ jobTitle }) }),
  }
};
