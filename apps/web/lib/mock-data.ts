import type { PlatformRole } from '@repo/utils'

export function getMockPlatformRoles(): PlatformRole[] {
  return ['student']
}

export function getMockCourses() {
  return [
    {
      slug: 'ai-native-frontend',
      title: 'AI-Native Frontend Delivery',
      summary:
        'A compact sample course covering stack selection, design systems, and demo delivery.',
      lessons: 6,
      assignments: 2,
    },
    {
      slug: 'supabase-course-platform',
      title: 'Supabase-Powered Course Platform',
      summary:
        'A backend-focused course showing Auth, Storage, and RLS boundaries for a full-stack product.',
      lessons: 4,
      assignments: 1,
    },
  ]
}
