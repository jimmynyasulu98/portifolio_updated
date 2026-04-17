import { Project, Skill, Certificate, Qualification, BlogPost } from './types/index';

export const PROJECTS: Project[] = [
  

  {
    id: '1',
    title: 'WhatsApp Student Portal (Flask + Twilio)',
    description: 'A lightweight WhatsApp-based portal developed to provide students with affordable and convenient access to academic information such as results, balances, and notifications. Built using Flask, Twilio API, and Python requests library, the system eliminates the need for costly internet bundles required by traditional web portals. It processes user queries via WhatsApp messages and dynamically retrieves data from backend systems, significantly improving accessibility and user engagement.',
    image: 'https://picsum.photos/seed/whatsapp/800/600',
    tags: ['Flask', 'Twilio API', 'Python', 'REST', 'Automation'],
    github: 'https://github.com'
  },

  {
    id: '2',
    title: 'UNIMED Corporate Website (WordPress CMS)',
    description: 'A dynamic and user-friendly corporate website developed using WordPress CMS to enhance UNIMED’s digital presence. The platform provides easy content management for non-technical staff, improves communication with stakeholders, and ensures timely updates of institutional information. Key benefits include improved accessibility, SEO optimization, and a scalable content structure that supports organizational growth.',
    image: 'https://picsum.photos/seed/website/800/600',
    tags: ['WordPress', 'CMS', 'SEO', 'Web Design'],
    link: 'https://example.com'
  },

  {
    id: '3',
    title: 'AI-Based Home Automation & Security System',
    description: 'A smart home security system developed as a final year project, integrating machine learning for facial recognition and intrusion detection. The system monitors doors and windows and triggers alerts upon unauthorized access attempts. It uses computer vision techniques to identify household members and distinguish them from unknown individuals, enhancing home security through intelligent automation.',
    image: 'https://picsum.photos/seed/aihome/800/600',
    tags: ['Machine Learning', 'Python', 'Computer Vision', 'IoT'],
    github: 'https://github.com'
  },

  {
    id: '4',
    title: 'High School Management Information System',
    description: 'A full-featured school management system designed to manage student records, academic performance, staff operations, fee structures, and attendance. Built using Next.js and Laravel, the system supports role-based access for administrators, teachers, and finance staff. It improves efficiency by digitizing academic and administrative processes while ensuring data consistency and reporting capabilities.',
    image: 'https://picsum.photos/seed/school/800/600',
    tags: ['Next.js', 'Laravel', 'React', 'MySQL', 'REST API'],
    github: 'https://github.com'
  },

  {
    id: '5',
    title: 'UNIMED Card Production System',
    description: 'A custom card production system developed to replace inflexible proprietary software previously used at UNIMED. The system integrates seamlessly with the UNIMED-MIS, enabling automated data synchronization and eliminating manual processes. It supports multiple data input formats including Excel, improving flexibility and efficiency. Built with React and Next.js, it enhances productivity and reduces operational bottlenecks in card issuance workflows.',
    image: 'https://picsum.photos/seed/cards/800/600',
    tags: ['Next.js', 'React', 'Data Integration', 'Automation'],
    github: 'https://github.com'
  },

  {
    id: '6',
    title: 'E-Commerce Platform (Django-Based)',
    description: 'A full-stack e-commerce platform developed using Django, MySQL, and Blade templating. The system supports product management, user authentication, order processing, and payment workflows. It demonstrates strong backend logic design, database structuring, and user experience considerations for scalable online retail solutions.',
    image: 'https://picsum.photos/seed/ecommerce/800/600',
    tags: ['Django', 'MySQL', 'Blade', 'E-commerce'],
    github: 'https://github.com'
  },
  {
    id: '7',
    title: 'UNIMED Management Information System (UNIMED-MIS)',
    description: 'A comprehensive enterprise-grade MIS designed to streamline operations, governance, and service delivery for the UNIMED Medical Scheme. Built with Next.js, Laravel, and PostgreSQL, the system centralizes member management, claims processing, financial tracking, and reporting. As part of the development team, I contributed to designing scalable backend services, API integrations, and role-based access control. The platform significantly improves operational efficiency, data integrity, and decision-making through real-time insights and automation.',
    image: 'https://picsum.photos/seed/mis/800/600',
    tags: ['Next.js', 'Laravel', 'PostgreSQL', 'Ant Design', 'REST API'],
    link: 'https://example.com'
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '4',
    title: 'Troubleshooting Network Connectivity: Real-World Lessons from the Field',
    excerpt: 'A practical breakdown of diagnosing network issues using real scenarios involving routing, firewalls, and packet analysis.',
    content: `
      ## Introduction
      
      In real-world environments, network issues are rarely straightforward. Unlike lab setups, production networks involve multiple devices, security layers, and unpredictable user behavior.

      This post shares practical troubleshooting approaches I’ve used while working as an ICT Officer and Network Support Technician.

      ### Step 1: Always Start with the Basics
      Before diving deep:
      - Check physical connectivity (cables, ports, LEDs)
      - Verify IP configuration
      - Confirm gateway reachability

      ### Step 2: Use Layered Troubleshooting
      Apply the OSI model:
      - Layer 1: Physical issues
      - Layer 2: MAC address resolution (ARP issues)
      - Layer 3: Routing and IP reachability
      - Layer 4+: Application/service failures

      ### Step 3: Packet Capture is Your Best Friend
      Tools like Wireshark or tcpdump help identify:
      - Dropped packets
      - ARP failures
      - Firewall blocking

      ### Real Case Insight
      In one scenario, devices could ping the gateway but not beyond. Packet capture revealed missing ARP responses on a firewall interface — indicating a misconfiguration.

      ### Key Takeaways
      - Always isolate the problem step-by-step
      - Don’t assume — verify
      - Logs and packet captures reveal the truth
    `,
    category: 'Networking',
    date: 'Nov 10, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/network/800/600',
    published: true
  },

  {
    id: '5',
    title: 'From Network Engineer to Cybersecurity: My Transition Path',
    excerpt: 'How I am leveraging networking experience and certifications like CCNA and Security+ to move into cybersecurity.',
    content: `
      ## Why Transition to Cybersecurity
      
      With increasing cyber threats, organizations need professionals who understand both networking and security. This makes network engineers well-positioned to transition.

      ### My Background
      - Bachelor’s in Computer Network Engineering
      - CCNA certification
      - CompTIA Security+

      ### Key Skills That Transfer
      - Network traffic analysis
      - Firewall configuration
      - Routing and segmentation
      - Troubleshooting

      ### What I’m Learning Now
      - SIEM tools (log analysis)
      - Threat detection and response
      - Zero Trust architecture
      - Endpoint security

      ### Advice for Others
      - Start with Security+
      - Build hands-on labs (try Hack The Box or home labs)
      - Learn Linux and scripting

      ### Final Thoughts
      Cybersecurity is not a completely new field for network engineers — it’s an evolution of what we already do.
    `,
    category: 'Security',
    date: 'Nov 5, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/security2/800/600',
    published: true
  },

  {
    id: '6',
    title: 'Designing a School Management System: From Concept to Database Schema',
    excerpt: 'A breakdown of designing a scalable MIS system including database schema, roles, and system architecture.',
    content: `
      ## Overview
      
      Designing a Management Information System (MIS) requires careful planning of data structures and user roles.

      ### Core Entities
      - Students
      - Staff (Teachers, Admin, Bursar)
      - Classes
      - Subjects
      - Grades
      - Terms

      ### Database Considerations
      - Normalize data to avoid redundancy
      - Use foreign keys for relationships
      - Ensure role-based access control

      ### Example Relationships
      - A student belongs to a class
      - A teacher teaches multiple subjects
      - Grades link students, subjects, and terms

      ### API Integration
      A Laravel-based backend can expose:
      - Student registration endpoints
      - Grade submission endpoints
      - Authentication (JWT)

      ### Lessons Learned
      - Always design before coding
      - Think about scalability early
      - Security is critical (especially student data)
    `,
    category: 'Development',
    date: 'Nov 2, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/system/800/600',
    published: true
  },

  {
    id: '7',
    title: 'Building a Reliable LAN/WAN Setup: Practical Configuration Tips',
    excerpt: 'Key considerations when designing and configuring LAN and WAN networks for reliability and performance.',
    content: `
      ## Introduction
      
      A stable network is the backbone of any organization. Poor design leads to downtime and frustration.

      ### LAN Best Practices
      - Use VLANs for segmentation
      - Implement proper IP addressing schemes
      - Enable DHCP where necessary

      ### WAN Considerations
      - Redundant links if possible
      - Monitor latency and packet loss
      - Secure WAN edges with firewalls

      ### Firewall Tips
      - Always define clear rules
      - Avoid overly permissive policies
      - Log traffic for analysis

      ### Monitoring Tools
      - Ping and traceroute
      - SNMP monitoring
      - NetFlow analysis

      ### Final Thoughts
      A good network is not just configured — it is continuously monitored and improved.
    `,
    category: 'Networking',
    date: 'Oct 28, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/lanwan/800/600',
    published: true
  },

  {
    id: '8',
    title: 'Setting Up pfSense Firewall: A Practical Beginner Guide',
    excerpt: 'A hands-on introduction to configuring pfSense firewall for network security and traffic control.',
    content: `
      ## Why pfSense
      
      pfSense is a powerful open-source firewall widely used in enterprise and small business environments.

      ### Initial Setup
      - Assign WAN and LAN interfaces
      - Configure IP addresses
      - Enable DHCP server

      ### Basic Rules
      - Allow LAN to WAN traffic
      - Block unwanted inbound traffic
      - Configure NAT rules

      ### Common Issues
      - Devices not getting IP addresses
      - No internet despite correct configuration
      - ARP or routing issues

      ### Troubleshooting Tips
      - Check interface status
      - Use packet capture
      - Review firewall logs

      ### Final Thoughts
      pfSense is an excellent tool for learning real-world networking and security concepts.
    `,
    category: 'Networking',
    date: 'Oct 25, 2024',
    author: 'Jimmy Nyasulu',
    image: 'https://picsum.photos/seed/firewall/800/600',
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
    period: '2025 - Present',
    description: 'Focusing on advanced data systems and network security.'
  },
  {
    id: 'q2',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of Malawi',
    period: '2017 - 2022',
    description: 'Graduated with honors. Specialized in software engineering and networking.'
  }

];
