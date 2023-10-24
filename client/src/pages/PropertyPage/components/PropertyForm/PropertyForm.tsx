import { useState } from 'react';
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
  GeoAlt,
  GlobeAmericas,
  Hash,
  Hexagon,
  Icon2Circle,
  Key,
  Link45deg,
  ListColumns,
  Map,
  People,
  PeopleFill,
  PersonGear,
  PersonWorkspace,
  Search,
} from "react-bootstrap-icons";
import { Controller, FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Icon } from "../../../../components/Icon";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { Activity } from "../../../ActivityPage/models/types";
import { City } from "../../../CityPage/models/types";
import { Clasification } from "../../../ClasificationPage/models/types";
import { GroupedState } from "../../../GroupedState/models/types";
import { Municipality } from "../../../MunicipalityPage/models/types";
import { Province } from "../../../ProvincePage/models/types";
import { Reference } from "../../../ReferencePage/models/types";
import { ResponsibleUnit } from "../../../ResponsibleUnitPage/models/types";
import { State } from "../../../StatePage/models/types";
import { SubDirectory } from "../../../SubDirectoryPage/models/types";
import { Type } from "../../../TypePage/models/types";
import { User } from "../../../UserPage/models/types";
import { activityRepository, cityRepository, clasificationRepository, groupedStateRepository, municipalityRepository, provinceRepository, referenceRespository, responsibleUnitRepository, stateRepository, subdirectoryRepository, typeRepository } from '../../hooks/useRepository';
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { DropdownMenuOfSelect } from '../DropdownMenuOfSelect';
import { EnhancedSelect } from '../EnhancedSelect';
import ModalForm, { FormKey } from '../ModalForm/ModalForm';
import { SelectUser } from '../SelectUser';
import { useCustomMutation } from '../../../../hooks';
import { Tracking } from '../../../TrackingPage/models/types';
export type PropertyFormProps = {
  property?: Property;
};

const GET_QUERY = `
	query GetFields {
		types: getAllTypes {
			name
		}
		activities: getAllActivities {
			name
		}
		clasifications: getAllClasifications {
			name
		}
		states: getAllStates {
			name
		}
		responsibleUnits: getAllResponsibleUnits {
			name
		}
		subdirectories: getAllSubDirectories {
			name
		}
		groupedStates: getAllGroupedStates {
			name
		}
		references: getAllReferences {
			name
		}
	}
`;

interface ResponseAPI {
  types: Type[];
  activities: Activity[];
  states: State[];
  subdirectories: SubDirectory[];
  responsibleUnits: ResponsibleUnit[];
  clasifications: Clasification[];
  groupedStates: GroupedState[];
  references: Reference[];
  tecnicians: User[];
  legal: User[];
}


const GET_ALL_CITIES_QUERY = `
  query GetAllCities {
    cities: getAllCities {
      name
    }
  }
`;

const GET_ALL_PROVINCES_BY_CITY_NAME = `
  query GetProvincesByCityName ($city: String) {
    provinces: getProvinces(city: $city) {
      name
    }
  }
`;

const GET_MUNICIPALITIES_BY_PROVINCE_NAME = `
	query GetMunicipalitiesByProvinceName($province: String) {
		municipalities: getMunicipalities(province: $province) {
			name
		}
	}
`;

const { useStore: useCityStore, useMutations: useCityMutations } = cityRepository;
const { useStore: useProvinceStore, useMutations: useProvinceMutations } = provinceRepository
const { useStore: useMunicipalityStore, useMutations: useMunicipalityMutations } = municipalityRepository;
const { useStore: useStateStore, useMutations: useStateMutations } = stateRepository;
const { useStore: useSubdirectoryStore, useMutations: useSubdirectoryMutations } = subdirectoryRepository
const { useStore: useResponsibleUnitStore, useMutations: useResponsibleUnitMutations } = responsibleUnitRepository
const { useStore: useTypeStore, useMutations: useTypeMutations } = typeRepository;
const { useStore: useActivityStore, useMutations: useActivityMutations } = activityRepository
const { useStore: useClasificationStore, useMutations: useClasificationMutations } = clasificationRepository
const { useStore: useGroupedStateStore, useMutations: useGroupedStateMutations } = groupedStateRepository
const { useStore: useReferenceStore, useMutations: useReferenceMutations } = referenceRespository

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

