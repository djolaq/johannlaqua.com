export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const ui = {
  fr: {
    'site.title': 'Johann Laqua — Développeur Senior · IA · Cybersécurité',
    'site.description':
      "Développeur senior spécialisé en développement assisté par l'IA et en cybersécurité offensive/défensive (red & blue team).",
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.blog': 'Journal',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Aller au contenu',

    'hero.eyebrow': 'Disponible pour missions',
    'hero.title': "Je construis des logiciels solides, et je les sécurise.",
    'hero.subtitle':
      'Développeur senior, dopé à l’IA pour aller plus vite sans sacrifier la rigueur — avec un œil de red teamer sur tout ce qui est mis en production.',
    'hero.cta.primary': 'Discuter d’un projet',
    'hero.cta.secondary': 'Voir le journal',
    'hero.stat.experience': "ans d'expérience",
    'hero.stat.experienceValue': '10+',
    'hero.stat.discipline': 'disciplines',
    'hero.stat.disciplineValue': '2',
    'hero.stat.disciplineLabel': 'Dev & Sécurité',
    'hero.stat.mode': 'mode de travail',
    'hero.stat.modeValue': 'IA-first',

    'about.eyebrow': 'À propos',
    'about.title': 'Un développeur qui pense comme un attaquant',
    'about.body1':
      "Je conçois et je construis des applications de bout en bout, en m'appuyant fortement sur des outils IA pour accélérer la production tout en gardant un haut niveau d'exigence sur l'architecture et la qualité du code.",
    'about.body2':
      "Ce qui distingue mon approche : une pratique active de la cybersécurité, côté attaque (red team) comme côté défense (blue team). Je sais où un système va lâcher parce que je m'entraîne à le faire lâcher.",
    'about.body3':
      'Résultat : du code qui va vite à produire, et qui reste difficile à casser.',

    'services.eyebrow': 'Services',
    'services.title': 'Comment je peux vous aider',
    'services.subtitle':
      'Trois façons de travailler ensemble, du sprint ponctuel à l’accompagnement long terme.',
    'services.dev.title': 'Développement IA-boosted',
    'services.dev.body':
      'Applications web et outils internes conçus et livrés vite grâce à un usage intensif des assistants IA, sans dette technique cachée.',
    'services.security.title': 'Audit & Pentest',
    'services.security.badge': 'Populaire',
    'services.security.body':
      'Tests d’intrusion applicatifs et infrastructure, revue de code orientée sécurité, et remédiation concrète des vulnérabilités trouvées.',
    'services.advisory.title': 'Conseil technique',
    'services.advisory.body':
      'Revue d’architecture, choix technologiques, mise en place de bonnes pratiques de sécurité dès la conception (security by design).',
    'services.cta': 'En savoir plus',

    'blog.eyebrow': 'Journal',
    'blog.title': 'Notes récentes',
    'blog.subtitle':
      'Retours d’expérience sur le développement assisté par IA et la cybersécurité offensive/défensive.',
    'blog.viewAll': 'Tous les articles',
    'blog.readMore': 'Lire l’article',
    'blog.back': 'Retour au journal',
    'blog.empty': 'Aucun article pour le moment. Revenez bientôt.',
    'blog.pageTitle': 'Journal',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Un projet, une question ?',
    'contact.subtitle':
      'La façon la plus simple de me joindre reste l’e-mail. Je réponds généralement sous 48h.',
    'contact.cta': 'Écrire un e-mail',
    'contact.social': 'Me retrouver ailleurs',

    'footer.rights': 'Tous droits réservés.',
    'footer.builtWith': 'Site statique, sans tracker.',
  },
  en: {
    'site.title': 'Johann Laqua — Senior Developer · AI · Cybersecurity',
    'site.description':
      'Senior developer specialized in AI-boosted development and offensive/defensive cybersecurity (red & blue team).',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Skip to content',

    'hero.eyebrow': 'Open to new missions',
    'hero.title': 'I build software that holds up, and I make it hard to break.',
    'hero.subtitle':
      'Senior developer, AI-boosted to move faster without cutting corners — with a red teamer’s eye on everything that ships.',
    'hero.cta.primary': 'Start a conversation',
    'hero.cta.secondary': 'Read the blog',
    'hero.stat.experience': 'years of experience',
    'hero.stat.experienceValue': '10+',
    'hero.stat.discipline': 'disciplines',
    'hero.stat.disciplineValue': '2',
    'hero.stat.disciplineLabel': 'Dev & Security',
    'hero.stat.mode': 'working mode',
    'hero.stat.modeValue': 'AI-first',

    'about.eyebrow': 'About',
    'about.title': 'A developer who thinks like an attacker',
    'about.body1':
      'I design and build applications end to end, relying heavily on AI tooling to move fast while holding a high bar for architecture and code quality.',
    'about.body2':
      'What sets my approach apart: an active cybersecurity practice, on the offense (red team) as well as the defense (blue team). I know where a system will break because I train to break it.',
    'about.body3':
      'The result: code that ships fast, and stays hard to crack.',

    'services.eyebrow': 'Services',
    'services.title': 'How I can help',
    'services.subtitle':
      'Three ways to work together, from a one-off sprint to long-term support.',
    'services.dev.title': 'AI-boosted development',
    'services.dev.body':
      'Web applications and internal tools designed and shipped fast through heavy use of AI assistants, without hidden technical debt.',
    'services.security.title': 'Security audit & pentest',
    'services.security.badge': 'Popular',
    'services.security.body':
      'Application and infrastructure penetration testing, security-focused code review, and concrete remediation of the vulnerabilities found.',
    'services.advisory.title': 'Technical advisory',
    'services.advisory.body':
      'Architecture review, technology choices, and security-by-design practices baked in from the start.',
    'services.cta': 'Learn more',

    'blog.eyebrow': 'Blog',
    'blog.title': 'Recent notes',
    'blog.subtitle':
      'Field notes on AI-assisted development and offensive/defensive cybersecurity.',
    'blog.viewAll': 'All posts',
    'blog.readMore': 'Read the post',
    'blog.back': 'Back to the blog',
    'blog.empty': 'No posts yet. Check back soon.',
    'blog.pageTitle': 'Blog',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Have a project in mind?',
    'contact.subtitle':
      'Email is the fastest way to reach me. I usually reply within 48 hours.',
    'contact.cta': 'Send an email',
    'contact.social': 'Find me elsewhere',

    'footer.rights': 'All rights reserved.',
    'footer.builtWith': 'Static site, no trackers.',
  },
} as const;

export type UiKey = keyof (typeof ui)['fr'];
