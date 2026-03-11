/**
 * AI Service - Resume assistance using pattern-based generation.
 * Provides professional resume content generation locally in the backend.
 */

export const aiService = {
  async generateSummary(jobTitle: string, experience: string): Promise<string> {
    // Generate a professional summary based on job title and experience
    const summaries: Record<string, string> = {
      default: `Results-driven ${jobTitle} with ${experience} of demonstrated expertise in delivering high-impact solutions. Proven track record of collaborating with cross-functional teams to drive strategic initiatives, optimize processes, and achieve measurable business outcomes. Passionate about leveraging technical skills and domain knowledge to create value and advance organizational goals.`,
    };

    const jobLower = jobTitle.toLowerCase();
    if (jobLower.includes('software') || jobLower.includes('developer') || jobLower.includes('engineer')) {
      return `Innovative ${jobTitle} with ${experience} of hands-on experience designing, building, and deploying scalable software systems. Proficient in modern development practices including agile methodologies, CI/CD pipelines, and test-driven development. Passionate about writing clean, maintainable code and delivering exceptional user experiences that make a meaningful impact.`;
    }
    if (jobLower.includes('data') || jobLower.includes('analyst')) {
      return `Analytical ${jobTitle} with ${experience} of experience transforming complex datasets into actionable business insights. Expert in statistical modeling, data visualization, and machine learning techniques. Skilled at translating technical findings into clear narratives for stakeholders at all levels to drive data-informed decision making.`;
    }
    if (jobLower.includes('product') || jobLower.includes('manager')) {
      return `Strategic ${jobTitle} with ${experience} of experience leading product development from conception to launch. Expert at synthesizing market research, user feedback, and business objectives into compelling product roadmaps. Proven ability to align cross-functional teams and drive execution of high-impact product initiatives.`;
    }
    if (jobLower.includes('design') || jobLower.includes('ux') || jobLower.includes('ui')) {
      return `Creative ${jobTitle} with ${experience} of experience crafting intuitive, visually compelling user experiences. Expert in user research, wireframing, prototyping, and usability testing. Passionate about bridging the gap between business goals and user needs to create products that delight and retain customers.`;
    }

    return summaries.default;
  },

  async improveExperience(description: string): Promise<string> {
    // Enhance the experience description with stronger action verbs and metrics
    const improved = description
      .replace(/^(i |i've |i had |i was |i worked on |i helped )/gi, '')
      .replace(/\bworked on\b/gi, 'Spearheaded')
      .replace(/\bhelped\b/gi, 'Collaborated to')
      .replace(/\bdid\b/gi, 'Executed')
      .replace(/\bmade\b/gi, 'Developed')
      .replace(/\bmanaged\b/gi, 'Led and optimized')
      .replace(/\bresponsible for\b/gi, 'Delivered')
      .replace(/\bhandled\b/gi, 'Managed and resolved')
      .replace(/\bbuilt\b/gi, 'Engineered')
      .replace(/\bcreated\b/gi, 'Designed and implemented')
      .replace(/\bimproved\b/gi, 'Optimized and enhanced')
      .replace(/\bincreased\b/gi, 'Grew by');

    // Capitalize first letter
    const result = improved.charAt(0).toUpperCase() + improved.slice(1);
    
    // Ensure it ends with a period
    return result.endsWith('.') ? result : result + '.';
  },

  async suggestSkills(jobTitle: string): Promise<string[]> {
    const jobLower = jobTitle.toLowerCase();

    if (jobLower.includes('software') || jobLower.includes('developer') || jobLower.includes('full stack')) {
      return ['JavaScript', 'TypeScript', 'React', 'Node.js', 'REST APIs', 'Git', 'SQL', 'Docker', 'AWS', 'Agile/Scrum'];
    }
    if (jobLower.includes('frontend') || jobLower.includes('front-end') || jobLower.includes('ui')) {
      return ['React', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Webpack', 'Jest', 'Figma', 'Responsive Design'];
    }
    if (jobLower.includes('backend') || jobLower.includes('back-end') || jobLower.includes('server')) {
      return ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'REST APIs', 'GraphQL', 'CI/CD', 'Microservices'];
    }
    if (jobLower.includes('data scientist') || jobLower.includes('data engineer')) {
      return ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Spark', 'Tableau', 'Statistics', 'ETL Pipelines'];
    }
    if (jobLower.includes('analyst')) {
      return ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Data Visualization', 'Statistical Analysis', 'Google Analytics', 'A/B Testing', 'Reporting'];
    }
    if (jobLower.includes('product manager') || jobLower.includes('product owner')) {
      return ['Product Roadmapping', 'Agile/Scrum', 'User Research', 'JIRA', 'A/B Testing', 'Stakeholder Management', 'Market Analysis', 'Data Analytics', 'OKR Framework', 'Go-to-Market Strategy'];
    }
    if (jobLower.includes('design') || jobLower.includes('ux')) {
      return ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing', 'Usability Testing', 'Design Systems', 'Accessibility', 'Information Architecture', 'Visual Design'];
    }
    if (jobLower.includes('devops') || jobLower.includes('sre') || jobLower.includes('cloud')) {
      return ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Ansible', 'Monitoring', 'Git', 'Shell Scripting'];
    }
    if (jobLower.includes('manager') || jobLower.includes('lead') || jobLower.includes('director')) {
      return ['Strategic Planning', 'Team Leadership', 'Budget Management', 'Stakeholder Management', 'Project Management', 'Performance Reviews', 'Agile', 'Risk Management', 'OKRs', 'Cross-functional Collaboration'];
    }

    // Generic fallback for any role
    return ['Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Microsoft Office', 'Time Management', 'Critical Thinking', 'Adaptability', 'Leadership', 'Attention to Detail'];
  }
};
