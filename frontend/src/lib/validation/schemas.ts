import { z } from 'zod'

/**
 * Login form schema.
 *
 * Email must be a valid address; password must be at least 6 characters to
 * match the frontend UX (the backend's LoginRequest has its own rules).
 */
export const loginSchema = z.object({
  email: z
    .email('Enter a valid email address.')
    .min(1, 'Email is required.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Registration form schema.
 *
 * Password must be 8+ characters to match the backend's Password::defaults()
 * baseline. password_confirmation is checked against password.
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required.')
      .min(2, 'Name must be at least 2 characters.')
      .max(255),
    email: z
      .email('Enter a valid email address.')
      .min(1, 'Email is required.')
    ,
    password: z
      .string()
      .min(1, 'Password is required.')
      .min(8, 'Password must be at least 8 characters.'),
    password_confirmation: z
      .string()
      .min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Todo create schema. The backend (StoreTodoRequest) does its own validation;
 * this catches obvious client-side mistakes before a round trip.
 */
export const todoSchema = z.object({
  text: z
    .string()
    .min(1, 'Task text is required.')
    .max(255, 'Task text must be 255 characters or fewer.'),
  is_completed: z.boolean().optional(),
})

export type TodoInput = z.infer<typeof todoSchema>

export const updateTodoSchema = z.object({
  text: z
    .string()
    .min(1, 'Task text is required.')
    .max(255, 'Task text must be 255 characters or fewer.')
    .optional(),
  is_completed: z.boolean().optional(),
})

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
