export type FormLoginValues = {
  username: string
  password: string
}

export type Error = {
  message: string
}

export type LoginResponse = {
  auth: {
    accessToken: string
    refreshToken: string
  }
}

export type GetNewAccessTokenResponse = {
  accessToken: string
}
