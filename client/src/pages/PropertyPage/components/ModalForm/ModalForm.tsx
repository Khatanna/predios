import { ModalProps, Modal } from 'react-bootstrap';
import { CityFormCreate } from '../CityFormCreate';
import { CityFormUpdate } from '../CityFormUpdate';
import { ProvinceFormCreate } from '../ProvinceFormCreate';
import { ProvinceFormUpdate } from '../ProvinceFormUpdate';
import { MunicipalityFormCreate } from '../MunicipalityFormCreate';
import { MunicipalityFormUpdate } from '../MunicipalityFormUpdate';
import { StateFormCreate } from '../StateFormCreate';
import { StateFormUpdate } from '../StateFormUpdate';
import { SubdirectoryFormCreate } from '../SubdirectoryFormCreate';
import { SubdirectoryFormUpdate } from '../SubdirectoryFormUpdate';
import { ActivityFormCreate } from '../ActivityFormCreate';
import { ActivityFormUpdate } from '../ActivityFormUpdate';
import { ResponsibleUnitFormCreate } from '../ResponsibleUnitFormCreate';
import { ResponsibleUnitFormUpdate } from '../ResponsibleUnitFormUpdate';
import { TypeFormCreate } from '../TypeFormCreate';
import { TypeFormUpdate } from '../TypeFormUpdate';
import { ClasificationFormCreate } from '../ClasificationFormCreate';
import { ClasificationFormUpdate } from '../ClasificationFormUpdate';
import { GroupedStateFormCreate } from '../GroupedStateFormCreate';
import { GroupedStateFormUpdate } from '../GroupedStateFormUpdate';
import { ReferenceFormCreate } from '../ReferenceFormCreate';
import { ReferenceFormUpdate } from '../ReferenceFormUpdate';

export type FormKey = keyof typeof forms

export type ModalFormProps = {
	form: FormKey, title: string, params?: Record<string, string>
} & ModalProps

const forms = {
	createCity: CityFormCreate,
	updateCity: CityFormUpdate,
	createProvince: ProvinceFormCreate,
	updateProvince: ProvinceFormUpdate,
	createMunicipality: MunicipalityFormCreate,
	updateMunicipality: MunicipalityFormUpdate,
	createState: StateFormCreate,
	updateState: StateFormUpdate,
	createSubdirectory: SubdirectoryFormCreate,
	updateSubdirectory: SubdirectoryFormUpdate,
	createActivity: ActivityFormCreate,
	updateActivity: ActivityFormUpdate,
	createResponsibleUnit: ResponsibleUnitFormCreate,
	updateResponsibleUnit: ResponsibleUnitFormUpdate,
	createType: TypeFormCreate,
	updateType: TypeFormUpdate,
	createClasification: ClasificationFormCreate,
	updateClasification: ClasificationFormUpdate,
	createGroupedState: GroupedStateFormCreate,
	updateGroupedState: GroupedStateFormUpdate,
	createReference: ReferenceFormCreate,
	updateReference: ReferenceFormUpdate
}

const ModalForm: React.FC<ModalFormProps> = ({ title, form, params, ...props }) => {
	const Formulary = forms[form];

	return <Modal {...props}>
		<Modal.Header closeButton>
			<Modal.Title>{title}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Formulary onHide={props.onHide!} params={params} />
		</Modal.Body>
	</Modal>
}
export default ModalForm;
