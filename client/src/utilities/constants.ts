export const resources = {
  USER: "Usuario",
  PERMISSION: "Permiso",
  BENEFICIARY: "Beneficiario",
  PROPERTY: "Predio",
  CITY: "Departamento",
  PROVINCE: "Provincia",
  MUNICIPALITY: "Municipio",
  USER_PERMISSION: "Permisos de usuario",
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
