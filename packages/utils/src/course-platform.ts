export type PlatformRole = 'student' | 'teacher' | 'admin'

export type CourseMembershipRole = 'student' | 'teacher'

const hasRole = (platformRoles: PlatformRole[], role: PlatformRole) =>
  platformRoles.includes(role)

export const canManageCourse = (
  platformRoles: PlatformRole[],
  membershipRole: CourseMembershipRole,
) => hasRole(platformRoles, 'admin') || membershipRole === 'teacher'

export const canViewCourse = (
  platformRoles: PlatformRole[],
  membershipRole: CourseMembershipRole,
) =>
  hasRole(platformRoles, 'admin') ||
  membershipRole === 'student' ||
  membershipRole === 'teacher'

export const getDashboardLabel = (platformRoles: PlatformRole[]) => {
  if (hasRole(platformRoles, 'admin')) {
    return '平台管理台'
  }

  if (hasRole(platformRoles, 'teacher')) {
    return '教师工作台'
  }

  return '学习中心'
}
