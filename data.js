/*
 * Portfolio content.
 * Edit text here; script.js renders the Selected work, Experience,
 * Capabilities and Currently exploring sections from it.
 *
 * Anything in [square brackets] is a placeholder waiting for real details.
 */
window.portfolioData = {
  contact: {
    email: 'abir.hossain.14558@gmail.com',
    linkedin: 'https://linkedin.com/in/uixabir',
  },

  // Ordered by how well each project shows complex product work.
  caseStudies: [
    {
      id: 'dbfex',
      name: 'DBFEX',
      category: 'Complex digital product',
      platform: 'Web platform',
      title: 'Auditing and redesigning a barrel-trading platform',
      description:
        'A product audit of a live trading platform, followed by a redesign of its dashboard, listings and core flows.',
      scope: 'Product audit & redesign',
      image: 'cade study 2.webp',
      imageAlt:
        'DBFEX dashboard redesign showing spotlight barrels, filters and a barrel list with prices',
      linkText: 'Visit DBFEX',
      href: 'https://dbfex.com/',
    },
    {
      id: 'medicare',
      name: 'Medicare',
      category: 'HealthTech · AI',
      platform: 'Mobile app',
      title: 'Redesigning a medical app around AI and clinical standards',
      description:
        'A concept telemedicine app pairing AI-assisted symptom checks with a simpler booking flow — cut from 6–7 steps to 3.',
      scope: 'UX/UI case study (concept)',
      image: 'Banner.webp',
      imageAlt:
        'Medicare mobile app case study cover showing a video consultation between a patient and a doctor',
      linkText: 'Read the case study',
      href: 'https://medium.com/design-bootcamp/the-ux-of-medical-app-how-i-mixup-ai-with-industry-standards-1b7e787c3b9b',
    },
    {
      id: 'travel',
      name: 'Travel website',
      category: 'Consumer web',
      platform: 'Responsive website',
      title: 'Designing a responsive travel booking website',
      description:
        'Destination discovery, budget-led trip planning and booking, designed to hold up across every breakpoint.',
      scope: 'UI/UX design',
      image: 'case study 3.webp',
      imageAlt:
        'Travel website screens: a trip-planning hero, destination cards and traveller testimonials',
      linkText: 'View on Dribbble',
      href: 'https://dribbble.com/shots/26499183-Travel-website-UI-UX-design-Responsive',
    },
  ],

  experience: [
    {
      company: 'Helpful Digital',
      href: 'https://hilfal.com/',
      role: 'Product Designer',
      dates: '[Start date] – Present',
      current: true,
      description:
        'Designing SaaS and digital products for client teams — working through flows, information architecture and interface design.',
    },
    {
      company: '[Previous company]',
      href: '',
      role: '[Role]',
      dates: '[Start] – [End]',
      current: false,
      description: '[One line on what you did there.]',
    },
  ],

  capabilities: [
    {
      group: 'Product',
      items: ['Product Design', 'Product Thinking', 'UX Strategy', 'Information Architecture'],
    },
    {
      group: 'Experience',
      items: ['UX Research', 'User Flows', 'Interaction Design', 'Usability', 'Prototyping'],
    },
    {
      group: 'Interface',
      items: ['UI Design', 'Visual Design', 'Design Systems', 'Responsive Design'],
    },
  ],

  exploring: ['SaaS', 'AI products', 'HealthTech', 'Complex product workflows'],
};
