export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Networking' | 'AI' | 'Other';
  level: number; // 0-100
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  image: string;
  published: boolean;
  scheduledDate?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  image?: string;
  link?: string;
}

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description?: string;
}
