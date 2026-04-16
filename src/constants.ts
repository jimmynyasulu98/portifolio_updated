import { Project, Skill, Certificate, Qualification } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Network Monitoring Dashboard',
    description: 'A real-time dashboard for monitoring network traffic and server health using Next.js and SNMP.',
    image: 'https://picsum.photos/seed/network/800/600',
    tags: ['Next.js', 'Node.js', 'SNMP', 'D3.js'],
    github: 'https://github.com'
  },
  {
    id: '2',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with Laravel backend and React frontend.',
    image: 'https://picsum.photos/seed/shop/800/600',
    tags: ['Laravel', 'React', 'MySQL', 'Tailwind'],
    link: 'https://example.com'
  },
  {
    id: '3',
    title: 'DevOps Automation Pipeline',
    description: 'CI/CD pipeline automation using GitHub Actions, Docker, and Kubernetes.',
    image: 'https://picsum.photos/seed/devops/800/600',
    tags: ['Docker', 'Kubernetes', 'GitHub Actions', 'Terraform'],
    github: 'https://github.com'
  }
];

export const SKILLS: Skill[] = [
  { name: 'Next.js', category: 'Frontend', level: 90 },
  { name: 'React', category: 'Frontend', level: 95 },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90 },
  { name: 'Laravel', category: 'Backend', level: 85 },
  { name: 'Node.js', category: 'Backend', level: 80 },
  { name: 'Docker', category: 'DevOps', level: 85 },
  { name: 'Kubernetes', category: 'DevOps', level: 75 },
  { name: 'CI/CD', category: 'DevOps', level: 80 },
  { name: 'CCNA', category: 'Networking', level: 95 },
  { name: 'CompTIA Security+', category: 'Networking', level: 90 },
  { name: 'Network Security', category: 'Networking', level: 85 },
  { name: 'AI Basics', category: 'AI', level: 60 },
];

export const CERTIFICATES: Certificate[] = [
  {
    id: 'c1',
    name: 'Cisco Certified Network Associate (CCNA)',
    issuer: 'Cisco',
    date: '2023',
    image: 'https://picsum.photos/seed/cisco/400/300'
  },
  {
    id: 'c2',
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    date: '2024',
    image: 'https://picsum.photos/seed/comptia/400/300'
  }
];

export const QUALIFICATIONS: Qualification[] = [
  {
    id: 'q1',
    degree: 'Master of Science in Informatics',
    institution: 'University of Malawi',
    period: '2024 - Present',
    description: 'Focusing on advanced data systems and network security.'
  },
  {
    id: 'q2',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of Malawi',
    period: '2019 - 2023',
    description: 'Graduated with honors. Specialized in software engineering and networking.'
  }
];
