import type { UiKey } from '../i18n/ui';

// Public projects shown in the "Lab" section of the home page — SINGLE SOURCE.
// Names and stack tags are proper nouns (not translated); descriptions go through ui.ts.
export interface Project {
  name: string;
  href: string;
  descriptionKey: UiKey;
  stack: readonly string[];
}

export const projects: readonly Project[] = [
  {
    name: 'agent-skills',
    href: 'https://github.com/djolaq/agent-skills',
    descriptionKey: 'lab.agentSkills.body',
    stack: ['OWASP ASVS', 'Laravel', 'Claude Code', 'opencode'],
  },
  {
    name: 'strix-config',
    href: 'https://github.com/djolaq/strix-config',
    descriptionKey: 'lab.strix.body',
    stack: ['Strix', 'Shell', 'LLM', 'Pentest'],
  },
  {
    name: 'johannlaqua.com',
    href: 'https://github.com/djolaq/johannlaqua.com',
    descriptionKey: 'lab.site.body',
    stack: ['Astro', 'TypeScript', 'Playwright', 'GitHub Actions'],
  },
];
