export const getError = (message: string): Record<string, string> => {
  console.log(message)
  return {
    P1001: "Fallo la conexion con la base de datos",
    P2000: "El valor proporcionado para la columna es demasiado largo para el tipo de columna. Columna: ",
    P2002: message.includes("userType") ? 'Este tipo de usuario ya existe en el sistema' : 'Este recurso ya existe en el sistema',
    P2022: "Las columnas de esta entidad no están especificadas en la base de datos",
    P2025: message.includes("No User found")
      ? "Este usuario no existe en el sistema"
      : message.includes("'Permission'") ?
        "Estos permisos no existen en el sistema aun"
        : "Este recurso no existe en sistema",
    P2026: "La relación que intentas eliminar no existe",
    default: "Ocurrio un error relacionado con la base de datos"
  };
}