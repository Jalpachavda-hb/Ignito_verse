// ignitoverse: Enterprise Data (Logos, Testimonials, Value Pillars, Impact Stats)
export const trustedEnterprises = [
  { name: 'Tata Consultancy Services', short: 'TCS', industry: 'IT & Consulting', employeesTrained: '45,000+' },
  { name: 'Hitachi Digital Services', short: 'HITACHI', industry: 'Industrial & Technology', employeesTrained: '18,500+' },
  { name: 'Infosys', short: 'INFOSYS', industry: 'Enterprise Cloud & AI', employeesTrained: '32,000+' },
  { name: 'Wipro Enterprises', short: 'WIPRO', industry: 'Digital Transformation', employeesTrained: '24,000+' },
  { name: 'Larsen & Toubro', short: 'L&T', industry: 'Engineering & Infrastructure', employeesTrained: '15,000+' },
  { name: 'Accenture', short: 'ACCENTURE', industry: 'Strategy & Technology', employeesTrained: '28,000+' },
  { name: 'Tech Mahindra', short: 'TECH MAHINDRA', industry: 'Telecom & Digital', employeesTrained: '19,000+' },
  { name: 'Cognizant', short: 'COGNIZANT', industry: 'Digital Business Solutions', employeesTrained: '22,500+' }
];

export const valuePillars = [
  {
    id: 1,
    number: '01',
    title: 'Certified Microcredentials',
    subtitle: 'Targeted Technical & Non-Technical Skills',
    description: 'Bite-sized, modular learning tracks (10–20 hours) designed specifically for enterprise workflows. Enables engineers and managers to upskill without pausing active client deliverables.',
    iconName: 'Award',
    highlights: ['Java, Python, Cloud & DevOps', 'Stress Mgmt & Executive Comms', 'Industry-Aligned Curriculum']
  },
  {
    id: 2,
    number: '02',
    title: 'Proctored MCQ Assessments',
    subtitle: 'Rigorously Evaluated Competency',
    description: 'Every microcredential culminates in a standardized, proctored MCQ exam with anti-cheat safeguards and instant digital verifiable credentials recognized by top tier-1 enterprises.',
    iconName: 'CheckCircle2',
    highlights: ['Standardized 70%+ benchmark', 'Instant scoring & analytics', 'Verifiable QR code credentials']
  },
  {
    id: 3,
    number: '03',
    title: 'L&D & HR Analytics Engine',
    subtitle: 'Real-time Cohort Visibility',
    description: 'Comprehensive administrative dashboard for HR, L&D heads, and engineering directors to track team completion rates, skill heatmaps, compliance audits, and ROI.',
    iconName: 'BarChart3',
    highlights: ['Single Sign-On (Okta / Azure AD)', 'Cohort progress heatmaps', 'LMS / HRMS webhook export']
  }
];

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Assign & Enroll',
    tag: 'Enterprise Portal',
    desc: 'HR and Team Leads assign custom microcredential tracks to cohorts via bulk CSV upload or direct Okta/Azure SSO sync.'
  },
  {
    step: '02',
    title: 'Learn on Demand',
    tag: 'Bite-Sized Videos',
    desc: 'Employees access HD video lectures, downloadable cheat sheets, and practical real-world scenarios on web and mobile.'
  },
  {
    step: '03',
    title: 'Attempt MCQ Exam',
    tag: 'Proctored Benchmarking',
    desc: 'Learners complete scenario-based MCQ assessments designed to test genuine problem-solving ability, not rote memorization.'
  },
  {
    step: '04',
    title: 'Verify & Certify',
    tag: 'Digital Credentials',
    desc: 'Graduates receive cryptographically signed, verifiable digital certificates automatically logged into the company HRMS.'
  }
];

