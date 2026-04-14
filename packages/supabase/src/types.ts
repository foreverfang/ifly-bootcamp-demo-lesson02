export type SupabaseEnv = {
  url: string
  anonKey: string
}

export type CourseRecord = {
  id: string
  title: string
  description: string
  teacher_name: string
  created_at: string
}

export type EnrollmentRecord = {
  id: string
  course_id: string
  student_name: string
  student_email: string
  created_at: string
}

export type AssignmentRecord = {
  id: string
  course_id: string
  title: string
  description: string
  created_at: string
}

export type SubmissionRecord = {
  id: string
  assignment_id: string
  student_name: string
  student_email: string
  content: string
  created_at: string
}

export type AppDatabase = {
  public: {
    Tables: {
      assignments: {
        Row: AssignmentRecord
        Insert: Omit<AssignmentRecord, 'id' | 'created_at'>
        Update: Partial<Omit<AssignmentRecord, 'id'>>
        Relationships: []
      }
      courses: {
        Row: CourseRecord
        Insert: Omit<CourseRecord, 'id' | 'created_at'>
        Update: Partial<Omit<CourseRecord, 'id'>>
        Relationships: []
      }
      enrollments: {
        Row: EnrollmentRecord
        Insert: Omit<EnrollmentRecord, 'id' | 'created_at'>
        Update: Partial<Omit<EnrollmentRecord, 'id'>>
        Relationships: []
      }
      submissions: {
        Row: SubmissionRecord
        Insert: Omit<SubmissionRecord, 'id' | 'created_at'>
        Update: Partial<Omit<SubmissionRecord, 'id'>>
        Relationships: []
      }
    }
  }
}

export type SessionUser = {
  id: string
  email: string
}
