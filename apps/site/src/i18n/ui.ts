export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const ui = {
  fr: {
    'site.title': 'Johann Laqua — Développeur Senior · IA · Cybersécurité',
    'site.description':
      "Développeur senior spécialisé en développement assisté par l'IA et en cybersécurité offensive/défensive (red & blue team).",
    'site.role': 'Développeur Senior · IA · Cybersécurité',
    'nav.about': 'À propos',
    'nav.skills': 'Compétences',
    'nav.lab': 'Lab',
    'nav.blog': 'Journal',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Aller au contenu',
    'aria.primaryNav': 'Navigation principale',
    'aria.footerNav': 'Navigation de pied de page',
    'aria.announce': 'Annonce',
    'aria.switchToFrench': 'Afficher la version française',
    'aria.switchToEnglish': 'Afficher la version anglaise',
    'aria.breadcrumb': 'Fil d’Ariane',
    'aria.newTab': '(s’ouvre dans un nouvel onglet)',
    'breadcrumb.home': 'Accueil',

    'hero.eyebrow': 'Développeur senior · Red & Blue team',
    'hero.kicker': 'Développeur senior, IA et cybersécurité',
    'hero.title': 'Je construis des logiciels solides,',
    'hero.titleAccent': 'et je les sécurise.',
    'hero.subtitle':
      'Développeur senior, dopé à l’IA pour aller plus vite sans sacrifier la rigueur — avec un œil de red teamer sur tout ce qui est mis en production.',
    'hero.cta.primary': 'Voir mes compétences',
    'hero.cta.secondary': 'Voir le journal',
    'hero.stat.experience': "ans d'expérience",
    'hero.stat.experienceValue': '10+',
    'hero.stat.mode': 'mode de travail',
    'hero.stat.modeValue': 'IA-first',
    'hero.stat.teamValue': 'Red & Blue',
    'hero.stat.team': 'team, attaque et défense',

    'announce.badge': 'Nouveau',
    'announce.prefix': 'Dans le journal :',
    'header.cta': 'Me contacter',

    'chart.kicker': 'Ma méthode',
    'chart.title': 'Vite, et sans dette',
    'chart.speed': 'Vitesse de livraison',
    'chart.debt': 'Dette technique',
    'chart.step1': 'Cadrage',
    'chart.step2': 'Build',
    'chart.step3': 'Revue sécu',
    'chart.step4': 'Prod',
    'chart.alt': 'Schéma : la vitesse de livraison monte à chaque étape tandis que la dette technique reste basse.',

    'about.eyebrow': 'À propos',
    'about.title': 'Un développeur qui pense',
    'about.titleAccent': 'comme un attaquant.',
    'about.body1':
      "Je conçois et je construis des applications de bout en bout, en m'appuyant fortement sur des outils IA pour accélérer la production tout en gardant un haut niveau d'exigence sur l'architecture et la qualité du code.",
    'about.body2':
      "Ce qui distingue mon approche : une pratique active de la cybersécurité, côté attaque (red team) comme côté défense (blue team). Je sais où un système va lâcher parce que je m'entraîne à le faire lâcher.",
    'about.body3':
      'Résultat : du code qui va vite à produire, et qui reste difficile à casser.',

    'skills.eyebrow': 'Compétences',
    'skills.title': 'Ce que je sais',
    'skills.titleAccent': 'faire.',
    'skills.subtitle':
      'Trois disciplines que je pratique au quotidien, et qui se renforcent l’une l’autre.',
    'skills.dev.tag': 'Build',
    'skills.dev.title': 'Développement IA-boosted',
    'skills.dev.body':
      'Concevoir et livrer des applications de bout en bout avec des agents de code, sans renoncer à l’architecture, aux tests ni à la revue.',
    'skills.dev.item1': 'Agents de code (Claude Code, opencode)',
    'skills.dev.item2': 'Skills & instructions pour agents',
    'skills.dev.item3': 'TypeScript · Astro · PHP/Laravel',
    'skills.dev.item4': 'Tests automatisés (Vitest, Playwright)',
    'skills.dev.item5': 'CI/CD GitHub Actions',
    'skills.red.tag': 'Attaque',
    'skills.red.title': 'Red team',
    'skills.red.body':
      'Chercher où un système va céder avant qu’un attaquant ne le trouve : applications web, API et code source.',
    'skills.red.item1': 'Tests d’intrusion web & API',
    'skills.red.item2': 'Pentest piloté par agents IA (Strix)',
    'skills.red.item3': 'Revue de code orientée attaque',
    'skills.red.item4': 'OWASP Top 10',
    'skills.blue.tag': 'Défense',
    'skills.blue.title': 'Blue team',
    'skills.blue.body':
      'Rendre les systèmes difficiles à casser : audit, durcissement et sécurité intégrée dès la conception.',
    'skills.blue.item1': 'Audit OWASP ASVS',
    'skills.blue.item2': 'Revue défensive Laravel',
    'skills.blue.item3': 'Durcissement de la chaîne d’approvisionnement npm',
    'skills.blue.item4': 'Security by design',

    'lab.eyebrow': 'Lab',
    'lab.title': 'Le code parle',
    'lab.titleAccent': 'pour moi.',
    'lab.subtitle':
      'Une sélection de projets open source où ces compétences sont mises en pratique. Tout est lisible sur GitHub.',
    'lab.agentSkills.body':
      'Skills portables pour agents de code : audit de sécurité selon l’OWASP ASVS v5 et revue défensive de backends Laravel, avec rapports priorisés par sévérité.',
    'lab.strix.body':
      'Configuration pour lancer des campagnes de pentest avec les agents IA open source Strix, branchées sur le même LLM que mon environnement de dev.',
    'lab.site.body':
      'Ce site : Astro statique bilingue, zéro JS client par défaut, design tokens, tests Vitest + Playwright en CI et dépendances npm verrouillées.',
    'lab.viewCode': 'Voir le code',

    'blog.eyebrow': 'Journal',
    'blog.title': 'Notes',
    'blog.titleAccent': 'récentes.',
    'blog.subtitle':
      'Retours d’expérience sur le développement assisté par IA et la cybersécurité offensive/défensive.',
    'blog.viewAll': 'Tous les articles',
    'blog.readMore': 'Lire l’article',
    'blog.empty': 'Aucun article pour le moment. Revenez bientôt.',
    'blog.pageTitle': 'Journal',
    'blog.feedTitle': 'Journal de Johann Laqua',
    'blog.previous': 'Article précédent',
    'blog.next': 'Article suivant',
    'blog.postNav': 'Autres articles',
    'blog.related': 'Sur le même sujet',
    'blog.tags.label': 'Filtrer par sujet',
    'blog.tags.all': 'Tous',
    'blog.tag.title': 'Articles sur',
    'blog.tag.pageTitle': 'Sujet : {tag}',
    'blog.tag.subtitle': 'Tous les articles du journal classés sous ce sujet.',
    'blog.tag.description': 'Les articles du journal de Johann Laqua sur {tag}.',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Échangeons',
    'contact.subtitle':
      'Une question technique, un retour sur un article ou sur un projet du lab : l’e-mail reste le plus simple.',
    'contact.cta': 'Écrire un e-mail',
    'contact.social': 'Me retrouver ailleurs',

    'footer.rights': 'Tous droits réservés.',
    'footer.builtWith': 'Site statique, sans tracker.',
    'footer.legalNotice': 'Mentions légales',
    'footer.privacy': 'Confidentialité',

    'legal.eyebrow': 'Informations légales',
    'legal.updated': 'Dernière mise à jour :',
    'legal.notice.title': 'Mentions légales',
    'legal.privacy.title': 'Politique de confidentialité',
    'legal.notice.description':
      'Mentions légales de johannlaqua.com : éditeur du site, directeur de la publication, hébergeur et propriété intellectuelle.',
    'legal.privacy.description':
      'Politique de confidentialité de johannlaqua.com : aucun cookie ni traceur, journaux techniques de l’hébergeur, données des échanges par e-mail et vos droits RGPD.',

    'notFound.title': 'Page introuvable',
    'notFound.body': "La page que vous cherchez n'existe pas ou a été déplacée.",
    'notFound.cta': "Retour à l'accueil",
    'notFound.description': 'Cette page n’existe pas sur johannlaqua.com. Retour à l’accueil ou au journal.',
    'notFound.nav': 'Où aller ?',
    'notFound.blog': 'Lire le journal',
    'notFound.contact': 'Me contacter',
  },
  en: {
    'site.title': 'Johann Laqua — Senior Developer · AI · Cybersecurity',
    'site.description':
      'Senior developer specialized in AI-boosted development and offensive/defensive cybersecurity (red & blue team).',
    'site.role': 'Senior Developer · AI · Cybersecurity',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.lab': 'Lab',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Skip to content',
    'aria.primaryNav': 'Primary',
    'aria.footerNav': 'Footer',
    'aria.announce': 'Announcement',
    'aria.switchToFrench': 'View the French version',
    'aria.switchToEnglish': 'View the English version',
    'aria.breadcrumb': 'Breadcrumb',
    'aria.newTab': '(opens in a new tab)',
    'breadcrumb.home': 'Home',

    'hero.eyebrow': 'Senior developer · Red & Blue team',
    'hero.kicker': 'Senior developer, AI and cybersecurity',
    'hero.title': 'I build software that holds up,',
    'hero.titleAccent': 'and make it hard to break.',
    'hero.subtitle':
      'Senior developer, AI-boosted to move faster without cutting corners — with a red teamer’s eye on everything that ships.',
    'hero.cta.primary': 'See my skills',
    'hero.cta.secondary': 'Read the blog',
    'hero.stat.experience': 'years of experience',
    'hero.stat.experienceValue': '10+',
    'hero.stat.mode': 'working mode',
    'hero.stat.modeValue': 'AI-first',
    'hero.stat.teamValue': 'Red & Blue',
    'hero.stat.team': 'team, offense and defense',

    'announce.badge': 'New',
    'announce.prefix': 'On the blog:',
    'header.cta': 'Get in touch',

    'chart.kicker': 'How I work',
    'chart.title': 'Fast, without the debt',
    'chart.speed': 'Delivery speed',
    'chart.debt': 'Technical debt',
    'chart.step1': 'Scoping',
    'chart.step2': 'Build',
    'chart.step3': 'Security review',
    'chart.step4': 'Prod',
    'chart.alt': 'Diagram: delivery speed rises at every step while technical debt stays low.',

    'about.eyebrow': 'About',
    'about.title': 'A developer who thinks',
    'about.titleAccent': 'like an attacker.',
    'about.body1':
      'I design and build applications end to end, relying heavily on AI tooling to move fast while holding a high bar for architecture and code quality.',
    'about.body2':
      'What sets my approach apart: an active cybersecurity practice, on the offense (red team) as well as the defense (blue team). I know where a system will break because I train to break it.',
    'about.body3':
      'The result: code that ships fast, and stays hard to crack.',

    'skills.eyebrow': 'Skills',
    'skills.title': 'What I',
    'skills.titleAccent': 'do.',
    'skills.subtitle':
      'Three disciplines I practice every day, each one sharpening the others.',
    'skills.dev.tag': 'Build',
    'skills.dev.title': 'AI-boosted development',
    'skills.dev.body':
      'Designing and shipping applications end to end with coding agents, without giving up on architecture, tests or review.',
    'skills.dev.item1': 'Coding agents (Claude Code, opencode)',
    'skills.dev.item2': 'Agent skills & instructions',
    'skills.dev.item3': 'TypeScript · Astro · PHP/Laravel',
    'skills.dev.item4': 'Automated testing (Vitest, Playwright)',
    'skills.dev.item5': 'GitHub Actions CI/CD',
    'skills.red.tag': 'Offense',
    'skills.red.title': 'Red team',
    'skills.red.body':
      'Finding where a system will give way before an attacker does: web applications, APIs and source code.',
    'skills.red.item1': 'Web & API penetration testing',
    'skills.red.item2': 'AI-agent-driven pentesting (Strix)',
    'skills.red.item3': 'Attacker-minded code review',
    'skills.red.item4': 'OWASP Top 10',
    'skills.blue.tag': 'Defense',
    'skills.blue.title': 'Blue team',
    'skills.blue.body':
      'Making systems hard to break: auditing, hardening and security built in from the design stage.',
    'skills.blue.item1': 'OWASP ASVS audits',
    'skills.blue.item2': 'Defensive Laravel review',
    'skills.blue.item3': 'npm supply-chain hardening',
    'skills.blue.item4': 'Security by design',

    'lab.eyebrow': 'Lab',
    'lab.title': 'Let the code',
    'lab.titleAccent': 'speak.',
    'lab.subtitle':
      'A selection of open-source projects where these skills are put into practice. Everything is readable on GitHub.',
    'lab.agentSkills.body':
      'Portable skills for coding agents: security audits against OWASP ASVS v5 and defensive reviews of Laravel backends, with severity-ranked reports.',
    'lab.strix.body':
      'Configuration to run pentest campaigns with the open-source Strix AI agents, wired to the same LLM as my dev environment.',
    'lab.site.body':
      'This website: static bilingual Astro, zero client JS by default, design tokens, Vitest + Playwright tests in CI and locked-down npm dependencies.',
    'lab.viewCode': 'View the code',

    'blog.eyebrow': 'Blog',
    'blog.title': 'Recent',
    'blog.titleAccent': 'notes.',
    'blog.subtitle':
      'Field notes on AI-assisted development and offensive/defensive cybersecurity.',
    'blog.viewAll': 'All posts',
    'blog.readMore': 'Read the post',
    'blog.empty': 'No posts yet. Check back soon.',
    'blog.pageTitle': 'Blog',
    'blog.feedTitle': 'Johann Laqua’s blog',
    'blog.previous': 'Previous post',
    'blog.next': 'Next post',
    'blog.postNav': 'More posts',
    'blog.related': 'Related posts',
    'blog.tags.label': 'Filter by topic',
    'blog.tags.all': 'All',
    'blog.tag.title': 'Posts on',
    'blog.tag.pageTitle': 'Topic: {tag}',
    'blog.tag.subtitle': 'Every post on the blog filed under this topic.',
    'blog.tag.description': 'Johann Laqua’s blog posts on {tag}.',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Let’s talk shop',
    'contact.subtitle':
      'A technical question, feedback on a post or on a lab project: email is the simplest way to reach me.',
    'contact.cta': 'Send an email',
    'contact.social': 'Find me elsewhere',

    'footer.rights': 'All rights reserved.',
    'footer.builtWith': 'Static site, no trackers.',
    'footer.legalNotice': 'Legal notice',
    'footer.privacy': 'Privacy',

    'legal.eyebrow': 'Legal',
    'legal.updated': 'Last updated:',
    'legal.notice.title': 'Legal notice',
    'legal.privacy.title': 'Privacy policy',
    'legal.notice.description':
      'Legal notice for johannlaqua.com: publisher, publication director, host and intellectual property.',
    'legal.privacy.description':
      'Privacy policy for johannlaqua.com: no cookies or trackers, the host’s technical logs, e-mail correspondence and your GDPR rights.',

    'notFound.title': 'Page not found',
    'notFound.body': "The page you're looking for doesn't exist or has moved.",
    'notFound.cta': 'Back to home',
    'notFound.description': 'This page does not exist on johannlaqua.com. Head back to the home page or the blog.',
    'notFound.nav': 'Where to go',
    'notFound.blog': 'Read the blog',
    'notFound.contact': 'Get in touch',
  },
} as const;

export type UiKey = keyof (typeof ui)['fr'];
