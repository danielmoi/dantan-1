import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    name: 'dantan/ignores',
    ignores: [
      'src/routeTree.gen.ts',
      'src/components/ui/**',
    ],
  },
]
