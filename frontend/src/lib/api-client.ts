/**
 * API Client for interacting with the backend server.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchWithAuth(path: string, options: RequestInit = {}, userId?: string) {
  const headers = {
    'x-user-id': userId || '',
    ...options.headers,
  } as Record<string, string>;

  // Only set Content-Type to application/json if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

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
    update: (id: string, updates: any, userId: string) => fetchWithAuth(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(updates) }, userId),
    delete: (id: string, userId: string) => fetchWithAuth(`/resumes/${id}`, { method: 'DELETE' }, userId),
    import: (file: File, userId: string) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetchWithAuth('/import-resume', { method: 'POST', body: formData }, userId);
    },
  },
  versions: {
    list: (resumeId: string, userId: string) => fetchWithAuth(`/versions/${resumeId}`, {}, userId),
    create: (resumeId: string, data: any, userId: string) => 
      fetchWithAuth('/versions', { method: 'POST', body: JSON.stringify({ resumeId, data }) }, userId),
    restore: (versionId: string, userId: string) => 
      fetchWithAuth('/versions/restore', { method: 'POST', body: JSON.stringify({ versionId }) }, userId),
  },
  ai: {
    generateSummary: (jobTitle: string, experience: string) => fetchWithAuth('/ai/summary', { method: 'POST', body: JSON.stringify({ jobTitle, experience }) }),
    improveExperience: (description: string) => fetchWithAuth('/ai/improve', { method: 'POST', body: JSON.stringify({ description }) }),
    suggestSkills: (jobTitle: string) => fetchWithAuth('/ai/skills', { method: 'POST', body: JSON.stringify({ jobTitle }) }),
  }
};
