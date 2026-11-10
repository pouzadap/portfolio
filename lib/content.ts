export const links = {
  linkedin: 'https://www.linkedin.com/in/pedropefernandes/',
  github: 'https://github.com/pouzadap',
  email: 'pouzadap@gmail.com',
  darkdome: 'https://darkdome.io',
};

export const hardSkills: { name: string; tier: 'core' | 'build' }[] = [
  { name: 'Software Architecture & System Design', tier: 'core' },
  { name: 'AI Engineering & LLM Integration', tier: 'core' },
  { name: 'AI Agents & Workflow Automation', tier: 'core' },
  { name: 'Backend Engineering', tier: 'build' },
  { name: 'Cloud-Native Architecture', tier: 'build' },
  { name: 'Distributed Systems & Event-Driven Architecture', tier: 'build' },
];

/** Months are 1-based; formatted per language in the Experience section. */
export const roles = [
  { title: 'Full-stack Software Developer', from: [2020, 2], to: [2022, 2] },
  { title: 'AI Engineer & Full-Stack Software Developer', from: [2022, 2], to: [2025, 6] },
  { title: 'Tech Lead & Senior AI Engineer', from: [2025, 6], to: [2026, 12] },
] as const;

/** Vertical demo clips shown as the card deck. Files come from `npm run videos`. */
export const deckVideos = [
  'every-second',
  'incident-report',
  'officially-launching',
  'replace-analysts',
  'still-investigating',
];

/**
 * Workflow module demo (16:9). Set to true after dropping the raw file in
 * briefing/refs/videos/workflows.mp4 and running `npm run videos`.
 * While false, the section shows an animated mock of the editor.
 */
export const hasWorkflowVideo = false;
