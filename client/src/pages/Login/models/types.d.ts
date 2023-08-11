export type FormLoginValues = {
  username: string
  password: string
}


export type Error = {
  message: string
}

export type GraphQLResponse<T> = {
  data: T
}

export type GraphQLErrorResponse = {
  errors: Error[]
}

export type APILoginResponse = {
  auth: {
    accessToken: string
    refreshToken: string
  }
}

export type APINewAccessTokenResponse = {
  accessToken: string
}