export const categoryDomains = {
  technical: [
    { title: 'Java & Spring Boot Architecture', count: '8 Microcredentials', icon: 'Code', desc: 'Backend microservices, JVM tuning, and high-load architecture.' },
    { title: 'Python & Data Analytics', count: '12 Microcredentials', icon: 'Database', desc: 'Automated data pipelines, Pandas, and business intelligence.' },
    { title: 'Cloud Infrastructure & DevOps', count: '10 Microcredentials', icon: 'Cloud', desc: 'Multi-cloud architecture, Terraform IaC, Kubernetes, and CI/CD.' },
    { title: 'Cybersecurity & Zero-Trust', count: '6 Microcredentials', icon: 'ShieldCheck', desc: 'OWASP defense, SOC 2 compliance, and API security.' }
  ],
  nonTechnical: [
    { title: 'Stress Management & Resilience', count: '6 Microcredentials', icon: 'HeartPulse', desc: 'Cognitive behavioral coping, anti-burnout protocols, and mental stamina.' },
    { title: 'Executive Communication', count: '9 Microcredentials', icon: 'MessageSquare', desc: 'Minto Pyramid principle, C-suite presentations, and negotiation.' },
    { title: 'Agile Team Leadership', count: '7 Microcredentials', icon: 'Compass', desc: 'Cross-functional alignment, coaching, and psychological safety.' },
    { title: 'Corporate Ethics & POSH', count: '5 Microcredentials', icon: 'FileText', desc: 'Mandatory enterprise compliance, FCPA, and inclusive leadership.' }
  ]
};

export const whyEnterprisesChooseUs = [
  {
    title: 'Bulk Enrollment & Enterprise SSO',
    desc: 'Seamlessly onboard 10,000+ employees in seconds with SAML 2.0, Okta, Azure Active Directory, and Google Workspace integration.',
    icon: 'Users2'
  },
  {
    title: 'Centralized L&D & HR Dashboards',
    desc: 'Monitor real-time cohort engagement, completion bottlenecks, score distributions, and certification audit trails.',
    icon: 'LayoutDashboard'
  },
  {
    title: 'Audit & Compliance-Ready Certificates',
    desc: 'Tamper-proof digital credentials with instant QR verification for client RFP compliance, ISO audits, and internal skill matrices.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Custom Learning Tracks & Co-Branding',
    desc: 'Combine specific technical and soft skill microcredentials into bespoke bootcamps co-branded with your enterprise logo.',
    icon: 'Layers'
  }
];

export const impactStats = [
  { value: '94%', label: 'Course Completion Rate', sublabel: 'vs 12% industry MOOC average' },
  { value: '3.5x', label: 'Faster Upskilling Cycle', sublabel: 'Short modular certifications' },
  { value: '500+', label: 'Enterprises Upskilled', sublabel: 'Including Fortune 500 tech leaders' },
  { value: '4.92 / 5', label: 'Average Learner Rating', sublabel: 'Over 1.2M+ verified evaluations' }
];

export const clientTestimonials = [
  {
    id: 1,
    num: '01',
    quote: "Ignitoverse has revolutionized our technical onboarding. New Java and Cloud engineers become project-ready in 3 weeks with verified microcredentials instead of traditional 3 month classroom delays.",
    name: "Saurabh Mukherjee",
    role: "VP of Global Talent Development",
    company: "Tata Consultancy Services (TCS)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    num: '02',
    quote: "The combination of technical microcredentials and workplace stress management has had a measurable impact on employee retention and delivery velocity across our high-stakes enterprise programs.",
    name: "Hiroshi Tanaka",
    role: "Senior Director of Engineering Capability",
    company: "Hitachi Digital Services",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    num: '03',
    quote: "The MCQ proctoring and real-time L&D dashboard make skill compliance transparent for our client audit requirements. It is by far the most enterprise-ready upskilling platform we have used.",
    name: "Deepika Rao",
    role: "Chief Learning Officer",
    company: "Infosys Cloud Practice",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    num: '04',
    quote: "Our engineering cohorts transitioned seamlessly to modular microlearning. Course completion jumped from 18% to over 92% within the first two quarters of deployment.",
    name: "Rajesh Kannan",
    role: "Head of Talent Transformation",
    company: "Wipro Enterprises",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    num: '05',
    quote: "The tamper-proof verifiable credentials give our enterprise clients instant assurance of our engineers' verified capability in full-stack architecture and zero-trust security.",
    name: "Elena Rostova",
    role: "Global Director of People & Culture",
    company: "Cognizant Digital Systems",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80"
  }
];
