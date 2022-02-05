import bcrypt from 'bcrypt';

export const encrypt = async (password: string, saltRounds: number) => {
  return await bcrypt.hash(password, saltRounds);
}