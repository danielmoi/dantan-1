import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

export const data = {
  teams: [
    {
      name: 'Danstack',
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
          title: 'One',
          url: '/one',
        },
        {
          title: 'Two',
          url: '/two',
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
