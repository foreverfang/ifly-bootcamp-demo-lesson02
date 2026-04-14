'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServerSupabaseClient } from '@repo/supabase'

const getFieldValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? '').trim()

const buildRedirectUrl = (
  courseId: string,
  params: Record<string, string | undefined>,
  hash?: string,
) => {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value)
    }
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : ''
  const anchor = hash ? `#${hash}` : ''

  return `/courses/${courseId}${suffix}${anchor}`
}

export async function enrollInCourse(formData: FormData) {
  const courseId = getFieldValue(formData, 'courseId')
  const studentName = getFieldValue(formData, 'studentName')
  const studentEmail = getFieldValue(formData, 'studentEmail')

  if (!courseId || !studentName || !studentEmail) {
    redirect(
      buildRedirectUrl(courseId, {
        error: 'Please fill in your name and email before enrolling.',
      }),
    )
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from('enrollments').insert({
    course_id: courseId,
    student_email: studentEmail,
    student_name: studentName,
  })

  revalidatePath('/courses')
  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/dashboard')

  if (error?.code === '23505') {
    redirect(
      buildRedirectUrl(courseId, {
        error: 'This email has already enrolled in the current course.',
      }),
    )
  }

  if (error) {
    redirect(
      buildRedirectUrl(courseId, {
        error: error.message,
      }),
    )
  }

  redirect(
    buildRedirectUrl(courseId, {
      notice: 'Enrollment saved successfully.',
    }),
  )
}

export async function submitAssignment(formData: FormData) {
  const courseId = getFieldValue(formData, 'courseId')
  const assignmentId = getFieldValue(formData, 'assignmentId')
  const studentName = getFieldValue(formData, 'studentName')
  const studentEmail = getFieldValue(formData, 'studentEmail')
  const content = getFieldValue(formData, 'content')

  if (!courseId || !assignmentId || !studentName || !studentEmail || !content) {
    redirect(
      buildRedirectUrl(
        courseId,
        {
          error: 'Please complete the full assignment form before submitting.',
        },
        `assignment-${assignmentId}`,
      ),
    )
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from('submissions').insert({
    assignment_id: assignmentId,
    content,
    student_email: studentEmail,
    student_name: studentName,
  })

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/dashboard')

  if (error) {
    redirect(
      buildRedirectUrl(
        courseId,
        {
          error: error.message,
        },
        `assignment-${assignmentId}`,
      ),
    )
  }

  redirect(
    buildRedirectUrl(
      courseId,
      {
        notice: 'Assignment submitted successfully.',
      },
      `assignment-${assignmentId}`,
    ),
  )
}
