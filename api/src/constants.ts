export const AuthResponses = {
  UNAUTHENTICATED: 'Usuario no autorizado'
}
export const AuthErrorMessage = {
  INVALID_USER: 'Nombre de usuario incorrecto',
  INVALID_PASSWORD: 'Contraseña incorrecta',
  UNREGISTERED_USER: 'Usuario no registrado',
  USER_DISABLE: 'Su cuenta de usuario se encuentra deshabilitada'
}

export const PermissionErrorMessage = {
  READ_USER: "No tiene permisos para ver a los usuarios",
  UPDATE_USER: 'No tiene permisos para modificar a este usuario',
  DELETE_USER: 'No tiene permisos para eliminar a los usuarios'
}

export const TokenErrorMessage = {
  EXPIRED_TOKEN: 'El token ha expirado',
  INVALID_TOKEN: 'El token no es valido'
}

export const Code = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
}

export const Status = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
}

export const LifeTimeToken = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7
}
