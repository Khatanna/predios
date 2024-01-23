import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Property } from "../../PropertyPage/models/types";
import { buildFullName } from "./buildFullName";

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
    }) => {
      const buildTracking = trackings
        .sort(
          (a, b) =>
            new Date(a.dateOfInit).getTime() - new Date(b.dateOfInit).getTime(),
        )
        .at(-1);
      return {
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
        ["Ubicación de carpeta"]: folderLocation?.name,
        ["Unidad responsable"]: responsibleUnit?.name,
        ["Segundo estado"]: secondState,
        ["Id de agrupación social"]: agrupationIdentifier,
        Tecnico: buildFullName(technical?.user),
        Juridico: buildFullName(legal?.user),
        ["Seguimiento: Fecha de inicio"]:
          buildTracking?.dateOfInit ?? "Sin fecha",
        ["Seguimiento: Responsable"]:
          buildFullName(buildTracking?.responsible) ?? "Sin responsable",
        ["Seguimiento: Nro de nota"]: buildTracking?.numberOfNote ?? "Sin nota",
        ["Seguimiento: Observación"]:
          buildTracking?.observation ?? "Sin observacion",
      };
    },
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
