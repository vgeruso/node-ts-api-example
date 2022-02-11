export interface Resp {
  row: any,
  status: number
}

export interface User {
  id: number,
  name: string,
  email: string,
  username: string,
  bio: string
}

export interface Post {
  id: number,
  createdAt: Date,
  updatedAt: Date,
  title: string,
  content: string,
  published: boolean,
  authorId: number
}