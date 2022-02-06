import bcrypt from 'bcrypt';

export const encrypt = async (password: string, saltRounds: number) => {
  return await bcrypt.hash(password, saltRounds);
}

export const comparePass = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
}