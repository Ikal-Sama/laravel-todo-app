import type { ZodError } from 'zod'
import type { Ref } from 'vue'

/**
 * Maps a Zod error's `issues` array to a flat `Record<field, message>`.
 *
 * The first issue per path wins (later issues for the same field are dropped).
 * Returns a plain object suitable for spreading into a page's `errors.value`.
 */
export function flattenZodIssues(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !(key in out)) {
      out[key] = issue.message
    }
  }

  return out
}

/**
 * Validates `values` against a Zod schema and writes any field errors into
 * the provided reactive `errors` ref under the matching keys.
 *
 * Returns `true` if valid, `false` otherwise. The caller can short-circuit on
 * `false` and the ref is already populated for template rendering.
 */
export function applyZodToErrors<T>(
  schema: import('zod').ZodType<T>,
  values: unknown,
  errors: Ref<Record<string, string | undefined>>,
): boolean {
  const result = schema.safeParse(values)

  if (result.success) {
    return true
  }

  const fieldErrors = flattenZodIssues(result.error)
  for (const key of Object.keys(errors.value)) {
    errors.value[key] = undefined
  }
  for (const [key, message] of Object.entries(fieldErrors)) {
    errors.value[key] = message
  }
  return false
}
