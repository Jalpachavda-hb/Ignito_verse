/**
 * Topic PDF Knowledge Base & Text Extraction Map
 * Provides page contents, keywords, and reference materials for in-page PDF viewing and AI Tutor integration.
 */

export const microcredentialTopicPdfMap = {
  // Stress Management Course Topics
  'INTRODUCTION TO STRESS': {
    topicName: 'INTRODUCTION TO STRESS',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    pageCount: 8,
    pageContent: `Unit 1: Introduction to Stress Management.
Stress is a natural psychological and physiological reaction to demands, pressures, and environmental changes.
Key Concepts:
- Eustress (positive stress that motivates and focuses energy).
- Distress (negative stress causing anxiety, decreased performance, and health issues).
- Homeostasis: The physiological equilibrium that the body attempts to maintain when encountering external stressors.
- Hans Selye's General Adaptation Syndrome (GAS) model: Alarm reaction, Resistance, and Exhaustion stages.
- Cognitive Appraisal Theory by Lazarus & Folkman: Primary appraisal (evaluating threat vs challenge) and Secondary appraisal (assessing available coping resources).`,
    keywords: ['stress', 'eustress', 'distress', 'homeostasis', 'general adaptation syndrome', 'lazarus', 'selye', 'appraisal']
  },
  'SOURCES OF STRESS': {
    topicName: 'SOURCES OF STRESS',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    pageCount: 12,
    pageContent: `Unit 2: Sources and Triggers of Stress (Internal & External).
Sources of stress in workplace and personal environments:
- Environmental Stressors: Noise, crowding, air quality, commuting, workspace ergonomic deficiencies.
- Organizational & Work Stressors: Heavy workloads, unrealistic deadlines, lack of role clarity, conflict with supervisors or peers, job insecurity, micromanagement.
- Interpersonal Stressors: Relationship strain, social isolation, communication breakdown.
- Internal Psychological Stressors: Perfectionism, catastrophic thinking, imposter syndrome, negative self-talk, rigid expectations.
- Life Events & Transitional Stress: Major career shifts, financial obligations, health challenges.`,
    keywords: ['sources', 'triggers', 'workplace', 'workload', 'deadlines', 'perfectionism', 'ergonomics', 'interpersonal', 'burnout']
  },
  'IMPACT OF STRESS': {
    topicName: 'IMPACT OF STRESS',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    pageCount: 10,
    pageContent: `Unit 3: Physiological, Psychological, and Behavioral Impact of Chronic Stress.
- Cardiovascular System: Elevated heart rate, hypertension, vasoconstriction, increased risk of myocardial events.
- Nervous System: Sustained sympathetic nervous system hyperactivity, hypothalamic-pituitary-adrenal (HPA) axis dysregulation.
- Immune System: Immunosuppression, prolonged inflammation, reduced lymphocyte proliferation.
- Cognitive Effects: Impaired executive functioning, working memory deficits, reduced decision-making speed.
- Behavioral Symptoms: Sleep disturbances, insomnia, dietary changes, procrastination, social withdrawal.`,
    keywords: ['impact', 'chronic', 'hpa axis', 'cardiovascular', 'hypertension', 'immune', 'cognitive', 'insomnia', 'cortisol']
  },
  'STRESS RESPONSE': {
    topicName: 'STRESS RESPONSE',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    pageCount: 9,
    pageContent: `Unit 4: Biological and Neurological Mechanics of the Stress Response.
The Fight-or-Flight Response:
- Amygdala triggers an emotional response signal to the hypothalamus upon threat perception.
- The Hypothalamus activates the Sympathetic Nervous System (SNS) via autonomic nerve signals to the adrenal glands.
- Adrenal Medulla releases Catecholamines (Epinephrine / Adrenaline and Norepinephrine), causing bronchodilation, tachycardia, and glucose release.
- Adrenal Cortex releases Cortisol through the HPA axis to sustain gluconeogenesis and suppress non-essential processes during acute threat.
- The Parasympathetic Nervous System (vagus nerve stimulation) acts as a brake, restoring parasympathetic tone and physiological baseline.`,
    keywords: ['response', 'fight or flight', 'amygdala', 'hypothalamus', 'epinephrine', 'adrenaline', 'cortisol', 'parasympathetic', 'vagus nerve']
  },
  'COPING MECHANISMS': {
    topicName: 'COPING MECHANISMS',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    pageCount: 14,
    pageContent: `Unit 5: Evidence-Based Coping Strategies and Resilience Interventions.
- Problem-Focused Coping: Time blocking, Eisenhower Matrix prioritization, assertiveness communication, task delegation.
- Emotion-Focused Coping: Mindfulness-based stress reduction (MBSR), cognitive reframing, emotional regulation journaling.
- Somatic & Physiological De-escalation: Diaphragmatic breathing (4-7-8 method), box breathing, progressive muscle relaxation (PMR), aerobic exercise.
- Cognitive Restructuring: Identifying cognitive distortions (all-or-nothing thinking, overgeneralization), cultivating self-compassion.
- Organizational Resilience: Boundary setting between work and life, taking deliberate micro-breaks, fostering psychological safety.`,
    keywords: ['coping', 'resilience', 'problem-focused', 'emotion-focused', 'mindfulness', 'mbsr', 'breathing', 'pmr', 'relaxation', 'reframing', 'prioritization']
  }
};

/**
 * Helper to match query against topic PDF content and keywords
 */
export function findTopicPdfContent(topicName = '', question = '') {
  const normalizedTopic = (topicName || '').trim().toUpperCase();
  
  // Direct topic match
  let topicData = microcredentialTopicPdfMap[normalizedTopic];
  
  if (!topicData) {
    // Search by partial topic match
    const key = Object.keys(microcredentialTopicPdfMap).find(k => normalizedTopic.includes(k) || k.includes(normalizedTopic));
    if (key) {
      topicData = microcredentialTopicPdfMap[key];
    }
  }

  if (!topicData) {
    // Fallback default
    topicData = microcredentialTopicPdfMap['INTRODUCTION TO STRESS'];
  }

  const qLower = (question || '').toLowerCase();
  const matchedKeywords = topicData.keywords.filter(kw => qLower.includes(kw));

  return {
    topicName: topicData.topicName,
    pdfUrl: topicData.pdfUrl,
    pageCount: topicData.pageCount,
    pageContent: topicData.pageContent,
    matchedKeywords
  };
}
