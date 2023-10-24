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
  SUBDIRECTORY: "Subcarpeta",
  STATE: "Estado de predio",
  RESPONSIBLEUNIT: "Unidad responsable",
  TYPE: "Tipo de predio",
  CLASIFICATION: "Clasificación",
  GROUPEDSTATE: "Estado agrupado",
  REFERENCE: "Referencia",
  TRACKING: "Seguimiento"
} as const;

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