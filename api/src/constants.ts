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

  READ_USERPERMISSION: "No tiene permiso para ver los permisos de usuario",
  CREATE_USERPERMISSION: "No tiene permiso para crear nuevos permisos de usuario",
  UPDATE_USERPERMISSION: 'No tiene permiso para modificar permisos de usuario',
  DELETE_USERPERMISSION: 'No tiene permiso para eliminar permisos de usuario',

  READ_RESPONSIBLEUNIT: "No tiene permiso para ver las unidades responsables de sistema",
  CREATE_RESPONSIBLEUNIT: "No tiene permiso para crear nuevas unidades responsables en el sistema",
  UPDATE_RESPONSIBLEUNIT: 'No tiene permiso para modificar las unidades responsables del sistema',
  DELETE_RESPONSIBLEUNIT: 'No tiene permiso para eliminar las unidades responsables del sistema',

  READ_ACTIVITY: "No tiene permiso para ver las actividades",
  CREATE_ACTIVITY: "No tiene permiso para crear nuevas actividades",
  UPDATE_ACTIVITY: 'No tiene permiso para modificar actividades',
  DELETE_ACTIVITY: 'No tiene permiso para eliminar actividades',

  READ_OBSERVATION: "No tiene permiso para ver las observaciones",
  CREATE_OBSERVATION: "No tiene permiso para crear nuevas observaciones",
  UPDATE_OBSERVATION: 'No tiene permiso para modificar observaciones',
  DELETE_OBSERVATION: 'No tiene permiso para eliminar observaciones',

  READ_TYPE: "No tiene permiso para ver a los tipos de predio",
  CREATE_TYPE: "No tiene permiso para crear nuevos tipos de predio",
  UPDATE_TYPE: 'No tiene permiso para modificar los tipos de predio',
  DELETE_TYPE: 'No tiene permiso para eliminar tipos de predio',

  READ_CLASIFICATION: "No tiene permiso para ver a las clasificaciones de predio",
  CREATE_CLASIFICATION: "No tiene permiso para crear nuevas clasificaciones de predio",
  UPDATE_CLASIFICATION: 'No tiene permiso para modificar las clasificaciones de predio',
  DELETE_CLASIFICATION: 'No tiene permiso para eliminar las clasificaciones de predio',

  READ_GROUPEDSTATE: "No tiene permiso para ver a los estados agrupados del sistema",
  CREATE_GROUPEDSTATE: "No tiene permiso para crear nuevos estados agrupados en el sistema",
  UPDATE_GROUPEDSTATE: 'No tiene permiso para modificar los estados agrupados en el sistema',
  DELETE_GROUPEDSTATE: 'No tiene permiso para eliminar los estados agrupados en el sistema',

  READ_REFERENCE: "No tiene permiso para ver a las referencias del sistema",
  CREATE_REFERENCE: "No tiene permiso para crear nuevas referencias en el sistema",
  UPDATE_REFERENCE: 'No tiene permiso para modificar las referencias en el sistema',
  DELETE_REFERENCE: 'No tiene permiso para eliminar las referencias en el sistema',

  READ_RECORD: "No tiene permiso para ver el historial del sistema",
  CREATE_RECORD: "No tiene permiso para crear nuevos registros en el historial",
  UPDATE_RECORD: 'No tiene permiso para modificar los registros en el historial del sistema',
  DELETE_RECORD: 'No tiene permiso para eliminar los registro en el historial del sistema',

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
