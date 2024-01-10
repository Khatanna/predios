import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Property } from "../../PropertyPage/models/types";
import { User } from "../models/types";
import { capitalizeString } from "./capitalizeString";

const buildFullName = (
  user?: Pick<User, "names" | "firstLastName" | "secondLastName">,
) => {
  if (!user) return;

  return `${capitalizeString(user.names)} ${capitalizeString(
    user.firstLastName,
  )} ${capitalizeString(user.secondLastName)}`;
};

export const exportToExcel = ({ data }: { data: Array<Property> }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  console.log(data);
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
      trackings,
    }) => ({
      Numero: registryNumber,
      Nombre: name,
      Codigo: code ? +code : "",
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
      ["Ultimo Seguimiento"]:
        trackings?.length > 0
          ? [
              `Fecha de inicio: ${trackings.at(-1)?.dateOfInit}`,
              `Estado: ${trackings.at(-1)?.state.name}`,
              `Responsable: ${buildFullName(trackings.at(-1)?.responsible)}`,
              `Estado: ${trackings.at(-1)?.state.name}`,
              `Nro Nota: ${trackings.at(-1)?.numberOfNote}`,
              `Observación: ${trackings.at(-1)?.observation}`,
            ].join("\n")
          : [],
    }),
  );
  const ws = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.sheet_add_aoa(ws, [], { origin: -1 });
  // ws['!cols'][Object.keys(exportData).length - 1] = { width: }
  const sheetName = `${data.length}-Predios`;
  const wb = { Sheets: { [sheetName]: ws }, SheetNames: [sheetName] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], { type: fileType });
  const fileName = `Reporte-${crypto.randomUUID().substring(0, 5)}-${new Date()
    .toISOString()
    .substring(0, 10)}${fileExtension}`;
  saveAs(blob, fileName);
};
