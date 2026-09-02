// ignitoverse: Centralized Microcredentials Dataset
export const microcredentialsData = [
  {
    id: 'mc-relaxation-techniques',
    slug: 'relaxation-techniques-and-meditation',
    title: 'Relaxation Techniques and Meditation',
    category: 'Management',
    domain: 'Professional & Wellness',
    level: 'Beginner (Level 1)',
    duration: '2 Month',
    modulesCount: 4,
    lecturesCount: 16,
    fee: '5000/-',
    format: 'Multiple Choice',
    language: 'ENGLISH',
    prerequisites: 'None',
    rating: 4.5,
    studentsCount: '3,054',
    lastUpdated: '05 August 2026',
    instructor: 'Dr. Sarah Lin (Wellness & Cognitive Specialist)',
    badgeText: 'POPULAR',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    about: 'This course introduces simple relaxation methods and meditation practices to improve focus, reduce stress, and maintain emotional balance. Students learn breathing techniques, mindfulness practices, and ways to develop a calm and positive approach toward daily challenges.',
    description: 'Relaxation Techniques and Meditation focuses on developing mental calmness, emotional balance, and stress management skills through various relaxation practices. This course introduces students to breathing exercises, mindfulness, meditation methods, and techniques for reducing physical and mental tension. Students learn how to improve concentration, manage emotions, and develop a positive mindset through regular meditation practices. The subject helps in enhancing self-awareness, improving focus, and maintaining overall well-being. This course provides practical knowledge of relaxation strategies that can be applied in personal and professional life to handle stress effectively.',
    learningOutcomes: [
      'Build positive thinking habits and improve overall well-being.',
      'Learn breathing exercises to promote calmness and relaxation.',
      'Develop mindfulness skills to improve emotional balance and self-awareness.',
      'Understand meditation practices for improving focus and mental clarity.',
      'Learn effective relaxation techniques to manage daily stress and pressure.'
    ],
    whoShouldEnroll: [
      'Corporate professionals looking to manage daily stress and improve concentration',
      'Team leads seeking to develop emotional balance and mindfulness in fast-paced workplaces',
      'Anyone eager to build lifelong mental calmness and well-being habits'
    ],
    examDetails: {
      format: 'Multiple Choice',
      questions: 30,
      duration: '45 Minutes',
      passingScore: '70%',
      retakePolicy: '2 free retakes with comprehensive diagnostic',
      certificationAuthority: 'Ignitoverse Global Skill Standards'
    },
    certificateName: 'Relaxation Techniques and Meditation',
    certificateType: 'Certificate of completion',
    certificateImage: '',
    skillLevel: 'Beginner-Friendly',
    modules: [
      {
        id: 'rt-mod-1',
        title: 'Module 1: Foundations of Relaxation & Breathwork',
        duration: '2h 15m',
        lectures: [
          { title: 'Understanding Tension Triggers & Diaphragmatic Breathing', duration: '30m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Mind-Body Connection & Somatic Calmness', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'rt-mod-2',
        title: 'Module 2: Meditation Practices for Focus & Clarity',
        duration: '2h 45m',
        lectures: [
          { title: 'Guided Mindfulness for Emotional Regulation', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Daily Stress Reset & 5-Minute Meditation Routines', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-java-enterprise',
    slug: 'java-enterprise-architecture',
    title: 'Java Enterprise Architecture & Spring Boot',
    category: 'Technical',
    domain: 'Software Engineering',
    level: 'Intermediate',
    duration: '18 Hours',
    modulesCount: 6,
    lecturesCount: 24,
    fee: 'Included in Org Plan',
    format: 'Self-Paced & Video Modules',
    language: 'English',
    prerequisites: 'Core Java fundamentals, OOP concepts, basic SQL knowledge',
    rating: 4.9,
    studentsCount: '14,280',
    lastUpdated: 'August 2026',
    instructor: 'Dr. Rajesh Verma (Principal Software Architect, ex-Oracle)',
    badgeText: 'HOT FOR TEAMS',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    description: 'Master enterprise-grade Java application design, Spring Boot microservices, security protocols (JWT/OAuth2), and high-throughput system architecture trusted by tier-1 global IT firms.',
    learningOutcomes: [
      'Architect robust RESTful microservices with Spring Boot 3 & Spring Cloud',
      'Implement enterprise data persistence using Hibernate and Spring Data JPA',
      'Secure enterprise APIs with OAuth 2.0, JWT, and Role-Based Access Control',
      'Optimize database queries, caching strategies (Redis), and connection pooling',
      'Apply automated testing with JUnit 5, Mockito, and Testcontainers',
      'Containerize microservices with Docker and deploy to Kubernetes clusters'
    ],
    whoShouldEnroll: [
      'Java developers transitioning into backend microservice engineering',
      'Enterprise software engineers seeking official architecture microcredentials',
      'Tech leads and solution architects looking to standardize modern Spring patterns'
    ],
    examDetails: {
      format: 'Proctored MCQ Assessment',
      questions: 40,
      duration: '60 Minutes',
      passingScore: '75%',
      retakePolicy: '2 free retakes after 48-hour cool-off period',
      certificationAuthority: 'Ignitoverse Global Skill Standards'
    },
    certificateName: 'Certified Java Enterprise Microservice Specialist (CJEMS)',
    certificateType: 'Digital Verifiable Enterprise Credential (QR-Protected)',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Modern Java & Enterprise Ecosystem',
        duration: '2h 45m',
        lectures: [
          { title: 'Enterprise Java 21 LTS Features & Records', duration: '35m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Modular Architecture & Dependency Injection', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Spring Framework 6 Core Internals', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Building Resilient Microservices with Spring Boot',
        duration: '3h 30m',
        lectures: [
          { title: 'Auto-configuration & Starter Architecture', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'RESTful API Contracts & OpenAPI 3.0 Specs', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Service Discovery with Netflix Eureka & Consul', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Resilience Patterns: Circuit Breaker & Retry (Resilience4j)', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Enterprise Data Access & High-Performance JPA',
        duration: '3h 15m',
        lectures: [
          { title: 'Spring Data JPA & Dynamic Specifications', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'N+1 Query Resolution & Fetch Join Strategies', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Distributed Caching with Redis & Spring Cache', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Security, Authentication & Zero-Trust APIs',
        duration: '3h 00m',
        lectures: [
          { title: 'Spring Security 6 Architecture & Filter Chains', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'JWT Token Issuance, Validation & Refresh Workflows', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'OAuth2 Resource Server Integration with Keycloak', duration: '80m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'mod-5',
        title: 'Module 5: Event-Driven Systems with Apache Kafka',
        duration: '3h 10m',
        lectures: [
          { title: 'Kafka Topics, Partitions, and Consumer Groups', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Spring Cloud Stream & Kafka Producer/Consumer implementation', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Transactional Messaging & Idempotent Consumers', duration: '80m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'mod-6',
        title: 'Module 6: Cloud Deployment & Final Assessment Prep',
        duration: '2h 20m',
        lectures: [
          { title: 'Dockerizing Multi-Stage Java Microservices', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Kubernetes Deployment, Health Probes & ConfigMaps', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Final Certification Exam Walkthrough & Sample MCQs', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-stress-management',
    slug: 'workplace-stress-management-resilience',
    title: 'Workplace Stress Management & Executive Resilience',
    category: 'Non-Technical',
    domain: 'Professional & Wellness',
    level: 'All Levels',
    duration: '10 Hours',
    modulesCount: 4,
    lecturesCount: 16,
    fee: 'Included in Org Plan',
    format: 'Self-Paced & Interactive Scenarios',
    language: 'English',
    prerequisites: 'None — Designed for professionals in high-intensity corporate environments',
    rating: 4.95,
    studentsCount: '28,450',
    lastUpdated: 'August 2026',
    instructor: 'Dr. Sarah Lin (Corporate Psychologist & Cognitive Behavioral Expert)',
    badgeText: 'HIGH IMPACT',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    description: 'Equip enterprise teams with scientific cognitive frameworks, emotional regulation toolkits, and proactive burnout prevention techniques to thrive under deadline pressure.',
    learningOutcomes: [
      'Identify physiological and psychological stress triggers before burnout occurs',
      'Apply evidence-based Cognitive Behavioral Therapy (CBT) micro-habits at work',
      'Implement boundary management in hybrid and remote team cultures',
      'Cultivate emotional intelligence and resilient team communication',
      'Build personal de-escalation protocols for client crises and high-stakes meetings',
      'Create a sustainable 30-day corporate mental fitness routine'
    ],
    whoShouldEnroll: [
      'Engineering managers, consultants, and leaders managing high-pressure projects',
      'Team members navigating crunch periods, rapid pivots, or organizational change',
      'Corporate professionals looking to enhance mental stamina and well-being'
    ],
    examDetails: {
      format: 'Scenario-based MCQ Assessment',
      questions: 30,
      duration: '45 Minutes',
      passingScore: '70%',
      retakePolicy: 'Unlimited retakes with comprehensive feedback',
      certificationAuthority: 'Ignitoverse Professional Development Council'
    },
    certificateName: 'Certified Workplace Mental Resilience Practitioner (CWMRP)',
    certificateType: 'Corporate HR & CPD Accredited Microcredential',
    modules: [
      {
        id: 'sm-mod-1',
        title: 'Module 1: The Neuroscience of Workplace Stress',
        duration: '2h 15m',
        lectures: [
          { title: 'Acute vs Chronic Stress: Brain Chemistry & Cortisol Impact', duration: '30m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'The Burnout Curve: Self-Assessment Diagnostics', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Cognitive Biases that Magnify Work Pressure', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'sm-mod-2',
        title: 'Module 2: Real-time De-escalation & Somatic Regulation',
        duration: '2h 30m',
        lectures: [
          { title: 'Box Breathing & Vagus Nerve Stimulation in 90 Seconds', duration: '35m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Micro-Breaks: Restoring Prefrontal Cortex Performance', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Managing Escalated Client Conversations Without Emotional Drainage', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'sm-mod-3',
        title: 'Module 3: Boundaries, Digital Detox & Energy Auditing',
        duration: '2h 45m',
        lectures: [
          { title: 'Setting Firm Psychological Boundaries in Remote & Hybrid Roles', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Asynchronous Work Protocols to Minimize Slack / Email Fatigue', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Managing Sleep Hygiene for High-Cognitive Workers', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'sm-mod-4',
        title: 'Module 4: Team Resilience & Certification Exam Prep',
        duration: '2h 30m',
        lectures: [
          { title: 'Creating Psychological Safety in Team Meetings', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Supporting Stressed Peers: Empathic Inquiry Framework', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Practice Scenarios & Final MCQ Exam Simulation', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-python-data',
    slug: 'python-data-analytics-enterprise',
    title: 'Python for Enterprise Data Analytics & Automation',
    category: 'Technical',
    domain: 'Data & AI',
    level: 'Beginner to Intermediate',
    duration: '16 Hours',
    modulesCount: 5,
    lecturesCount: 20,
    fee: 'Included in Org Plan',
    format: 'Hands-on Labs & MCQ Validation',
    language: 'English',
    prerequisites: 'Basic computer literacy, familiarity with spreadsheets',
    rating: 4.88,
    studentsCount: '19,650',
    lastUpdated: 'August 2026',
    instructor: 'Michael Chang (Lead Data Scientist, FinTech Innovations)',
    badgeText: 'MOST POPULAR',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    description: 'Transform organizational data workflows using Python, Pandas, NumPy, and automated reporting scripts. Automate Excel workflows, extract business KPIs, and present visual dashboards.',
    learningOutcomes: [
      'Write structured Python scripts to automate repetitive enterprise data tasks',
      'Clean, transform, and merge multi-source datasets with Pandas & NumPy',
      'Generate interactive business charts using Matplotlib and Seaborn',
      'Connect Python directly to enterprise SQL databases and ERP APIs',
      'Build automated daily email digests and KPI calculation pipelines',
      'Comply with enterprise data governance and secure secret handling'
    ],
    whoShouldEnroll: [
      'Business analysts, operations leads, and financial analysts replacing manual Excel',
      'Software developers and QA engineers expanding into data pipelines',
      'Product managers seeking data self-reliance'
    ],
    examDetails: {
      format: 'Technical MCQ + Code snippet diagnosis',
      questions: 35,
      duration: '50 Minutes',
      passingScore: '70%',
      retakePolicy: '2 free retakes',
      certificationAuthority: 'Ignitoverse Global Skill Standards'
    },
    certificateName: 'Certified Enterprise Python Data Associate (CEPDA)',
    certificateType: 'Industry Verifiable Technical Microcredential',
    modules: [
      {
        id: 'py-mod-1',
        title: 'Module 1: Enterprise Python Fundamentals & Environment Setup',
        duration: '3h 00m',
        lectures: [
          { title: 'Python 3.12 Syntax, Data Types & List Comprehensions', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Virtual Environments, Pipenv & Package Security', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Error Handling, Logging & Defensive Scripting', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'py-mod-2',
        title: 'Module 2: High-Performance Data Manipulation with Pandas',
        duration: '3h 45m',
        lectures: [
          { title: 'DataFrames, Series & Vectorized Computations', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Handling Missing Data, Outliers & Datetime Parsing', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Merging, Joining, and GroupBy Aggregations', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'py-mod-3',
        title: 'Module 3: Database Connectivity & API Ingestion',
        duration: '3h 15m',
        lectures: [
          { title: 'Connecting to PostgreSQL / SQL Server with SQLAlchemy', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Consuming REST APIs & Processing Nested JSON Payloads', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Automating Excel Sheet Generation with OpenPyXL', duration: '80m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'py-mod-4',
        title: 'Module 4: Business Data Visualization & Storytelling',
        duration: '3h 00m',
        lectures: [
          { title: 'Executive Dashboards with Plotly & Seaborn', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Designing Color-Blind Friendly Charts for Leadership', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Exporting PDF & HTML Management Briefs', duration: '90m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'py-mod-5',
        title: 'Module 5: Automated Scheduling & MCQ Exam Preparation',
        duration: '3h 00m',
        lectures: [
          { title: 'Scheduling Automation Scripts via Cron & Windows Task Scheduler', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Security Best Practices: Managing API Keys & Secrets', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Exam Readiness Review & 50 Practice MCQs', duration: '85m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-comm-leadership',
    slug: 'executive-workplace-communication',
    title: 'Executive Workplace Communication & Stakeholder Influence',
    category: 'Non-Technical',
    domain: 'Leadership & Management',
    level: 'Intermediate',
    duration: '12 Hours',
    modulesCount: 4,
    lecturesCount: 16,
    fee: 'Included in Org Plan',
    format: 'Video Masterclasses & Roleplay Scenarios',
    language: 'English',
    prerequisites: 'None',
    rating: 4.92,
    studentsCount: '22,100',
    lastUpdated: 'August 2026',
    instructor: 'Alistair Vance (Executive Coach & Former McKinsey Director)',
    badgeText: 'EXECUTIVE TRACK',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    description: 'Master concise executive presence, structured thinking (Pyramid Principle), cross-cultural client negotiations, and effective conflict resolution across enterprise hierarchy.',
    learningOutcomes: [
      'Structure high-stakes presentations using the Minto Pyramid Principle',
      'Deliver persuasive business cases to C-suite and steering committees',
      'Facilitate productive multi-stakeholder consensus meetings',
      'Master cross-cultural communication across global enterprise teams',
      'Navigate difficult feedback, performance dialogues, and client escalations',
      'Write crisp executive memos, project status summaries, and emails'
    ],
    whoShouldEnroll: [
      'Tech leads and project managers communicating with business clients',
      'Consultants delivering strategic proposals to enterprise customers',
      'Mid-level professionals preparing for executive promotion tracks'
    ],
    examDetails: {
      format: 'Scenario Evaluation MCQ Exam',
      questions: 30,
      duration: '45 Minutes',
      passingScore: '75%',
      retakePolicy: '2 free retakes',
      certificationAuthority: 'Ignitoverse Leadership Institute'
    },
    certificateName: 'Certified Executive Communication Specialist (CECS)',
    certificateType: 'Corporate Leadership Verifiable Credential',
    modules: [
      {
        id: 'comm-mod-1',
        title: 'Module 1: The Pyramid Principle & Top-Down Thinking',
        duration: '3h 00m',
        lectures: [
          { title: 'The Core Rule: Start with the Conclusion (BLUF)', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'MECE Framework (Mutually Exclusive, Collectively Exhaustive)', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Crafting 1-Page Executive Briefs that Get Approved', duration: '90m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'comm-mod-2',
        title: 'Module 2: High-Stakes Presentations & Executive Presence',
        duration: '3h 00m',
        lectures: [
          { title: 'Vocal Variety, Pacing, and Eliminating Verbal Fillers', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Designing Clean Slide Decks that Support, Not Distract', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Handling Difficult Questions and Objections Under Fire', duration: '80m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'comm-mod-3',
        title: 'Module 3: Conflict Resolution & Cross-Functional Influence',
        duration: '3h 00m',
        lectures: [
          { title: 'Crucial Conversations: The STATE Model for High Emotions', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Influencing Without Authority: Building Peer Coalitions', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Constructive Feedback Delivery: The SBI Method', duration: '75m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'comm-mod-4',
        title: 'Module 4: Global Stakeholder Nuances & Assessment',
        duration: '3h 00m',
        lectures: [
          { title: 'High-Context vs Low-Context Cultural Communication', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Client Escalation Protocols & Reputation Protection', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Scenario Analysis and Final Credential MCQ Exam', duration: '75m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-cloud-devops',
    slug: 'cloud-architecture-devops-fundamentals',
    title: 'Cloud Architecture & Enterprise DevOps Fundamentals',
    category: 'Technical',
    domain: 'Cloud & Infrastructure',
    level: 'Intermediate',
    duration: '20 Hours',
    modulesCount: 5,
    lecturesCount: 22,
    fee: 'Included in Org Plan',
    format: 'Architecture Labs & MCQ Certification',
    language: 'English',
    prerequisites: 'Basic Linux commands, understanding of networking protocols',
    rating: 4.94,
    studentsCount: '16,740',
    lastUpdated: 'August 2026',
    instructor: 'Elena Rostova (AWS Solutions Architect Champion)',
    badgeText: 'ENTERPRISE ESSENTIAL',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    description: 'Gain hands-on mastery over multi-cloud design, Terraform Infrastructure as Code (IaC), CI/CD pipelines (GitHub Actions/GitLab), Docker, Kubernetes, and enterprise FinOps.',
    learningOutcomes: [
      'Design fault-tolerant, scalable VPC networks across AWS and Azure',
      'Author modular Infrastructure as Code using Terraform and OpenTofu',
      'Build end-to-end automated CI/CD pipelines with automated testing gates',
      'Configure Kubernetes deployments, services, ingress, and auto-scaling',
      'Implement observability using Prometheus, Grafana, and OpenTelemetry',
      'Track cloud cost allocation and implement FinOps cost optimizations'
    ],
    whoShouldEnroll: [
      'System administrators and developers transitioning into DevOps roles',
      'Enterprise architects needing standard cloud governance patterns',
      'QA and site reliability engineers (SREs)'
    ],
    examDetails: {
      format: 'Proctored Technical MCQ Examination',
      questions: 45,
      duration: '60 Minutes',
      passingScore: '75%',
      retakePolicy: '2 free retakes',
      certificationAuthority: 'Ignitoverse Cloud Skill Standards'
    },
    certificateName: 'Certified Enterprise Cloud & DevOps Architect (CECDA)',
    certificateType: 'Verifiable Digital Enterprise Credential',
    modules: [
      {
        id: 'cld-mod-1',
        title: 'Module 1: Enterprise Multi-Cloud Foundations',
        duration: '4h 00m',
        lectures: [
          { title: 'VPCs, Subnets, Route Tables & Transit Gateways', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'IAM Policies, Roles, and Least Privilege Guardrails', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Storage Tiers: Block, Object, and Shared File Systems', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'cld-mod-2',
        title: 'Module 2: Infrastructure as Code (Terraform)',
        duration: '4h 00m',
        lectures: [
          { title: 'Terraform State Management, Remote Backends & Locking', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Reusable Terraform Modules & Variable Validation', duration: '65m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Automated Terraform Linting & Security Scanning (tfsec)', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'cld-mod-3',
        title: 'Module 3: Enterprise CI/CD Pipeline Automation',
        duration: '4h 00m',
        lectures: [
          { title: 'GitHub Actions Workflows, Secrets & Self-Hosted Runners', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Automated SAST / DAST Vulnerability Scanners in Pipeline', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Zero-Downtime Deployment Strategies (Blue-Green & Canary)', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'cld-mod-4',
        title: 'Module 4: Container Orchestration with Kubernetes',
        duration: '4h 00m',
        lectures: [
          { title: 'Kubernetes Control Plane & Worker Node Internals', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Deployments, StatefulSets, DaemonSets & Helm Charts', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Horizontal Pod Autoscaling & Cluster Autoscaling', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'cld-mod-5',
        title: 'Module 5: Observability, FinOps & Certification Exam',
        duration: '4h 00m',
        lectures: [
          { title: 'Prometheus Metrics Collection & Alertmanager Rules', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Grafana Dashboards & Distributed Tracing with Jaeger', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Comprehensive Exam Simulation & Question Analysis', duration: '90m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-time-mastery',
    slug: 'time-management-focus-mastery',
    title: 'Time Management & Focus Mastery for Engineering Teams',
    category: 'Non-Technical',
    domain: 'Productivity & Habits',
    level: 'All Levels',
    duration: '8 Hours',
    modulesCount: 3,
    lecturesCount: 12,
    fee: 'Included in Org Plan',
    format: 'Video Bite-Sizes & Productivity Templates',
    language: 'English',
    prerequisites: 'None',
    rating: 4.87,
    studentsCount: '18,340',
    lastUpdated: 'August 2026',
    instructor: 'Marcus Vance (Productivity Strategist, Tech Lead Coach)',
    badgeText: 'QUICK WIN',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    description: 'Eliminate context switching, establish uninterrupted deep work blocks, prioritize using Eisenhower & Pareto matrices, and accelerate project delivery by 40%.',
    learningOutcomes: [
      'Audit personal and team time leaks with quantitative time-tracking',
      'Implement structured Deep Work time-blocks to ship complex features',
      'Run ruthless meeting audits: 15-minute standups and asynchronous updates',
      'Prioritize competing enterprise sprint requests using Eisenhower matrices',
      'Overcome cognitive friction and task procrastination through micro-commitments',
      'Establish sustainable end-of-day shutdown rituals'
    ],
    whoShouldEnroll: [
      'Software engineers overwhelmed by context switching and meetings',
      'Tech leads and project coordinators managing multiple work streams',
      'Anyone looking to maximize deep focus and output'
    ],
    examDetails: {
      format: 'Interactive Scenario MCQ Assessment',
      questions: 25,
      duration: '35 Minutes',
      passingScore: '70%',
      retakePolicy: 'Unlimited retakes',
      certificationAuthority: 'Ignitoverse Professional Development Council'
    },
    certificateName: 'Certified Enterprise Focus & Time Mastery Professional',
    certificateType: 'Corporate Productivity Microcredential',
    modules: [
      {
        id: 'tm-mod-1',
        title: 'Module 1: The Biology of Attention & The Cost of Context Switching',
        duration: '2h 30m',
        lectures: [
          { title: 'Attention Residue: Why Multitasking Destroys Code Quality', duration: '35m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'The 3-Tier Time Audit: Quantifying Invisible Distractions', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Establishing Sacred 90-Minute Deep Work Blocks', duration: '70m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'tm-mod-2',
        title: 'Module 2: Ruthless Prioritization & Meeting Elimination',
        duration: '2h 45m',
        lectures: [
          { title: 'The Eisenhower Matrix Adapted for Agile Sprint Planning', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'The "Could This Be an Email?" Audit Framework', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Polite and Assertive Boundary Setting with Stakeholders', duration: '80m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'tm-mod-3',
        title: 'Module 3: Daily Systems, Tooling & Assessment',
        duration: '2h 45m',
        lectures: [
          { title: 'Building a Low-Friction Notion / Obsidian Second Brain', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'The 10-Minute Daily Shutdown Ritual to Prevent Weekend Stress', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Final Certification Assessment Scenarios', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-cyber-security',
    slug: 'enterprise-cybersecurity-zero-trust',
    title: 'Enterprise Cybersecurity & Zero-Trust Defense',
    category: 'Technical',
    domain: 'Security & Compliance',
    level: 'Intermediate to Advanced',
    duration: '18 Hours',
    modulesCount: 5,
    lecturesCount: 20,
    fee: 'Included in Org Plan',
    format: 'Defense Scenarios & MCQ Certification',
    language: 'English',
    prerequisites: 'Basic networking and web application understanding',
    rating: 4.96,
    studentsCount: '11,890',
    lastUpdated: 'August 2026',
    instructor: 'Vikram Joshi (CISO Advisor & Former Defense Cyber Analyst)',
    badgeText: 'SECURITY CRITICAL',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    description: 'Learn modern defense against OWASP Top 10 vulnerabilities, secure API design, phishing defense, credential stuffing mitigation, SOC 2 compliance, and zero-trust identity verification.',
    learningOutcomes: [
      'Prevent and remediate OWASP Top 10 vulnerabilities (SQLi, XSS, SSRF, IDOR)',
      'Architect Zero-Trust enterprise networks with Mutual TLS and OAuth2',
      'Conduct automated dependency vulnerability audits (Snyk, Dependabot)',
      'Design secure session management and multi-factor authentication (MFA)',
      'Prepare engineering teams for SOC 2 Type II, ISO 27001, and GDPR compliance',
      'Create effective incident response runbooks and triage procedures'
    ],
    whoShouldEnroll: [
      'Software developers writing production web and API services',
      'IT operations and security engineers responsible for enterprise compliance',
      'Engineering managers preparing teams for client security audits'
    ],
    examDetails: {
      format: 'Proctored Security MCQ & Vulnerability Analysis',
      questions: 40,
      duration: '60 Minutes',
      passingScore: '80%',
      retakePolicy: '2 free retakes',
      certificationAuthority: 'Ignitoverse Cyber Defense Council'
    },
    certificateName: 'Certified Enterprise Zero-Trust Security Specialist (CEZTSS)',
    certificateType: 'Enterprise Security Compliance Verifiable Credential',
    modules: [
      {
        id: 'sec-mod-1',
        title: 'Module 1: The Modern Threat Landscape & OWASP Top 10',
        duration: '3h 30m',
        lectures: [
          { title: 'Anatomy of Modern Breaches: Credential Stuffing & Supply Chain Attacks', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Deep-Dive: Injection Attacks (SQLi, Command Injection, NoSQLi)', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Broken Object-Level Authorization (BOLA / IDOR) in REST APIs', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'sec-mod-2',
        title: 'Module 2: Zero-Trust Architecture & Identity Management',
        duration: '3h 30m',
        lectures: [
          { title: 'Never Trust, Always Verify: Core Zero-Trust Pillars', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Mutual TLS (mTLS) for Internal Microservice Communication', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Hardware Security Keys (FIDO2 / WebAuthn) & Phishing-Resistant MFA', duration: '65m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'sec-mod-3',
        title: 'Module 3: Secure Coding & DevSecOps Integration',
        duration: '3h 30m',
        lectures: [
          { title: 'Static Application Security Testing (SAST) in GitHub Actions', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Software Bill of Materials (SBOM) & Open-Source Dependency Security', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Secrets Management: Vault, AWS Secrets Manager, and GitLeaks', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'sec-mod-4',
        title: 'Module 4: Enterprise Compliance (SOC 2, ISO 27001, GDPR)',
        duration: '3h 30m',
        lectures: [
          { title: 'SOC 2 Trust Services Criteria: Security, Availability & Confidentiality', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Audit Trails, Immutable Logging & SIEM Integration', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Handling Data Subject Access Requests (DSAR) under GDPR/CCPA', duration: '55m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'sec-mod-5',
        title: 'Module 5: Incident Response & Certification MCQ Exam',
        duration: '4h 00m',
        lectures: [
          { title: 'Forming a Computer Security Incident Response Team (CSIRT)', duration: '50m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Ransomware Containment & Post-Mortem Blameless Audits', duration: '60m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Final Security Credential Proctored Simulation Exam', duration: '90m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'mc-workplace-ethics',
    slug: 'corporate-ethics-compliance-inclusion',
    title: 'Workplace Ethics, Compliance & Inclusive Leadership',
    category: 'Non-Technical',
    domain: 'Compliance & Governance',
    level: 'All Levels',
    duration: '6 Hours',
    modulesCount: 3,
    lecturesCount: 10,
    fee: 'Included in Org Plan',
    format: 'Video Cases & Interactive Compliance MCQs',
    language: 'English',
    prerequisites: 'None',
    rating: 4.9,
    studentsCount: '34,120',
    lastUpdated: 'August 2026',
    instructor: 'Pooja Narang (Senior Counsel & Corporate Governance Officer)',
    badgeText: 'MANDATORY COMPLIANCE',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
    description: 'Ensure complete corporate compliance across anti-harassment (POSH), anti-bribery (FCPA), unconscious bias reduction, data privacy, and ethical decision-making.',
    learningOutcomes: [
      'Recognize and prevent workplace harassment, microaggressions, and bias',
      'Understand corporate anti-bribery, anti-corruption, and conflict-of-interest rules',
      'Apply ethical frameworks to artificial intelligence and automated systems',
      'Safeguard proprietary intellectual property and client confidentiality',
      'Foster inclusive team norms where diverse viewpoints thrive',
      'Understand whistleblower protection mechanisms and reporting channels'
    ],
    whoShouldEnroll: [
      'All enterprise employees requiring annual compliance recertification',
      'People managers and HR business partners',
      'Executives safeguarding corporate governance standards'
    ],
    examDetails: {
      format: 'Compliance Scenario MCQ Exam',
      questions: 20,
      duration: '30 Minutes',
      passingScore: '85%',
      retakePolicy: 'Immediate retake until compliance threshold is met',
      certificationAuthority: 'Ignitoverse Corporate Governance Council'
    },
    certificateName: 'Enterprise Certificate in Workplace Ethics & Compliance',
    certificateType: 'Corporate HR Mandatory Recertification Credential',
    modules: [
      {
        id: 'eth-mod-1',
        title: 'Module 1: Anti-Harassment, POSH & Respectful Workplaces',
        duration: '2h 00m',
        lectures: [
          { title: 'Definitions, Case Studies & Legal Frameworks', duration: '35m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Bystander Intervention: Safe Ways to Support Colleagues', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Maintaining Respect in Digital Channels (Slack, Teams, Email)', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'eth-mod-2',
        title: 'Module 2: Anti-Bribery, Conflicts of Interest & Data Ethics',
        duration: '2h 00m',
        lectures: [
          { title: 'Gifts, Hospitality & FCPA / UK Bribery Act Compliance', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Managing Personal Conflicts of Interest and Moonlighting', duration: '35m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Client Confidentiality & Insider Trading Prevention', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'eth-mod-3',
        title: 'Module 3: Inclusive Leadership & Final Compliance Exam',
        duration: '2h 00m',
        lectures: [
          { title: 'Unconscious Bias in Hiring, Promotion and Daily Reviews', duration: '40m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Whistleblower Protections & Reporting Channels', duration: '35m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'Mandatory Compliance Assessment & Instant Certificate Issuance', duration: '45m', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  }
];

// Sample verification database for Certificate Verification Page
export const sampleVerifiedCertificates = {
  'IGN-JAVA-8821': {
    certificateId: 'IGN-JAVA-8821',
    holderName: 'Ananya Sharma',
    organization: 'Tata Consultancy Services (TCS)',
    courseTitle: 'Java Enterprise Architecture & Spring Boot',
    credentialTitle: 'Certified Java Enterprise Microservice Specialist (CJEMS)',
    issueDate: 'August 14, 2026',
    score: '94%',
    status: 'Verified & Active',
    qrCodeId: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IGN-JAVA-8821'
  },
  'IGN-STR-4412': {
    certificateId: 'IGN-STR-4412',
    holderName: 'Karthik Raman',
    organization: 'Hitachi Digital Services',
    courseTitle: 'Workplace Stress Management & Executive Resilience',
    credentialTitle: 'Certified Workplace Mental Resilience Practitioner (CWMRP)',
    issueDate: 'August 22, 2026',
    score: '98%',
    status: 'Verified & Active',
    qrCodeId: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IGN-STR-4412'
  },
  'IGN-PY-9930': {
    certificateId: 'IGN-PY-9930',
    holderName: 'Priya Mukherjee',
    organization: 'Infosys Limited',
    courseTitle: 'Python for Enterprise Data Analytics & Automation',
    credentialTitle: 'Certified Enterprise Python Data Associate (CEPDA)',
    issueDate: 'July 29, 2026',
    score: '91%',
    status: 'Verified & Active',
    qrCodeId: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IGN-PY-9930'
  }
};
