export const AuthResponses = {
  UNAUTHENTICATED: 'Usuario no autorizado'
}
export const AuthErrorMessage = {
  INVALID_USER: 'Nombre de usuario incorrecto',
  INVALID_PASSWORD: 'Contraseña incorrecta',
  UNREGISTERED_USER: 'Usuario no registrado'
}

export const TokenErrorMessage = {
  EXPIRED_TOKEN: 'El token ha expirado',
  INVALID_TOKEN: 'El token no es valido'
}

export const Code = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  BAD_REQUEST: 'BAD_REQUEST'
}

export const Status = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400
}

export const LifeTimeToken = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7
}
