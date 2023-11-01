import { Activity } from "../../ActivityPage/models/types"
import { Beneficiary } from "../../BeneficiaryPage/models/types"
import { City } from "../../CityPage/models/types"
import { Clasification } from "../../ClasificationPage/models/types"
import { GroupedState } from "../../GroupedState/models/types"
import { Municipality } from "../../MunicipalityPage/models/types"
import { Observation } from "../../ObservationPage/models/types"
import { Province } from "../../ProvincePage/models/types"
import { Reference } from "../../ReferencePage/models/types"
import { ResponsibleUnit } from "../../ResponsibleUnitPage/models/types"
import { State } from "../../StatePage/models/types"
import { SubDirectory } from "../../SubDirectoryPage/models/types"
import { Tracking } from "../../TrackingPage/models/types"
import { Type } from "../../TypePage/models/types"
import { User } from "../../UserPage/models/types"

type UserOnProperty = {
  property: Property
  user: User
}

export interface Property {
  id: string
  registryNumber: number;
  name: string
  area?: string
  expertiseOfArea?: string
  plots: number
  bodies: number
  sheets: number
  code?: string
  codeOfSearch?: string
  agrupationIdentifier?: string
  secondState?: string
  polygone?: string
  observations: Observation[]
  beneficiaries: Partial<Beneficiary>[]
  city?: City
  province?: Province
  municipality?: Municipality
  activity?: Activity
  clasification?: Clasification
  state?: State
  groupedState?: GroupedState
  reference?: Reference
  type?: Type
  responsibleUnit?: ResponsibleUnit
  folderLocation?: SubDirectory
  trackings: Pick<Tracking, 'state' | 'dateOfInit' | 'dateOfEnd' | 'numberOfNote' | 'observation' | 'responsible'>[]
  technical?: UserOnProperty
  legal?: UserOnProperty
  createdAt: string
  updatedAt: string
}

export interface FormCreateProps {
  onHide: () => void
}

export interface FormUpdateProps extends FormCreateProps {
  params?: Record<string, string>
}