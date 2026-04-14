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

export const getEnrollmentSummary = (
  assignmentCount: number,
  enrollmentCount: number,
) => {
  const assignmentLabel =
    assignmentCount === 1 ? '1 assignment' : `${assignmentCount} assignments`
  const enrollmentLabel =
    enrollmentCount === 1 ? '1 enrollment' : `${enrollmentCount} enrollments`

  return `${assignmentLabel} · ${enrollmentLabel}`
}

export const createSubmissionSnippet = (content: string, maxLength = 80) =>
  content.length <= maxLength
    ? content
    : `${content.slice(0, Math.max(0, maxLength - 3))}...`
