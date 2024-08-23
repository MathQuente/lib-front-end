import { z } from 'zod'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB
const ACCEPTED_FILE_TYPES = ['image/png', 'image/gif', 'image/jpeg']

export const updateProfileSchema = z.object({
  userName: z
    .string()
    .min(1, { message: 'Campo vazio' })
    .transform(name => {
      return name
        .trim()
        .split(' ')
        .map(word => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  profilePicture: z
    .instanceof(FileList)
    .optional()
    .transform(list => list?.item(0))
    .refine(file => {
      return !file || file.size <= MAX_UPLOAD_SIZE
    }, 'File size must be less than 3MB')
    .refine(file => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type)
    }, 'File must be a PNG or a GIF'),
  userBanner: z
    .instanceof(FileList)
    .optional()
    .transform(list => list?.item(0))
    .refine(file => {
      return !file || file.size <= MAX_UPLOAD_SIZE
    }, 'File size must be less than 3MB')
    .refine(file => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type)
    }, 'File must be a PNG or a GIF')
})
