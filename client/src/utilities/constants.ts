export const resources = {
  USER: "Usuario",
  PERMISSION: "Permiso",
  BENEFICIARY: "Beneficiario",
  PROPERTY: "Predio",
  CITY: "Departamento",
  PROVINCE: "Provincia",
  MUNICIPALITY: "Municipio",
  USERPERMISSION: "Permisos de usuario",
  ACTIVITY: "Actividades de predio",
  OBSERVATION: "Observaciones",
  FOLDERLOCATION: "Ubicación de carpeta",
  STATE: "Estado de predio",
  UNIT: "Unidad",
  TYPE: "Tipo de predio",
  USERTYPE: "Tipo de usuario",
  CLASIFICATION: "Clasificación",
  GROUPEDSTATE: "Estado agrupado",
  REFERENCE: "Referencia",
  TRACKING: "Seguimiento",
  STAGE: "Etapa de estado",
} as const;

type TitleMessage = {
  title: string
  getSuccessMessage: (name: string) => string
  getErrorMessage: (name: string) => string
}

type Resource = keyof typeof resources;
type Operation = 'CREATE' | 'UPDATE' | 'DELETE'

export const mutationMessages: { [K in `${Operation}_${Resource}`]: TitleMessage } = {
  CREATE_CITY: {
    title: "Departamento creado",
    getSuccessMessage: (name) => `El departamento ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el departamento ${name}`
  },
  UPDATE_CITY: {
    title: "Departamento actualizado",
    getSuccessMessage: (name) => `El departamento ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el departamento ${name}`
  },
  DELETE_CITY: {
    title: "Departamento eliminado",
    getSuccessMessage: (name) => `El departamento ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el departamento ${name}`
  },
  CREATE_PROVINCE: {
    title: "Provincia creada",
    getSuccessMessage: (name) => `La provincia ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la provincia ${name}`
  },
  UPDATE_PROVINCE: {
    title: "Provincia actualizada",
    getSuccessMessage: (name) => `La provincia ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la provincia ${name}`
  },
  DELETE_PROVINCE: {
    title: "Provincia eliminada",
    getSuccessMessage: (name) => `La provincia ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la provincia ${name}`
  },
  CREATE_MUNICIPALITY: {
    title: "Municipio creado",
    getSuccessMessage: (name) => `El municipio ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el municipio ${name}`
  },
  UPDATE_MUNICIPALITY: {
    title: "Municipio actualizado",
    getSuccessMessage: (name) => `El municipio ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el municipio ${name}`
  },
  DELETE_MUNICIPALITY: {
    title: "Municipio eliminado",
    getSuccessMessage: (name) => `El municipio ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el municipio ${name}`
  },
  CREATE_ACTIVITY: {
    title: "Actividad creada",
    getSuccessMessage: (name) => `La actividad ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la actividad ${name}`
  },
  UPDATE_ACTIVITY: {
    title: "Actividad actualizada",
    getSuccessMessage: (name) => `La actividad ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la actividad ${name}`
  },
  DELETE_ACTIVITY: {
    title: "Actividad eliminada",
    getSuccessMessage: (name) => `La actividad ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la actividad ${name}`
  },
  CREATE_CLASIFICATION: {
    title: "Clasificación creada",
    getSuccessMessage: (name) => `La clasificación ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la clasificación ${name}`
  },
  UPDATE_CLASIFICATION: {
    title: "Clasificación actualizada",
    getSuccessMessage: (name) => `La clasificación ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la clasificación ${name}`
  },
  DELETE_CLASIFICATION: {
    title: "Clasificación eliminada",
    getSuccessMessage: (name) => `La clasificación ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la clasificación ${name}`
  },
  CREATE_USER: {
    title: "Usuario creado",
    getSuccessMessage: (name) => `El usuario ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el usuario ${name}`
  },
  UPDATE_USER: {
    title: "Usuario actualizado",
    getSuccessMessage: (name) => `El usuario ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el usuario ${name}`
  },
  DELETE_USER: {
    title: "Usuario eliminado",
    getSuccessMessage: (name) => `El usuario ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el usuario ${name}`
  },
  CREATE_PERMISSION: {
    title: "Permiso creado",
    getSuccessMessage: (name) => `El permiso ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el permiso ${name}`
  },
  UPDATE_PERMISSION: {
    title: "Permiso actualizado",
    getSuccessMessage: (name) => `El permiso ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el permiso ${name}`
  },
  DELETE_PERMISSION: {
    title: "Permiso eliminado",
    getSuccessMessage: (name) => `El permiso ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el permiso ${name}`
  },
  CREATE_USERPERMISSION: {
    title: "Permiso de usuario creado",
    getSuccessMessage: (name) => `El permiso de usuario ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el permiso de usuario ${name}`
  },
  UPDATE_USERPERMISSION: {
    title: "Permiso de usuario actualizado",
    getSuccessMessage: (name) => `El permiso de usuario ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el permiso de usuario ${name}`
  },
  DELETE_USERPERMISSION: {
    title: "Permiso de usuario eliminado",
    getSuccessMessage: (name) => `El permiso de usuario ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el permiso de usuario ${name}`
  },
  CREATE_BENEFICIARY: {
    title: "Beneficiario creado",
    getSuccessMessage: (name) => `El beneficiario ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el beneficiario ${name}`
  },
  UPDATE_BENEFICIARY: {
    title: "Beneficiario actualizado",
    getSuccessMessage: (name) => `El beneficiario ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el beneficiario ${name}`
  },
  DELETE_BENEFICIARY: {
    title: "Beneficiario eliminado",
    getSuccessMessage: (name) => `El beneficiario ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el beneficiario ${name}`
  },
  CREATE_STATE: {
    title: "Estado de predio creado",
    getSuccessMessage: (name) => `El estado de predio ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el estado de predio ${name}`
  },
  UPDATE_STATE: {
    title: "Estado de predio actualizado",
    getSuccessMessage: (name) => `El estado de predio ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el estado de predio ${name}`
  },
  DELETE_STATE: {
    title: "Estado de predio eliminado",
    getSuccessMessage: (name) => `El estado de predio ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el estado de predio ${name}`
  },
  CREATE_STAGE: {
    title: "Etapa creada",
    getSuccessMessage: (name) => `La etapa ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la etapa ${name}`
  },
  UPDATE_STAGE: {
    title: "Etapa actualizada",
    getSuccessMessage: (name) => `La etapa ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la etapa ${name}`
  },
  DELETE_STAGE: {
    title: "Etapa eliminada",
    getSuccessMessage: (name) => `La etapa ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la etapa ${name}`
  },
  CREATE_UNIT: {
    title: "Unidad creada",
    getSuccessMessage: (name) => `La unidad ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la unidad ${name}`
  },
  UPDATE_UNIT: {
    title: "Unidad actualizada",
    getSuccessMessage: (name) => `La unidad ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la unidad ${name}`
  },
  DELETE_UNIT: {
    title: "Unidad eliminada",
    getSuccessMessage: (name) => `La unidad ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la unidad ${name}`
  },
  CREATE_TYPE: {
    title: "Tipo de predio creado",
    getSuccessMessage: (name) => `El tipo de predio ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el tipo de predio ${name}`
  },
  UPDATE_TYPE: {
    title: "Tipo de predio actualizado",
    getSuccessMessage: (name) => `El tipo de predio ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el tipo de predio ${name}`
  },
  DELETE_TYPE: {
    title: "Tipo de predio eliminado",
    getSuccessMessage: (name) => `El tipo de predio ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el tipo de predio ${name}`
  },
  CREATE_FOLDERLOCATION: {
    title: "Ubicación de carpeta creada",
    getSuccessMessage: (name) => `La ubicación de carpeta ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la ubicación de carpeta ${name}`
  },
  UPDATE_FOLDERLOCATION: {
    title: "Ubicación de carpeta actualizada",
    getSuccessMessage: (name) => `La ubicación de carpeta ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la ubicación de carpeta ${name}`
  },
  DELETE_FOLDERLOCATION: {
    title: "Ubicación de carpeta eliminada",
    getSuccessMessage: (name) => `La ubicación de carpeta ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la ubicación de carpeta ${name}`
  },
  CREATE_PROPERTY: {
    title: "Predio creado",
    getSuccessMessage: (name) => `El predio ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el predio ${name}`
  },
  UPDATE_PROPERTY: {
    title: "Predio actualizado",
    getSuccessMessage: (name) => `El predio ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el predio ${name}`
  },
  DELETE_PROPERTY: {
    title: "Predio eliminado",
    getSuccessMessage: (name) => `El predio ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el predio ${name}`
  },
  CREATE_REFERENCE: {
    title: "Referencia creada",
    getSuccessMessage: (name) => `La referencia ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la referencia ${name}`
  },
  UPDATE_REFERENCE: {
    title: "Referencia actualizada",
    getSuccessMessage: (name) => `La referencia ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la referencia ${name}`
  },
  DELETE_REFERENCE: {
    title: "Referencia eliminada",
    getSuccessMessage: (name) => `La referencia ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la referencia ${name}`
  },
  CREATE_TRACKING: {
    title: "Seguimiento creado",
    getSuccessMessage: (name) => `El seguimiento ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el seguimiento ${name}`
  },
  UPDATE_TRACKING: {
    title: "Seguimiento actualizado",
    getSuccessMessage: (name) => `El seguimiento ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el seguimiento ${name}`
  },
  DELETE_TRACKING: {
    title: "Seguimiento eliminado",
    getSuccessMessage: (name) => `El seguimiento ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el seguimiento ${name}`
  },
  CREATE_OBSERVATION: {
    title: "Observación creada",
    getSuccessMessage: (name) => `La observación ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear la observación ${name}`
  },
  UPDATE_OBSERVATION: {
    title: "Observación actualizada",
    getSuccessMessage: (name) => `La observación ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar la observación ${name}`
  },
  DELETE_OBSERVATION: {
    title: "Observación eliminada",
    getSuccessMessage: (name) => `La observación ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar la observación ${name}`
  },
  CREATE_GROUPEDSTATE: {
    title: "Estado agrupado creado",
    getSuccessMessage: (name) => `El estado agrupado ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el estado agrupado ${name}`
  },
  UPDATE_GROUPEDSTATE: {
    title: "Estado agrupado actualizado",
    getSuccessMessage: (name) => `El estado agrupado ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el estado agrupado ${name}`
  },
  DELETE_GROUPEDSTATE: {
    title: "Estado agrupado eliminado",
    getSuccessMessage: (name) => `El estado agrupado ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el estado agrupado ${name}`
  },
  CREATE_USERTYPE: {
    title: "Tipo de usuario creado",
    getSuccessMessage: (name) => `El tipo de usuario ${name} se ha creado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar crear el tipo de usuario ${name}`
  },
  UPDATE_USERTYPE: {
    title: "Tipo de usuario actualizado",
    getSuccessMessage: (name) => `El tipo de usuario ${name} se ha actualizado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar actualizar el tipo de usuario ${name}`
  },
  DELETE_USERTYPE: {
    title: "Tipo de usuario eliminado",
    getSuccessMessage: (name) => `El tipo de usuario ${name} se ha eliminado correctamente`,
    getErrorMessage: (name) => `Ocurrio un error al intentar eliminar el tipo de usuario ${name}`
  },
}

export const levels = {
  CREATE: "Escritura",
  READ: "Lectura",
  UPDATE: "Actualización",
  DELETE: "Eliminación",
} as const;

export const status = {
  ENABLE: "Habilitado",
  DISABLE: "Deshabilitado",
} as const;

export const StateOfStatus = {
  "ENABLE": {
    label: 'Habilitado',
    color: 'green'
  },
  "DISABLE": {
    label: 'Deshabilitado',
    color: 'red'
  }
} as const

export const StatusConnection = {
  "ONLINE": {
    label: 'En linea',
    color: 'green'
  },
  "OFFLINE": {
    label: 'Desconectado',
    color: 'red'
  }
} as const;