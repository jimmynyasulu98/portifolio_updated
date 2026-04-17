import { Project, Skill, Certificate, Qualification, BlogPost } from './types/index';

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

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Securing Enterprise Networks with Zero Trust',
    excerpt: 'An in-depth look at implementing Zero Trust architecture in modern corporate environments.',
    content: `
      ## The Rise of Zero Trust
      
      Zero Trust is a security framework requiring all users, whether in or outside the organization's network, to be authenticated, authorized, and continuously validated for security configuration and posture before being granted or keeping access to applications and data.

      ### Key Principles
      - **Explicit verification**: Always authenticate and authorize based on all available data points.
      - **Least privilege access**: Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA), risk-based adaptive polices, and data protection.
      - **Assume breach**: Minimize impact surface and segment access. Verify end-to-end encryption and use analytics to get visibility, drive threat detection, and improve defenses.

      ### Practical Implementation
      Implementing Zero Trust isn't an overnight task. It requires a shift in mindset from network-based security to identity-based security. Start by identifying your "protect surface" – the sensitive data, applications, and services that matter most to your business.
    `,
    category: 'Networking',
    date: 'Oct 24, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/security/800/600',
    published: true
  },
  {
    id: '2',
    title: 'Next.js 15: What Developers Need to Know',
    excerpt: 'Exploring the latest features in Next.js 15 and how they improve performance and DX.',
    content: `
      ## Next.js 15 is Here
      
      The latest version of Next.js brings several exciting updates that focus on performance, developer experience, and stability.

      ### Major Features
      - **React 19 support**: Full compatibility with the latest React features.
      - **Turbopack Dev**: Stable development performance for large applications.
      - **Caching Updates**: Improved fetch caching and request de-duplication.
      - **New Form Component**: Enhanced <Form /> for better progressive enhancement.

      ### Should You Upgrade?
      For most projects, the move to Next.js 15 will be smooth, especially if you're already on the App Router. The performance gains in the development server alone make it worth considering.
    `,
    category: 'Development',
    date: 'Oct 15, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/code/800/600',
    published: true
  },
  {
    id: '3',
    title: 'Automating DevOps with GitHub Actions',
    excerpt: 'A practical guide to building robust CI/CD pipelines for Laravel and React applications.',
    content: `
      ## DevOps Automation with Actions
      
      GitHub Actions has revolutionized how we think about CI/CD. It's integrated, powerful, and easy to scale.

      ### Building a Pipeline
      A typical pipeline involves several stages:
      1. **Checkout Code**: Accessing the repository.
      2. **Dependency Installation**: Running npm install or composer install.
      3. **Testing**: Running unit and integration tests.
      4. **Build**: Creating production-ready artifacts.
      5. **Deployment**: Pushing to production servers or cloud providers.

      ### Best Practices
      - Keep your workflows modular using reusable workflows.
      - Use environment-specific secrets for security.
      - Optimize runs by caching dependencies.
    `,
    category: 'DevOps',
    date: 'Sep 28, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/automation/800/600',
    published: true
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
