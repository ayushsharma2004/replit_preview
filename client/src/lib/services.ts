export interface AIService {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export const aiServices: AIService[] = [
  {
    id: 1,
    title: "Quantum AI Processing",
    description: "Leveraging quantum computing principles to process complex data patterns at unprecedented speeds.",
    icon: "robot",
    features: [
      "Parallel data processing",
      "Adaptive learning algorithms",
      "Quantum-inspired optimization"
    ]
  },
  {
    id: 2,
    title: "Cosmic Neural Networks",
    description: "Deep learning systems inspired by celestial patterns, capable of unprecedented pattern recognition.",
    icon: "brain",
    features: [
      "Multi-dimensional learning",
      "Adaptive network architecture",
      "Gravitational data pooling"
    ]
  },
  {
    id: 3,
    title: "Stellar Predictive Analytics",
    description: "Forecasting systems that use astronomical precision to predict business outcomes and market trends.",
    icon: "chart-line",
    features: [
      "Time-series forecasting",
      "Anomaly detection",
      "Market behavior modeling"
    ]
  },
  {
    id: 4,
    title: "Galactic Language Processing",
    description: "Advanced NLP systems that understand and generate human language with cosmic precision.",
    icon: "comment-alt",
    features: [
      "Sentiment analysis",
      "Content generation",
      "Multilingual translation"
    ]
  },
  {
    id: 5,
    title: "Nebula Security Systems",
    description: "AI-powered security solutions that protect your data with the density of a neutron star.",
    icon: "shield-alt",
    features: [
      "Threat detection",
      "Adaptive firewalls",
      "Quantum encryption"
    ]
  },
  {
    id: 6,
    title: "Orbital Process Automation",
    description: "Intelligent automation systems that orbit your business processes, streamlining operations with gravitational efficiency.",
    icon: "cogs",
    features: [
      "Workflow optimization",
      "Intelligent task routing",
      "Autonomous decision-making"
    ]
  }
];
