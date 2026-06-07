import { Settings2, SquareTerminal } from 'lucide-react';

export const data = {
  navMain: [
    {
      title: 'Main',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
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