// type PropertyFormType = Omit<Property, 'trackings'> & { trackings: Omit<Tracking, 'responsible'> & { responsible: { label: string; value: string } }[] }
const PropertyForm: React.FC<PropertyFormProps> = ({ property }) => {
  const { handleSubmit, register, ...methods } = useForm<Property>({
    defaultValues: property
  });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'trackings',
  })
  const { setItems: setCities, items: cities } = useCityStore();
  const { setItems: setProvinces, items: provinces } = useProvinceStore();
  const { setItems: setMunicipalities, items: municipalities } = useMunicipalityStore();
  const { setItems: setTypes, items: types } = useTypeStore();
  const { setItems: setStates, items: states } = useStateStore();
  const { setItems: setSubdirectories, items: subdirectories } =
    useSubdirectoryStore();
  const { setItems: setActivities, items: activities } = useActivityStore();
  const { setItems: setResposibleUnits, items: responsibleUnits } =
    useResponsibleUnitStore();
  const { setItems: setClasifications, items: clasifications } =
    useClasificationStore();
  const { setItems: setReferences, items: references } = useReferenceStore();
  const { setItems: setGroupedStates, items: groupedStates } =
    useGroupedStateStore();

  const city = methods.watch("city.name");
  const province = methods.watch("province.name");
  const municipality = methods.watch("municipality.name");
  const subdirectory = methods.watch("subDirectory.name");
  const responsibleUnit = methods.watch("responsibleUnit.name");
  const activity = methods.watch("activity.name");
  const type = methods.watch("type.name");
  const state = methods.watch("state.name");
  const clasification = methods.watch("clasification.name");
  const groupedState = methods.watch('groupedState.name');
  const reference = methods.watch('reference.name');

  useCustomQuery<{ cities: City[] }>(
    GET_ALL_CITIES_QUERY,
    ["getAllCities"],
    {
      onSuccess({ cities }) {
        setCities(cities);
      },
    },
  );
  useCustomQuery<{ provinces: Pick<Province, "name">[] }>(
    GET_ALL_PROVINCES_BY_CITY_NAME,
    ["getAllProvincesByCityName", { city }],
    {
      onSuccess({ provinces }) {
        setProvinces(provinces);
      },
    },
  );
  useCustomQuery<{ municipalities: Pick<Municipality, "name">[] }>(
    GET_MUNICIPALITIES_BY_PROVINCE_NAME,
    ["getMunicipalitiesByProvinceName", { province }],
    {
      onSuccess({ municipalities }) {
        setMunicipalities(municipalities);
      },
    },
  );
  const { error } = useCustomQuery<ResponseAPI>(
    GET_QUERY,
    ["getFieldForCreate"],
    {
      onSuccess({
        types,
        activities,
        clasifications,
        references,
        groupedStates,
        responsibleUnits,
        states,
        subdirectories,
      }) {
        setStates(states);
        setTypes(types);
        setSubdirectories(subdirectories);
        setActivities(activities);
        setResposibleUnits(responsibleUnits);
        setClasifications(clasifications);
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
  const [modal, setModal] = useState<{ form: FormKey, title: string, show: boolean, params?: Record<string, string> }>();

  const { mutationDelete: mutationCityDelete } = useCityMutations<{ city: City }>();
  const { mutationDelete: mutationProvinceDelete } = useProvinceMutations<{ province: Province }>();
  const { mutationDelete: mutationMunicipalityDelete } = useMunicipalityMutations<{ municipality: Municipality }>();
  const { mutationDelete: mutationStateDelete } = useStateMutations<{ state: State }>();
  const { mutationDelete: mutationSubdirectoryDelete } = useSubdirectoryMutations<{ subdirectory: SubDirectory }>();
  const { mutationDelete: mutationActivityDelete } = useActivityMutations<{ activity: Activity }>();
  const { mutationDelete: mutationResponsibleUnitDelete } = useResponsibleUnitMutations<{ responsibleUnit: ResponsibleUnit }>();
  const { mutationDelete: mutationTypeDelete } = useTypeMutations<{ type: Type }>();
  const { mutationDelete: mutationClasificationDelete } = useClasificationMutations<{ clasification: Clasification }>();
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
        {modal && <ModalForm centered onHide={() => setModal(undefined)} {...modal} />}
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
                        disabled={!property}
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
                      disabled={!property}
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
                      disabled={!property}
                      placeholder="Poligono"
                      {...register("polygone")}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Departamento"
                      icon={<GlobeAmericas color="orange" />}
                    />
                    <InputGroup>
                      <Controller
                        name="city.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              methods.resetField('province.name', { defaultValue: 'undefined' });
                              methods.resetField('municipality.name', { defaultValue: 'undefined' });
                            }}
                            disabled={cities.length === 0 || !property}
                            size="sm"
                            placeholder={"Departamento"}
                            options={cities.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      {property && <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: city !== "undefined",
                            showDelete: city !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createCity', title: 'Crear departamento', show: true })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateCity', title: 'Actualizar departamento', show: true, params: { name: city } })
                          }}
                          onDelete={() => {
                            const city = methods.getValues("city");
                            if (city) {
                              mutationCityDelete(city, {
                                onSuccess({ data: { city: { name } } }) {
                                  customSwalSuccess(
                                    "Departamento eliminado",
                                    `El departamento ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar el departamento ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('city.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>}
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Provincia"
                      icon={<Map color="blue" />}
                    />
                    <InputGroup>
                      <Controller
                        name="province.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              methods.resetField('municipality.name', { defaultValue: 'undefined' });
                            }}
                            disabled={city === "undefined" || provinces.length === 0}
                            size="sm"
                            placeholder={"Provincia"}
                            options={provinces.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      {city !== "undefined" && <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: province !== "undefined",
                            showDelete: province !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createProvince', title: 'Crear provincia', show: true, params: { cityName: city } })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateProvince', title: 'Actualizar provincia', show: true, params: { name: province } })
                          }}
                          onDelete={() => {
                            const province = methods.getValues("province");
                            if (province) {
                              mutationProvinceDelete(province, {
                                onSuccess({ data: { province: { name } } }) {
                                  customSwalSuccess(
                                    "Provincia eliminada",
                                    `La provincia ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar la provincia ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('province.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>}
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Municipio"
                      icon={<GeoAlt color="purple" />}
                    />
                    <InputGroup>
                      <Controller
                        name="municipality.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            disabled={province === "undefined" || municipalities.length === 0}
                            size="sm"
                            placeholder="Municipio"
                            options={municipalities.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      {province !== "undefined" && <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: municipality !== "undefined",
                            showDelete: municipality !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createMunicipality', show: true, title: 'Crear municipio', params: { provinceName: province } })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateMunicipality', show: true, title: 'Actualizar municipio', params: { name: municipality } })
                          }}
                          onDelete={() => {
                            const municipality = methods.getValues("municipality");
                            if (municipality) {
                              mutationMunicipalityDelete(municipality, {
                                onSuccess({ data: { municipality: { name } } }) {
                                  customSwalSuccess(
                                    "Municipío eliminado",
                                    `El municipio ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar el municipio ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('municipality.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>}
                    </InputGroup>
                  </Form.Group>
                </Col>
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
                      <Form.Control
                        {...register("expertiseOfArea")}
                        size="sm"
                      />
                      <InputGroup.Text className="fw-bold">
                        [ha]
                      </InputGroup.Text>
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
                    <InputGroup>
                      <Controller
                        name="state.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Estado"}
                            options={states.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: state !== "undefined",
                            showDelete: state !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createState', title: 'Crear Estado', show: true })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateState', title: 'Actualizar Estado', show: true, params: { name: state } })
                          }}
                          onDelete={() => {
                            const state = methods.getValues('state');
                            if (state) {
                              mutationStateDelete(state, {
                                onSuccess({ data: { state: { name } } }) {
                                  customSwalSuccess(
                                    "Estado eliminado",
                                    `El estado ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar el departamento ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('state.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <CustomLabel
                      label="Subcarpeta"
                      icon={<Folder color="orange" />}
                    />
                    <InputGroup>
                      <Controller
                        name="subDirectory.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Subcarpeta"}
                            options={subdirectories.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: subdirectory !== "undefined",
                            showDelete: subdirectory !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createSubdirectory', title: 'Crear Subcarpeta', show: true })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateSubdirectory', title: 'Actualizar Subcarpeta', show: true, params: { name: subdirectory } })
                          }}
                          onDelete={() => {
                            const subdirectory = methods.getValues('subDirectory');
                            if (subdirectory) {
                              mutationSubdirectoryDelete(subdirectory, {
                                onSuccess({ data: { subdirectory: { name } } }) {
                                  customSwalSuccess("Subcarpeta eliminada correctamente", `La subcarpeta con el nombre ${name} ha sido eliminada correctamente`);
                                },
                                onError(error, { name }) {
                                  customSwalError(error.response!.data.errors[0].message, `Ocurrio un error al intentar eliminar la subcarpeta ${name}`)
                                },
                                onSettled() {
                                  methods.resetField('subDirectory.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <CustomLabel
                      label="Unidad responsable"
                      icon={<People color="#40d781" />}
                    />
                    <InputGroup>
                      <Controller
                        name="responsibleUnit.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Unidad responsable"}
                            options={responsibleUnits.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: responsibleUnit !== "undefined",
                            showDelete: responsibleUnit !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createResponsibleUnit', title: 'Crear unidad responsable', show: true })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateResponsibleUnit', title: 'Actualizar unidad responsable', show: true, params: { name: responsibleUnit } })
                          }}
                          onDelete={() => {
                            const responsibleUnit = methods.getValues('responsibleUnit');
                            if (responsibleUnit) {
                              mutationResponsibleUnitDelete(responsibleUnit, {
                                onSuccess({ data: { responsibleUnit: { name } } }) {
                                  customSwalSuccess(
                                    "Unidad responsable eliminada",
                                    `La unidad responsable ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar la unidad responsable ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('responsibleUnit.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
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
                    <InputGroup>
                      <Controller
                        name="type.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Tipo de predio"}
                            options={types.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: type !== "undefined",
                            showDelete: type !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createType', title: 'Crear tipo de predio', show: true })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateType', title: 'Actualizar tipo de predio', show: true, params: { name: type } })
                          }}
                          onDelete={() => {
                            const type = methods.getValues('type');

                            if (type) {
                              mutationTypeDelete(type, {
                                onSuccess({ data: { type: { name } } }) {
                                  customSwalSuccess(
                                    "Tipo de predio eliminado",
                                    `El tipo de predio ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar el tipo de predio ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('type.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Actividad"
                      icon={<ActivityIcon color="red" />}
                    />
                    <InputGroup>
                      <Controller
                        name="activity.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Actividad"}
                            options={activities.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: activity !== "undefined",
                            showDelete: activity !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createActivity', title: 'Crear Actividad', show: true })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateActivity', title: 'Actualizar Actividad', show: true, params: { name: activity } })
                          }}
                          onDelete={() => {
                            const activity = methods.getValues('activity');

                            if (activity) {
                              mutationActivityDelete(activity, {
                                onSuccess({ data: { activity: { name } } }) {
                                  customSwalSuccess(
                                    "Actividad eliminada",
                                    `La actividad ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar la actividad ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('activity.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Clasificación"
                      icon={<Diagram3 color="green" />}
                    />
                    <InputGroup>
                      <Controller
                        name="clasification.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={(({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Clasificación"}
                            options={clasifications.map(({ name }) => ({ label: name, value: name }))}
                          />
                        ))}
                      />
                      <InputGroup.Text>
                        <DropdownMenuOfSelect
                          disableOptions={{
                            showEdit: clasification !== "undefined",
                            showDelete: clasification !== "undefined"
                          }}
                          onCreate={() => {
                            setModal({ form: 'createClasification', title: 'Crear Clasificación', show: true })
                          }}
                          onEdit={() => {
                            setModal({ form: 'updateClasification', title: 'Actualizar Clasificación', show: true, params: { name: clasification } })
                          }}
                          onDelete={() => {
                            const clasification = methods.getValues('clasification');

                            if (clasification) {
                              mutationClasificationDelete(clasification, {
                                onSuccess({ data: { clasification: { name } } }) {
                                  customSwalSuccess(
                                    "Clasificación eliminada",
                                    `La clasificación ${name} se ha eliminado correctamente`,
                                  );
                                },
                                onError(error, { name }) {
                                  customSwalError(
                                    error.response!.data.errors[0].message,
                                    `Ocurrio un error al intentar eliminar la clasificación ${name}`,
                                  );
                                },
                                onSettled() {
                                  methods.resetField('activity.name', { defaultValue: 'undefined' })
                                }
                              });
                            }
                          }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
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
                      placeholder="estado 2"
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
                  <InputGroup>
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
                        />
                      ))}
                    />
                    <InputGroup.Text>
                      <DropdownMenuOfSelect
                        disableOptions={{
                          showEdit: groupedState !== "undefined",
                          showDelete: groupedState !== "undefined"
                        }}
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
                    </InputGroup.Text>
                  </InputGroup>
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
                  <InputGroup>
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
                        />
                      ))}
                    />
                    <InputGroup.Text>
                      <DropdownMenuOfSelect
                        disableOptions={{
                          showEdit: reference !== "undefined",
                          showDelete: reference !== "undefined"
                        }}
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
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Row>
            </Col>
            <Col className='d-flex flex-column gap-2' xs={12}>
              {fields.map((tracking, index) => (
                < Row className="border border-1 py-2 border-dark-subtle rounded-1 position-relative" key={crypto.randomUUID()} >
                  <Col xs={3}>
                    <Form.Group>
                      <CustomLabel
                        label="Seguimiento Estado"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <InputGroup>
                        <Controller
                          key={crypto.randomUUID()}
                          name={`trackings.${index}.state.name`}
                          defaultValue="undefined"
                          render={(({ field }) => (
                            <EnhancedSelect
                              {...field}
                              size='sm'
                              placeholder={"Seguimiento Estado"}
                              options={states.map(({ name }) => ({ label: name, value: name }))}
                            />
                          ))}
                        />
                      </InputGroup>
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
      </FormProvider >
    </Container >
  );
};

export default PropertyForm;