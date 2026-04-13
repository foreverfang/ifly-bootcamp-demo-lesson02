import { describe, expect, test } from 'vitest'
import {
  canManageCourse,
  canViewCourse,
  getDashboardLabel,
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
})
