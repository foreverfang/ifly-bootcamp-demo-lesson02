import { describe, expect, test } from 'vitest'
import {
  canManageCourse,
  canViewCourse,
  createSubmissionSnippet,
  getDashboardLabel,
  getEnrollmentSummary,
} from './course-platform'

describe('course platform shared domain contracts', () => {
  test('admins can manage any course', () => {
    expect(canManageCourse(['admin'], 'student')).toBe(true)
    expect(canManageCourse(['admin'], 'teacher')).toBe(true)
  })

  test('teachers can manage only courses they teach', () => {
    expect(canManageCourse(['teacher'], 'teacher')).toBe(true)
    expect(canManageCourse(['teacher'], 'student')).toBe(false)
  })

  test('students can view but not manage enrolled courses', () => {
    expect(canViewCourse(['student'], 'student')).toBe(true)
    expect(canManageCourse(['student'], 'student')).toBe(false)
  })

  test('admins and teachers can view courses', () => {
    expect(canViewCourse(['admin'], 'student')).toBe(true)
    expect(canViewCourse(['teacher'], 'teacher')).toBe(true)
  })

  test('getDashboardLabel returns the right label for each platform role', () => {
    expect(getDashboardLabel(['admin'])).toBe('平台管理台')
    expect(getDashboardLabel(['teacher'])).toBe('教师工作台')
    expect(getDashboardLabel(['student'])).toBe('学习中心')
  })

  test('getEnrollmentSummary formats assignment and enrollment counts', () => {
    expect(getEnrollmentSummary(2, 5)).toBe('2 assignments · 5 enrollments')
    expect(getEnrollmentSummary(1, 1)).toBe('1 assignment · 1 enrollment')
  })

  test('createSubmissionSnippet truncates long submission content', () => {
    expect(createSubmissionSnippet('short text', 20)).toBe('short text')
    expect(
      createSubmissionSnippet(
        'This is a long reflection about the course project and its implementation details.',
        24,
      ),
    ).toBe('This is a long reflec...')
  })
})
