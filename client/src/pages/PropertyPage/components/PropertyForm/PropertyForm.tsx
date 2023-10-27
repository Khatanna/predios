import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import {
  Activity as ActivityIcon,
  BodyText,
  Box2,
  Code,
  Compass,
  DashCircle,
  Database,
  DeviceSsd,
  Diagram3,
  EyeFill,
  Folder,
  Hash,
  Hexagon,
  Icon2Circle,
  Key,
  Link45deg,
  ListColumns,
  People,
  PeopleFill,
  PersonGear,
  PersonWorkspace,
  Search,
} from "react-bootstrap-icons";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Icon } from "../../../../components/Icon";
import { useCustomMutation } from '../../../../hooks';
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { GroupedState } from "../../../GroupedState/models/types";
import { Reference } from "../../../ReferencePage/models/types";
import { ResponsibleUnit } from "../../../ResponsibleUnitPage/models/types";
import { Tracking } from '../../../TrackingPage/models/types';
import { useGroupedStateMutations, useGroupedStateStore, useReferenceMutations, useReferenceStore } from '../../hooks/useRepository';
import { Property } from "../../models/types";
import { useModalStore } from '../../state/useModalStore';
import { ActivitySelect } from "../ActivitySelect";
import { ClasificationSelect } from "../ClasificationSelect";
import { CustomLabel } from "../CustomLabel";
import { EnhancedSelect } from '../EnhancedSelect';
import { Localization } from '../Localization';
import ModalForm from '../ModalForm/ModalForm';
import { ResponsibleUnitSelect } from "../ResponsibleUnitSelect";
import { SelectUser } from '../SelectUser';
import { StateSelect } from "../StateSelect";
import { SubdirectorySelect } from "../SubdirectorySelect";
import { TypeSelect } from '../TypeSelect';

export type PropertyFormProps = {
  property?: Property;
};

const GET_QUERY = `
	query GetFields {
		groupedStates: getAllGroupedStates {
			name
		}
		references: getAllReferences {
			name
		}
	}
`;

interface ResponseAPI {
  groupedStates: GroupedState[];
  references: Reference[];
}

const CREATE_PROPERTY_MUTATION = `
  mutation CreateProperty($input: PropertyInput) {
    property: createProperty(input: $input) {
      name
    }
  }
`;

type TrackingInput = {
  stateName: string
  responsibleUsername: string
} & Pick<Tracking, 'numberOfNote' | 'observation' | 'dateOfInit' | 'dateOfEnd'>

