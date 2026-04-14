import 'server-only'

import {
  type AssignmentRecord,
  type CourseRecord,
  type EnrollmentRecord,
  type SubmissionRecord,
  createServerSupabaseClient,
} from '@repo/supabase'

export type CourseCatalogItem = CourseRecord & {
  assignmentCount: number
  enrollmentCount: number
}

export type CourseDetail = {
  assignments: AssignmentRecord[]
  course: CourseRecord
  enrollments: EnrollmentRecord[]
  submissions: SubmissionRecord[]
}

const getSupabaseErrorMessage = (
  error: { message: string } | null,
  fallback: string,
) => error?.message ?? fallback

export async function listCourseCatalog(): Promise<CourseCatalogItem[]> {
  const supabase = createServerSupabaseClient()

  const [
    { data: courses, error: courseError },
    { data: assignments },
    { data: enrollments },
  ] = await Promise.all([
    supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true }),
    supabase.from('assignments').select('id, course_id'),
    supabase.from('enrollments').select('id, course_id'),
  ])

  if (courseError || !courses) {
    throw new Error(
      getSupabaseErrorMessage(courseError, 'Failed to load courses'),
    )
  }

  return courses.map((course) => ({
    ...course,
    assignmentCount:
      assignments?.filter((assignment) => assignment.course_id === course.id)
        .length ?? 0,
    enrollmentCount:
      enrollments?.filter((enrollment) => enrollment.course_id === course.id)
        .length ?? 0,
  }))
}

export async function getCourseDetail(
  courseId: string,
): Promise<CourseDetail | null> {
  const supabase = createServerSupabaseClient()

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .maybeSingle()

  if (courseError) {
    throw new Error(
      getSupabaseErrorMessage(courseError, 'Failed to load course detail'),
    )
  }

  if (!course) {
    return null
  }

  const { data: assignments, error: assignmentError } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: true })

  if (assignmentError || !assignments) {
    throw new Error(
      getSupabaseErrorMessage(
        assignmentError,
        'Failed to load course assignments',
      ),
    )
  }

  const { data: enrollments, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
    .limit(8)

  if (enrollmentError || !enrollments) {
    throw new Error(
      getSupabaseErrorMessage(
        enrollmentError,
        'Failed to load enrollment records',
      ),
    )
  }

  const assignmentIds = assignments.map((assignment) => assignment.id)

  let submissions: SubmissionRecord[] = []

  if (assignmentIds.length > 0) {
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .select('*')
      .in('assignment_id', assignmentIds)
      .order('created_at', { ascending: false })
      .limit(12)

    if (submissionError || !submissionData) {
      throw new Error(
        getSupabaseErrorMessage(
          submissionError,
          'Failed to load submission records',
        ),
      )
    }

    submissions = submissionData
  }

  return {
    assignments,
    course,
    enrollments,
    submissions,
  }
}

export async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  const [
    coursesResult,
    enrollmentsResult,
    assignmentsResult,
    submissionsResult,
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('assignments').select('*', { count: 'exact', head: true }),
    supabase.from('submissions').select('*', { count: 'exact', head: true }),
  ])

  return {
    assignmentCount: assignmentsResult.count ?? 0,
    courseCount: coursesResult.count ?? 0,
    enrollmentCount: enrollmentsResult.count ?? 0,
    submissionCount: submissionsResult.count ?? 0,
  }
}
