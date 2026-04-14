export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown server error'

export const isSupabaseSetupPending = (error: unknown) =>
  getErrorMessage(error).includes("Could not find the table 'public.courses'")
