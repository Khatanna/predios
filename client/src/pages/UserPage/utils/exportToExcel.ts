import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Property } from "../../PropertyPage/models/types";
import { User } from "../models/types";
import { capitalizeString } from "./capitalizeString";

const buildFullName = (user?: User) => {
  if (!user) return;

  return `${capitalizeString(user.names)} ${capitalizeString(
    user.firstLastName,
  )} ${capitalizeString(user.secondLastName)}`;
};

export const exportToExcel = ({ data }: { data: Array<Property> }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportData = data.map(
    ({
      name,
      registryNumber,
      code,
      state,
      type,
      city,
      province,
      municipality,
      codeOfSearch,
      activity,
      clasification,
      reference,
      bodies,
      fileNumber,
      plots,
      sheets,
      agrupationIdentifier,
      area,
      expertiseOfArea,
      folderLocation,
      groupedState,
      legal,
      polygone,
      responsibleUnit,
      secondState,
      technical,
    }) => ({
      Numero: registryNumber,
      Nombre: name,
      Codigo: code,
      "Codigo de busqueda": codeOfSearch,
      Estado: state?.name,
      Tipo: type?.name,
      Departamento: city?.name,
      Provincia: province?.name,
      Municipio: municipality?.name,
      Actividad: activity?.name,
      Clasificación: clasification?.name,
      Referencia: reference?.name,
      Cuerpos: bodies,
      Fojas: sheets,
      Parcelas: plots,
      ["Nro de expediente"]: fileNumber?.number,
      Superficie: area,
      ["Superficie de pericia"]: expertiseOfArea,
      Poligono: polygone,
      ["Estado agrupado"]: groupedState?.name,
      ["Ubicación de carpeta"]: folderLocation,
      ["Unidad responsable"]: responsibleUnit,
      ["Segundo estado"]: secondState,
      ["Id de agrupación social"]: agrupationIdentifier,
      Tecnico: buildFullName(technical?.user),
      Juridico: buildFullName(legal?.user),
    }),
  );
  const ws = XLSX.utils.json_to_sheet(exportData);
  const sheetName = `${data.length}-Predios`;
  const wb = { Sheets: { [sheetName]: ws }, SheetNames: [sheetName] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], { type: fileType });
  const fileName = `Reporte-${crypto.randomUUID().substring(0, 5)}-${new Date()
    .toISOString()
    .substring(0, 10)}${fileExtension}`;
  saveAs(blob, fileName);
};
