import React from 'react';

// Hero Section Content
export const heroContent = {
  title: "AI-Powered Code Reviews That Save Development Time",
  subtitle: "Get professional-quality feedback in minutes, reduce bugs by 30%, and ship code faster",
  primaryCTA: "Try for Free",
  secondaryCTA: "See How It Works"
};

// Why Choose PR Reviewer Content
export const valuePropositionContent = {
  title: "Why Choose PR Reviewer",
  benefits: [
    {
      icon: "Clock",
      title: "40% Faster Reviews",
      description: "Cut your review cycles from days to hours with instant AI feedback. Stop waiting for manual reviews."
    },
    {
      icon: "Shield",
      title: "Reduce Bugs by 30%",
      description: "Catch bugs, security issues, and performance bottlenecks early. Build more reliable software."
    },
    {
      icon: "BarChart",
      title: "Track Progress",
      description: "Monitor your code quality improvement over time with powerful analytics. Identify trends and celebrate wins."
    }
  ]
};

// How It Works Content
export const howItWorksContent = {
  title: "How It Works",
  steps: [
    {
      icon: "Github",
      title: "Connect Your Repository",
      description: "Link your GitHub or GitLab account to get started in seconds. No complicated setup required.",
      time: "1 minute"
    },
    {
      icon: "GitPullRequest",
      title: "Submit PR for Analysis",
      description: "Paste your pull request URL or select from your repositories to start the AI-powered analysis.",
      time: "30 seconds"
    },
    {
      icon: "Code",
      title: "Review AI Suggestions",
      description: "Receive detailed feedback organized by category. Explore issues with context and suggested solutions.",
      time: "2-5 minutes"
    },
    {
      icon: "Check",
      title: "Apply Fixes to Your Code",
      description: "Implement suggested improvements directly or export feedback to your pull request comments.",
      time: "Varies by complexity"
    }
  ]
};

// Team & Organization Content
export const teamContent = {
  title: "Built for Teams and Organizations",
  description: "Transform individual code reviews into organizational knowledge",
  benefits: [
    {
      icon: "Network",
      title: "Collective Intelligence",
      description: "Turn individual PR reviews into a shared knowledge base of best practices specific to your codebase. Establish patterns and conventions unique to your team."
    },
    {
      icon: "Users",
      title: "Team Performance Analytics",
      description: "Track team progress, identify skill gaps, and celebrate quality improvements across projects. Get insights into team strengths and areas for growth."
    },
    {
      icon: "Puzzle",
      title: "Intelligent Work Assignment",
      description: "Match developers to tasks based on skill profiles and expertise areas, optimizing team velocity. Ensure the right people work on the right code."
    },
    {
      icon: "CheckSquare",
      title: "Consistent Code Standards",
      description: "Ensure uniform quality across the organization with customizable rule sets and standards enforcement. Maintain consistency even as teams grow and change."
    }
  ],
  enterpriseFeatures: [
    { icon: "Key", name: "SSO Integration" },
    { icon: "Lock", name: "Advanced Permissions" },
    { icon: "Sliders", name: "Custom Rule Enforcement" },
    { icon: "FileBarChart", name: "Audit Reports" }
  ]
};

// Individual Developer Content (New)
export const individualContent = {
  title: "Elevate Your Coding Skills at Any Level",
  description: "Supercharge your personal projects and accelerate your professional growth",
  benefits: [
    {
      icon: "TrendingUp",
      title: "Clear Path to Growth",
      description: "Whether you're a beginner or seasoned developer, gain insights to level up your code quality through consistent, actionable feedback."
    },
    {
      icon: "BarChart2",
      title: "Track Your Progress",
      description: "Visualize your coding journey with personalized dashboards showing improvement over time. Identify your strengths and areas for growth."
    },
    {
      icon: "Briefcase",
      title: "Build Your Portfolio",
      description: "Create a history of improvements that demonstrates your commitment to quality code. Perfect for freelancers and open-source contributors."
    },
    {
      icon: "BookOpen",
      title: "Learn Best Practices",
      description: "Discover industry-standard patterns and techniques through practical examples in your own code. Learn faster by doing."
    }
  ]
};

// Security Features Content
export const securityContent = {
  title: "Enterprise-grade Security",
  features: [
    {
      icon: "FileText",
      title: "Your Code Stays Private",
      description: "Code never leaves your secure environment. Analysis occurs in isolated containers."
    },
    {
      icon: "UserCheck",
      title: "Secure Authentication",
      description: "OAuth integration with GitHub/GitLab and email verification ensures only authorized access."
    },
    {
      icon: "Award",
      title: "Compliance Ready",
      description: "Built with SOC 2 and GDPR compliance in mind. Data retention controls available."
    },
    {
      icon: "Shield",
      title: "Isolated LLM Processing",
      description: "AI processing occurs in secure environments with no data retention or model training."
    }
  ],
  certifications: [
    "SOC 2 Compliance (In Progress)",
    "GDPR Compliant",
    "ISO 27001 (Planned)"
  ]
};

// Customer Results Content
export const resultsContent = {
  title: "Results Our Customers Are Seeing",
  metrics: [
    {
      value: "25%",
      label: "Reduced Onboarding Time"
    },
    {
      value: "30%",
      label: "Fewer Production Bugs"
    }
  ],
  // Note: These are placeholder case studies until real ones are available
  note: "Early access feedback has been positive. Case studies coming soon."
};

// Free Trial Content
export const freeTrialContent = {
  title: "Start with 5 Free PRs",
  description: "No credit card required. Experience the full power of PR Reviewer with 5 free analyses.",
  buttonText: "Start Now",
  pricingTable: {
    title: "Choose the right plan for you",
    note: "Introductory pricing - subject to change during beta",
    plans: [
      {
        name: "Free",
        price: "0",
        highlight: "Try it out",
        features: [
          "5 PRs total (one-time)",
          "JavaScript, Python, Java, C#, TypeScript",
          "Standard analysis (15 min)",
          "Basic code review",
          "GitHub only",
          "Community support"
        ]
      },
      {
        name: "Individual",
        price: "15",
        period: "month",
        highlight: "Most popular",
        features: [
          "20 PRs per month",
          "All supported languages",
          "Priority analysis (5 min)",
          "Comprehensive review",
          "Basic metrics dashboard",
          "GitHub, GitLab support",
          "Email support"
        ]
      },
      {
        name: "Team",
        price: "39",
        period: "month",
        highlight: "Best value",
        features: [
          "100 PRs per month",
          "All supported languages",
          "Priority+ analysis (2 min)",
          "Comprehensive review + patterns",
          "Full team analytics",
          "All major platforms",
          "Priority support"
        ]
      },
      {
        name: "Enterprise",
        price: "Custom",
        highlight: "For larger teams",
        features: [
          "Unlimited PRs",
          "Custom language support",
          "Immediate analysis",
          "Custom rules engine",
          "Advanced analytics & reporting",
          "Custom integrations",
          "Dedicated account manager"
        ]
      }
    ]
  }
};
