export type FormLoginValues = {
  username: string
  password: string
}

export type ErrorMessage = {
  message: string
}

export type GraphQLResponse<T> = {
  data: T
  errors: error[]
}

export type APIIsAuthResponse = {
  isAuth: boolean
}

export type APILoginResponse = {
  token: string
}

export type APILogoutResponse = {
  logout: boolean
}

export type GraphQLMappedResponse = {
  data: APILoginResponse
  error?: error
}

export type AxiosResponseLoginQuery = AxiosResponse<GraphQLMappedResponse>[keyof Pick<AxiosResponse<GraphQLMappedResponse>, 'data'>]
