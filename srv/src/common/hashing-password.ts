import { compare, hash } from 'bcrypt'

const SALT = process.env.SALT_ROUNDS

export const hashingPassword = async (password: string) => {
  return await hash(password, parseInt(SALT))
}

export const comparePasswordHashing = async (password: string, hashingPassowrd: string) => {
  const correctPassword = await compare(password, hashingPassowrd)
  return correctPassword
}
