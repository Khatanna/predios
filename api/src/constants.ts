export const AuthResponses = {
  UNAUTHENTICATED: 'Usuario no autorizado'
} as const
export const AuthErrorMessage = {
  INVALID_USER: 'Nombre de usuario incorrecto',
  INVALID_PASSWORD: 'Contraseña incorrecta',
  UNREGISTERED_USER: 'Usuario no registrado',
  USER_DISABLE: 'Su cuenta esta deshabilitada'
} as const

export const PermissionErrorMessage = {
  READ_USER: "No tiene permiso para ver a los usuarios",
  CREATE_USER: "No tiene permiso para crear nuevos usuarios",
  UPDATE_USER: 'No tiene permiso para modificar usuarios',
  DELETE_USER: 'No tiene permiso para eliminar usuarios',

  READ_PROPERTY: "No tiene permiso para ver los predios",
  CREATE_PROPERTY: "No tiene permiso crear nuevos predios",
  UPDATE_PROPERTY: 'No tiene permiso para modificar predios',
  DELETE_PROPERTY: 'No tiene permiso para eliminar predios',

  READ_CITY: "No tiene permiso para ver los departamentos",
  CREATE_CITY: "No tiene permiso para crear nuevos departamentos",
  UPDATE_CITY: 'No tiene permiso para modificar departamentos',
  DELETE_CITY: 'No tiene permiso para eliminar departamentos',

  READ_PERMISSION: "No tiene permiso para ver los permisos",
  CREATE_PERMISSION: "No tiene permiso para crear nuevos permisos",
  UPDATE_PERMISSION: 'No tiene permiso para modificar permisos',
  DELETE_PERMISSION: 'No tiene permiso para eliminar permisos',

  READ_USER_PERMISSION: "No tiene permiso para ver los permisos de usuario",
  CREATE_USER_PERMISSION: "No tiene permiso para crear nuevos permisos de usuario",
  UPDATE_USER_PERMISSION: 'No tiene permiso para modificar permisos de usuario',
  DELETE_USER_PERMISSION: 'No tiene permiso para eliminar permisos de usuario',

  DISABLE_GLOBAL: "El permiso ha sido deshabilitado por el administrador",
  DISABLE_FOR_YOU: "Es administrador ha deshabilitado su acceso a este permiso"
} as const

export const TokenErrorMessage = {
  EXPIRED_TOKEN: 'El token de sesión ha expirado, vuelva a iniciar sesión',
  INVALID_TOKEN: 'El token no es valido'
} as const

export const Code = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const

export const Status = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const LifeTimeToken = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7
} as const
