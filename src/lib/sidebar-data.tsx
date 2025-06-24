import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

export const data = {
  user: {
    name: 'Demo User',
    email: 'user@example.com',
    avatar: '/avatar.png',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Main',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'Documents',
          url: '/documents',
        },
        {
          title: 'Categories',
          url: '/categories',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
      ],
    },
  ],
};
