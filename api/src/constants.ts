import { Resource } from "@prisma/client"

export const AuthResponses = {
  UNAUTHENTICATED: 'Usuario no autorizado'
} as const
export const AuthErrorMessage = {
  INVALID_USER: 'Nombre de usuario incorrecto',
  INVALID_PASSWORD: 'Contraseña incorrecta',
  UNREGISTERED_USER: 'Usuario no registrado',
  USER_DISABLE: 'Su cuenta esta deshabilitada'
} as const

type Operation = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE'

export const PermissionErrorMessage: { [K in `${Operation}_${Resource}` | 'DISABLE_GLOBAL' | 'DISABLE_FOR_YOU']: string } = {
  READ_USER: "No tiene permiso para ver a los usuarios del sistema",
  CREATE_USER: "No tiene permiso para crear nuevos usuarios del sistema",
  UPDATE_USER: 'No tiene permiso para modificar usuarios del sistema',
  DELETE_USER: 'No tiene permiso para eliminar usuarios del sistema',

  READ_PROPERTY: "No tiene permiso para ver los predios del sistema",
  CREATE_PROPERTY: "No tiene permiso crear nuevos predios del sistema",
  UPDATE_PROPERTY: 'No tiene permiso para modificar predios del sistema',
  DELETE_PROPERTY: 'No tiene permiso para eliminar predios del sistema',

  READ_CITY: "No tiene permiso para ver los departamentos del sistema",
  CREATE_CITY: "No tiene permiso para crear nuevos departamentos del sistema",
  UPDATE_CITY: 'No tiene permiso para modificar departamentos del sistema',
  DELETE_CITY: 'No tiene permiso para eliminar departamentos del sistema',

  READ_PERMISSION: "No tiene permiso para ver los permisos del sistema",
  CREATE_PERMISSION: "No tiene permiso para crear nuevos permisos del sistema",
  UPDATE_PERMISSION: 'No tiene permiso para modificar permisos del sistema',
  DELETE_PERMISSION: 'No tiene permiso para eliminar permisos del sistema',

  READ_USERPERMISSION: "No tiene permiso para ver los permisos de usuario del sistema",
  CREATE_USERPERMISSION: "No tiene permiso para crear nuevos permisos de usuario del sistema",
  UPDATE_USERPERMISSION: 'No tiene permiso para modificar permisos de usuario del sistema',
  DELETE_USERPERMISSION: 'No tiene permiso para eliminar permisos de usuario del sistema',

  READ_UNIT: "No tiene permiso para ver las unidades responsables de sistema",
  CREATE_UNIT: "No tiene permiso para crear nuevas unidades responsables del sistema",
  UPDATE_UNIT: 'No tiene permiso para modificar las unidades responsables del sistema',
  DELETE_UNIT: 'No tiene permiso para eliminar las unidades responsables del sistema',

  READ_ACTIVITY: "No tiene permiso para ver las actividades del sistema",
  CREATE_ACTIVITY: "No tiene permiso para crear nuevas actividades del sistema",
  UPDATE_ACTIVITY: 'No tiene permiso para modificar actividades del sistema',
  DELETE_ACTIVITY: 'No tiene permiso para eliminar actividades del sistema',

  READ_OBSERVATION: "No tiene permiso para ver las observaciones del sistema",
  CREATE_OBSERVATION: "No tiene permiso para crear nuevas observaciones del sistema",
  UPDATE_OBSERVATION: 'No tiene permiso para modificar observaciones del sistema',
  DELETE_OBSERVATION: 'No tiene permiso para eliminar observaciones del sistema',

  READ_TYPE: "No tiene permiso para ver a los tipos de predio del sistema",
  CREATE_TYPE: "No tiene permiso para crear nuevos tipos de predio del sistema",
  UPDATE_TYPE: 'No tiene permiso para modificar los tipos de predio del sistema',
  DELETE_TYPE: 'No tiene permiso para eliminar tipos de predio del sistema',

  READ_CLASIFICATION: "No tiene permiso para ver a las clasificaciones de predio del sistema",
  CREATE_CLASIFICATION: "No tiene permiso para crear nuevas clasificaciones de predio del sistema",
  UPDATE_CLASIFICATION: 'No tiene permiso para modificar las clasificaciones de predio del sistema',
  DELETE_CLASIFICATION: 'No tiene permiso para eliminar las clasificaciones de predio del sistema',

  READ_GROUPEDSTATE: "No tiene permiso para ver a los estados agrupados del sistema",
  CREATE_GROUPEDSTATE: "No tiene permiso para crear nuevos estados agrupados del sistema",
  UPDATE_GROUPEDSTATE: 'No tiene permiso para modificar los estados agrupados del sistema',
  DELETE_GROUPEDSTATE: 'No tiene permiso para eliminar los estados agrupados del sistema',

  READ_REFERENCE: "No tiene permiso para ver a las referencias del sistema",
  CREATE_REFERENCE: "No tiene permiso para crear nuevas referencias del sistema",
  UPDATE_REFERENCE: 'No tiene permiso para modificar las referencias del sistema',
  DELETE_REFERENCE: 'No tiene permiso para eliminar las referencias del sistema',

  READ_RECORD: "No tiene permiso para ver el historial del sistema",
  CREATE_RECORD: "No tiene permiso para crear nuevos registros en el historial",
  UPDATE_RECORD: 'No tiene permiso para modificar los registros en el historial del sistema',
  DELETE_RECORD: 'No tiene permiso para eliminar los registros en el historial del sistema',

  READ_STAGE: "No tiene permiso para ver las etapas de estado del sistema",
  CREATE_STAGE: "No tiene permiso para crear nuevas etapas de estado del sistema",
  UPDATE_STAGE: 'No tiene permiso para modificar las etapas de estado del sistema',
  DELETE_STAGE: 'No tiene permiso para eliminar las etapas de estado del sistema',

  READ_USERTYPE: "No tiene permiso para ver los tipos de usuario del sistema",
  CREATE_USERTYPE: "No tiene permiso para crear nuevos tipos de usuario del sistema",
  UPDATE_USERTYPE: 'No tiene permiso para modificar los tipos de usuario del sistema',
  DELETE_USERTYPE: 'No tiene permiso para eliminar los tipos de usuario del sistema',

  READ_BENEFICIARY: "No tiene permiso para ver los beneficiarios del sistema",
  CREATE_BENEFICIARY: "No tiene permiso para crear nuevos beneficiarios del sistema",
  UPDATE_BENEFICIARY: 'No tiene permiso para modificar los beneficiarios del sistema',
  DELETE_BENEFICIARY: 'No tiene permiso para eliminar los beneficiarios del sistema',

  READ_FOLDERLOCATION: "No tiene permiso para ver las ubicaciones de carpeta del sistema",
  CREATE_FOLDERLOCATION: "No tiene permiso para crear nuevas ubicaciones de carpeta del sistema",
  UPDATE_FOLDERLOCATION: 'No tiene permiso para modificar las ubicaciones de carpeta del sistema',
  DELETE_FOLDERLOCATION: 'No tiene permiso para eliminar las ubicaciones de carpeta del sistema',

  READ_STATE: "No tiene permiso para ver los estados de predio del sistema",
  CREATE_STATE: "No tiene permiso para crear nuevos estados de predio del sistema",
  UPDATE_STATE: 'No tiene permiso para modificar los estados de predio del sistema',
  DELETE_STATE: 'No tiene permiso para eliminar los estados de predio del sistema',

  READ_MUNICIPALITY: "No tiene permiso para ver los municipios del sistema",
  CREATE_MUNICIPALITY: "No tiene permiso para crear nuevos municipios del sistema",
  UPDATE_MUNICIPALITY: 'No tiene permiso para modificar los municipios del sistema',
  DELETE_MUNICIPALITY: 'No tiene permiso para eliminar los municipios del sistema',

  READ_PROVINCE: "No tiene permiso para ver las provincias del sistema",
  CREATE_PROVINCE: "No tiene permiso para crear nuevas provincias del sistema",
  UPDATE_PROVINCE: 'No tiene permiso para modificar las provincias del sistema',
  DELETE_PROVINCE: 'No tiene permiso para eliminar las provincias del sistema',

  READ_TRACKING: "No tiene permiso para ver los seguimientos del sistema",
  CREATE_TRACKING: "No tiene permiso para crear nuevos seguimientos del sistema",
  UPDATE_TRACKING: 'No tiene permiso para modificar los seguimientos del sistema',
  DELETE_TRACKING: 'No tiene permiso para eliminar los seguimientos del sistema',

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