type PropertyInput = {
  input: Pick<Property, 'name' | 'area' | 'expertiseOfArea' | 'plots' | 'bodies' | 'sheets' | 'code' | 'codeOfSearch' | 'agrupationIdentifier' | 'secondState' | 'polygone'> &
  {
    activityName: string;
    clasificationName: string;
    stateName: string;
    groupedStateName: string;
    cityName: string;
    provinceName: string;
    municipalityName: string;
    subDirectoryName: string;
    technicalUsername: string;
    legalUsername: string;
    typeName: string;
    responsibleUnitName: string;
    referenceName: string;
    trackings: TrackingInput[]
  }
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property }) => {
  const { handleSubmit, register, ...methods } = useForm<Property>({
    defaultValues: property
  });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'trackings',
  })

  const { setItems: setReferences, items: references } = useReferenceStore();
  const { setItems: setGroupedStates, items: groupedStates } =
    useGroupedStateStore();

  const [groupedState, reference] = methods.watch(['groupedState.name', 'reference.name']);

  const { error } = useCustomQuery<ResponseAPI>(
    GET_QUERY,
    ["getFieldsForCreate"],
    {
      onSuccess({
        references,
        groupedStates,
      }) {
        setReferences(references);
        setGroupedStates(groupedStates);
      },
    },
  );
  const [createProperty] = useCustomMutation<{ property: Property }, PropertyInput>(CREATE_PROPERTY_MUTATION)

  const submit = (data: Property) => {
    console.log(data);
    createProperty({
      input: {
        name: data.name,
        area: data.area,
        expertiseOfArea: data.expertiseOfArea,
        plots: +data.plots,
        bodies: +data.bodies,
        sheets: +data.sheets,
        code: data.code,
        codeOfSearch: data.codeOfSearch,
        agrupationIdentifier: data.agrupationIdentifier,
        secondState: data.secondState,
        polygone: data.polygone,
        activityName: data.activity?.name,
        clasificationName: data.clasification?.name,
        stateName: data.state?.name,
        groupedStateName: data.groupedState?.name,
        cityName: data.city?.name,
        provinceName: data.province?.name,
        municipalityName: data.municipality?.name,
        subDirectoryName: data.subDirectory?.name,
        technicalUsername: data.technical?.user.username,
        legalUsername: data.legal?.user.username,
        typeName: data.type?.name,
        responsibleUnitName: data.responsibleUnit?.name,
        referenceName: data?.reference?.name,
        trackings: data.trackings.map(tracking => ({
          stateName: tracking.state.name,
          numberOfNote: tracking.numberOfNote,
          observation: tracking.observation,
          responsibleUsername: tracking.responsible?.username,
          dateOfInit: tracking.dateOfInit,
          dateOfEnd: tracking.dateOfEnd
        }))
      }
    })
  };
  const { setModal, ...modal } = useModalStore();

  const { mutationDelete: mutationGroupedStateDelete } = useGroupedStateMutations<{ groupedState: GroupedState }>();
  const { mutationDelete: mutationReferenceDelete } = useReferenceMutations<{ reference: Reference }>();

  if (error) {
    <div>{error}</div>
  }

  return (
    <Container fluid>
      <FormProvider
        {...methods}
        handleSubmit={handleSubmit}
        register={register}
      >
        {modal.show && <ModalForm centered onHide={() => setModal({ form: undefined, show: false, params: undefined, title: undefined })} {...modal} />}
        {property && (
          <Icon label='Número de registro'>
            <div className='position-fixed bottom-0 text-white m-3 start-0 bg-success border rounded-circle px-3 py-2 fw-bold z-2'>{property.registryNumber}</div>
          </Icon>
        )}
        <Form onSubmit={handleSubmit(submit)} id="propertyForm">
          <Row className="d-flex flex-row gap-2">
            <Col className="d-flex flex-column gap-2">
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Nombre del predio"
                      icon={<BodyText color="#b3245b" />}
                    />
                    <InputGroup>
                      <Form.Control
                        className="fw-bold"
                        as="textarea"
                        rows={2}
                        placeholder="Nombre del predio"
                        {...register("name")}
                        autoComplete="off"
                      />
                      <InputGroup.Text>
                        <div className="d-flex flex-column">
                          <Icon label="observaciones">
                            <EyeFill color="#bada2d" size={18} />
                          </Icon>
                          <Icon label="beneficiarios">
                            <PeopleFill color="green" size={18} />
                          </Icon>
                        </div>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col xs={2}>
                  <Form.Group>
                    <CustomLabel
                      label="Codigo P"
                      icon={<Code color="green" />}
                    />
                    <Form.Control
                      size="sm"
                      placeholder="Codigo"
                      {...register("code")}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
                <Col xs={2}>
                  <Form.Group>
                    <CustomLabel
                      label="Poligono"
                      icon={<Hexagon color="skyblue" />}
                    />
                    <Form.Control
                      size="sm"
                      placeholder="Poligono"
                      {...register("polygone")}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
                <Localization />
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col xs={3}>
                  <Form.Group>
                    <CustomLabel
                      label="Codigo de busqueda"
                      icon={<Search color="brown" />}
                    />
                    <Form.Control
                      {...register("codeOfSearch")}
                      size="sm"
                      placeholder="Codigo de busqueda"
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Datos"
                      icon={<Database color="#dc0e67" />}
                    />
                    <InputGroup size="sm">
                      <InputGroup.Text>Parcelas</InputGroup.Text>
                      <Form.Control {...register("plots")} size="sm" />
                      <InputGroup.Text>Fojas</InputGroup.Text>
                      <Form.Control {...register("sheets")} size="sm" />
                      <InputGroup.Text>Cuerpos</InputGroup.Text>
                      <Form.Control {...register("bodies")} size="sm" />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Datos de superficie"
                      icon={<Compass color="#3aa0f4" />}
                    />
                    <InputGroup size="sm">
                      <InputGroup.Text>Superficie</InputGroup.Text>
                      <Form.Control {...register("area")} size="sm" />
                      <InputGroup.Text>Pericia</InputGroup.Text>
                      <Form.Control {...register("expertiseOfArea")} size="sm" />
                      <InputGroup.Text className="fw-bold">[ha]</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Estado"
                      icon={<DeviceSsd color="#ff5e00" />}
                    />
                    <StateSelect name='state.name' />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <CustomLabel
                      label="Subcarpeta"
                      icon={<Folder color="orange" />}
                    />
                    <SubdirectorySelect />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <CustomLabel
                      label="Unidad responsable"
                      icon={<People color="#40d781" />}
                    />
                    <ResponsibleUnitSelect />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Tipo de predio"
                      icon={<ListColumns />}
                    />
                    <TypeSelect />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Actividad"
                      icon={<ActivityIcon color="red" />}
                    />
                    <ActivitySelect />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Clasificación"
                      icon={<Diagram3 color="green" />}
                    />
                    <ClasificationSelect />
                  </Form.Group>
                </Col>
                <Col xs={2}>
                  <Form.Group>
                    <CustomLabel
                      label="Nro. de expediente"
                      icon={<Hash color="#d44da2" />}
                    />
                    <Form.Control size="sm" placeholder="Nro de expediente" />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col className="d-flex flex-column gap-2 justify-content-between" xs={3}>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col xs={4}>
                  <Form.Group>
                    <CustomLabel
                      label="Estado 2"
                      icon={<Icon2Circle color="gray" />}
                    />
                    <Form.Control
                      {...register("secondState")}
                      size="sm"
                      placeholder="Estado 2"
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Id de agrupación"
                      icon={<Key color="#cac537" />}
                    />
                    <Form.Control
                      {...register("agrupationIdentifier")}
                      size="sm"
                      placeholder="Id de agrupación"
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Form.Group>
                  <CustomLabel
                    label="Estado agrupado"
                    icon={<Box2 color="#864e16" />}
                  />
                  <Controller
                    name="groupedState.name"
                    control={methods.control}
                    defaultValue="undefined"
                    render={(({ field }) => (
                      <EnhancedSelect
                        {...field}
                        size="sm"
                        placeholder={"Estado agrupado"}
                        options={groupedStates.map(({ name }) => ({ label: name, value: name }))}
                        onCreate={() => {
                          setModal({ form: 'createGroupedState', title: 'Crear estado agrupado', show: true })
                        }}
                        onEdit={() => {
                          setModal({ form: 'updateGroupedState', title: 'Actualizar estado agrupado', show: true, params: { name: groupedState } })
                        }}
                        onDelete={() => {
                          const groupedState = methods.getValues('groupedState');

                          if (groupedState) {
                            mutationGroupedStateDelete(groupedState, {
                              onSuccess({ data: { groupedState: { name } } }) {
                                customSwalSuccess(
                                  "Estado agrupado eliminado",
                                  `El estado agrupado ${name} se ha eliminado correctamente`,
                                );
                              },
                              onError(error, { name }) {
                                customSwalError(
                                  error.response!.data.errors[0].message,
                                  `Ocurrio un error al intentar eliminar el estado agrupado ${name}`,
                                );
                              },
                              onSettled() {
                                methods.resetField('groupedState.name', { defaultValue: 'undefined' })
                              }
                            });
                          }
                        }}
                      />
                    ))}
                  />
                </Form.Group>
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Juridico"
                      icon={<PersonWorkspace color="green" />}
                    />
                    <Controller
                      name='legal.user'
                      control={methods.control}
                      render={({ field }) => (
                        <SelectUser
                          {...field}
                          placeholder="Juridico"
                          type="juridico"
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Tecnico"
                      icon={<PersonGear color="brown" />}
                    />
                    <Controller
                      name='technical.user'
                      control={methods.control}
                      render={({ field }) => (
                        <SelectUser
                          {...field}
                          type="tecnico"
                          placeholder="Tecnico" />
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                <Form.Group>
                  <CustomLabel
                    label="Referencia"
                    icon={<Link45deg color="#7d7907" />}
                  />
                  <Controller
                    name="reference.name"
                    control={methods.control}
                    defaultValue="undefined"
                    render={(({ field }) => (
                      <EnhancedSelect
                        {...field}
                        size="sm"
                        placeholder={"Referencia"}
                        options={references.map(({ name }) => ({ label: name, value: name }))}
                        onCreate={() => {
                          setModal({ form: 'createReference', title: 'Crear referencia', show: true })
                        }}
                        onEdit={() => {
                          setModal({ form: 'updateReference', title: 'Actualizar referencia', show: true, params: { name: reference } })
                        }}
                        onDelete={() => {
                          const reference = methods.getValues('reference');

                          if (reference) {
                            mutationReferenceDelete(reference, {
                              onSuccess({ data: { reference: { name } } }) {
                                customSwalSuccess(
                                  "Referencia eliminada",
                                  `La referencia ${name} se ha eliminado correctamente`,
                                );
                              },
                              onError(error, { name }) {
                                customSwalError(
                                  error.response!.data.errors[0].message,
                                  `Ocurrio un error al intentar eliminar la referencia ${name}`,
                                );
                              },
                              onSettled() {
                                methods.resetField('reference.name', { defaultValue: 'undefined' })
                              }
                            });
                          }
                        }}
                      />
                    ))}
                  />
                </Form.Group>
              </Row>
            </Col>
            <Col className='d-flex flex-column gap-2' xs={12}>
              {fields.map((tracking, index) => (
                <Row className="border border-1 py-2 border-dark-subtle rounded-1 position-relative" key={crypto.randomUUID()} >
                  <Col xs={3}>
                    <Form.Group>
                      <CustomLabel
                        label="Seguimiento Estado"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <StateSelect
                        name={`trackings.${index}.state.name`}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <CustomLabel
                        label="Fecha de inicio"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <Form.Control
                        key={crypto.randomUUID()}
                        type='date'
                        {...register(`trackings.${index}.dateOfInit`)}
                        size='sm'
                        placeholder='Fecha de inicio'
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <CustomLabel
                        label="Fecha de finalización"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <Form.Control
                        type='date'
                        key={crypto.randomUUID()}
                        placeholder='Fecha de finalización'
                        {...register(`trackings.${index}.dateOfEnd`)}
                        size='sm'
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={3}>
                    <Form.Group>
                      <CustomLabel
                        label="Responsable"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <Controller
                        key={crypto.randomUUID()}
                        name={`trackings.${index}.responsible`}
                        render={({ field }) => (
                          <SelectUser
                            {...field}
                            placeholder='Responsable'
                            type='responsable'
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <CustomLabel
                        label="# Nota"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <Form.Control
                        {...register(`trackings.${index}.numberOfNote`)}
                        size='sm'
                        placeholder='# Nota'
                      />
                    </Form.Group>
                  </Col>
                  <Col >
                    <Form.Group>
                      <CustomLabel
                        label="Observación"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <Form.Control
                        {...register(`trackings.${index}.observation`)}
                        size='sm'
                        placeholder='Observación'
                      />
                    </Form.Group>
                  </Col>
                  <div className={"position-absolute top-0 left-0 mt-2"}>
                    <Icon label="Quitar seguimiento">
                      <DashCircle color="red" className="float-end" role='button' onClick={() => remove(index)} />
                    </Icon>
                  </div>
                </Row>
              ))}
            </Col>
          </Row>
          <Row>
            <Col className='d-flex justify-content-end gap-2 my-2'>
              <Button onClick={() => append({
                numberOfNote: '',
                observation: '',
                state: {
                  name: 'undefined'
                },
                dateOfInit: new Date().toISOString().substring(0, 10)
              })}>Añadir seguimiento</Button>
              <Button type="submit" variant='success'>
                Crear predio
              </Button>
            </Col>
          </Row>
        </Form>
      </FormProvider>
    </Container>
  );
};

export default PropertyForm;