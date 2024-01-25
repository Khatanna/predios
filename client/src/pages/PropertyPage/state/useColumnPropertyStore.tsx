import { TableColumn } from "react-data-table-component";
import { create } from "zustand";
import { Property } from "../models/types";
import { produce } from "immer";
import LaPaz from '../../../assets/la-paz.svg'
import { buildTimeAgo } from "../../../utilities/buildTimeAgo";
interface State {
  columns: TableColumn<Property>[]
  showColumns: string[]
}

interface Actions {
  toogleShowColumn: (columnName: string) => void
  isChecked: (columnName: string) => boolean
}

const initialState: State = {
  columns: [
    {
      name: "Nro",
      selector: ({ registryNumber }) => `${registryNumber}`,
      right: true,
      compact: true,
      width: "40px",
      sortable: true,
      sortField: "registryNumber",
    },
    {
      name: "Nombre del predio",
      selector: (row) => row.name,
      wrap: true,
      grow: 2,
      sortable: true,
      sortField: "name",
    },
    {
      name: "Codigo anterior",
      selector: (row) => row.code ?? "Sin codigo",
      sortable: true,
      sortField: "code",
      omit: true
    },
    {
      name: "Codigo de busqueda",
      selector: (row) => row.codeOfSearch ?? "Sin codigo",
      sortable: true,
      sortField: "codeOfSearch",
    },
    {
      name: "Estado",
      selector: (row) => row.state?.name ?? "Sin estado definido",
      grow: 2,
    },
    {
      name: "Tipo de predio",
      selector: (row) => row.type?.name ?? "Sin definir",
      sortable: true,
      omit: true
    },
    {
      name: "Ubicación",
      cell: ({ city, province, municipality }) =>
        <div className="d-flex align-items-center">
          <img src={LaPaz} alt={"departamento"} width={18} />
          {`${city?.name} - ${province?.name} / ${municipality?.name}`
          } </div>,
      grow: 2,
    },
    {
      name: "Referencia",
      selector: (row) => row.reference?.name ?? "Sin definir",
      omit: true,
    },
    {
      name: "Unidad responsable",
      selector: (row) => row.responsibleUnit?.name ?? "Sin unidad",
    },
    {
      name: "Fecha de creación",
      center: true,
      cell: (row) => {
        const createdAt = new Date(+row.createdAt)
        return <div className="d-flex justify-content-center align-items-center flex-column" style={{
          fontSize: 11
        }}>
          {buildTimeAgo(row.createdAt)}
            <b style={{ fontSize: 8}}>
          {`${createdAt.toLocaleDateString()} | ${createdAt.toLocaleTimeString()}`} 
            </b>
        </div>
      },
      omit: false
    },
  ],
  showColumns: [
    "Nro",
    "Nombre del predio",
    "Codigo anterior",  
    "Tipo de predio",
    "Codigo de busqueda",
    "Estado",
    "Ubicación",
    "Referencia",
    "Unidad responsable",
    "Fecha de creación",
  ]
}

export const useColumnPropertyStore = create<State & Actions>()((set, get) => ({
  ...initialState,
  toogleShowColumn(columnName: string) {
    set((state) => produce(state, (draftState) => {
      const columnIndex = draftState.columns.findIndex((column) => column.name === columnName);

      if (columnIndex !== -1) {
        draftState.columns[columnIndex].omit = !draftState.columns[columnIndex].omit;
      }
    }))
  },
  isChecked(columnName) {
    return get().columns.some(column => column.name === columnName && !column.omit)
  },
}))