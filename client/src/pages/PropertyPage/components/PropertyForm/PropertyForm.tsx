import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import {
  Activity as ActivityIcon,
  BodyText,
  Box2,
  Code,
  Compass,
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
import { FormProvider, useForm, Controller } from "react-hook-form";
import { Icon } from "../../../../components/Icon";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { Activity } from "../../../ActivityPage/models/types";
import { City } from "../../../CityPage/models/types";
import { Clasification } from "../../../ClasificationPage/models/types";
import { GroupedState } from "../../../GroupedState/models/types";
import { Reference } from "../../../ReferencePage/models/types";
import { ResponsibleUnit } from "../../../ResponsibleUnitPage/models/types";
import { State } from "../../../StatePage/models/types";
import { SubDirectory } from "../../../SubDirectoryPage/models/types";
import { Type } from "../../../TypePage/models/types";
import { User } from "../../../UserPage/models/types";
import { useMutationCity } from "../../hooks/useMutationCity";
import { Property } from "../../models/types";
import { useLocationStore } from "../../state/useLocationStore";
import { useModalStore } from "../../state/useModalStore";
import { CustomLabel } from "../CustomLabel";
import { MainModal } from "../MainModal";
import { SelectWithMenu } from "../SelectWithMenu";
import { Province } from "../../../ProvincePage/models/types";
import { useMutationProvince } from "../../hooks/useMutationProvince";
import { Municipality } from "../../../MunicipalityPage/models/types";
import { createSelectableStore } from "../../state/useSelectablesStore";
import { SelectUser } from "../SelectUser";
export type PropertyFormProps = {
  property?: Property;
};

const GET_QUERY = `
	query GetFields($legal: String, $technical: String) {
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
		tecnicians: getUsers(type: "tecnico", filterText: $technical) {
			names
			username
			firstLastName
			secondLastName
		}
		legal: getUsers(type: "juridico", filterText: $legal) {
			names
			username
			firstLastName
			secondLastName
		}
	}
`;

// const formLayout: Layout[] = [
//   {
//     tag: 'row',
//     children: <div>Esto es la primera fila</div>,
//     layouts: [
//       {
//         tag: 'col',
//         children: <div>Esto es la primera columna</div>
//       },
//       {
//         tag: 'col',
//         children: <div>Esto es la segunda columna</div>
//       }
//     ]
//   },
// ]

// const renderLayout = (layout: Layout): JSX.Element => {
//   if (layout.tag === 'col') {
//     return <Col>{layout.children}</Col>;
//   }

//   if (layout.tag === 'row') {
//     return (
//       <Row>
//         {layout.layouts?.map((subLayout, index) => (
//           <React.Fragment key={index}>{renderLayout(subLayout)}</React.Fragment>
//         ))}
//       </Row>
//     );
//   }

//   return <></>; // Manejar otros casos si es necesario
// };

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

type Layout = {
  tag: string;
  layouts?: Layout[];
  children?: React.ReactNode;
};

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
const useTypeStore = createSelectableStore<Type>();
const useStateStore = createSelectableStore<State>();
const useSubdirectoryStore = createSelectableStore<SubDirectory>();
const useActivityStore = createSelectableStore<Activity>();
const useResponsibleUnitStore = createSelectableStore<ResponsibleUnit>();
const useClasificationStore = createSelectableStore<Clasification>();
const useReferenceStore = createSelectableStore<Reference>();
const useGroupedStateStore = createSelectableStore<GroupedState>();
const PropertyForm: React.FC<PropertyFormProps> = ({ property }) => {
  const { handleSubmit, register, ...methods } = useForm<Property>({
    defaultValues: property,
  });

  const {
    cities,
    setCities,
    provinces,
    setProvinces,
    setMunicipalities,
    municipalities,
  } = useLocationStore();
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
  useCustomQuery<{ cities: Pick<City, "name">[] }>(
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

  const { deleteCityMutation } = useMutationCity();
  const { deleteProvinceMutation } = useMutationProvince();
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

  const {
    setShowCityCreateModal,
    setShowCityUpdateModal,
    setShowProvinceCreateModal,
    setShowProvinceUpdateModal,
  } = useModalStore();
  const submit = (data: Property) => {
    console.log(data);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container fluid>
      <FormProvider
        {...methods}
        handleSubmit={handleSubmit}
        register={register}
      >
        <MainModal />
        <Form onSubmit={handleSubmit(submit)}>
          <Row>
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
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Departamento"
                      icon={<GlobeAmericas color="orange" />}
                    />
                    <SelectWithMenu
                      name="city.name"
                      placeholder="Departamento"
                      options={cities.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      fieldsForReset={["province.name", "municipality.name"]}
                      size="sm"
                      onClickCreate={() => setShowCityCreateModal(true)}
                      onClickEdit={() => setShowCityUpdateModal(true)}
                      onClickDelete={() => {
                        const city = methods.getValues("city");
                        if (city) {
                          deleteCityMutation(city);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Provincia"
                      icon={<Map color="blue" />}
                    />
                    <SelectWithMenu
                      name="province.name"
                      placeholder="Provincia"
                      options={provinces.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      fieldsForReset={["municipality.name"]}
                      size="sm"
                      disabled={!city}
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Municipio"
                      icon={<GeoAlt color="purple" />}
                    />
                    <SelectWithMenu
                      name="municipality.name"
                      placeholder="Municipio"
                      options={municipalities.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      size="sm"
                      disabled={!province}
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
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
                    <SelectWithMenu
                      name="state.name"
                      placeholder="Estado"
                      options={states.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      size="sm"
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <CustomLabel
                      label="Subcarpeta"
                      icon={<Folder color="orange" />}
                    />
                    <SelectWithMenu
                      name="subDirectory.name"
                      placeholder="Subcarpeta"
                      options={subdirectories.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      size="sm"
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <CustomLabel
                      label="Unidad responsable"
                      icon={<People color="#40d781" />}
                    />
                    <SelectWithMenu
                      name="responsibleUnit.name"
                      placeholder="Unidad responsable"
                      options={responsibleUnits.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      size="sm"
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
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
                    <SelectWithMenu
                      name="type.name"
                      placeholder="Tipo de predio"
                      options={types.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      size="sm"
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Actividad"
                      icon={<ActivityIcon color="red" />}
                    />
                    <SelectWithMenu
                      name="activity.name"
                      placeholder="Actividad"
                      options={activities.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      size="sm"
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Clasificación"
                      icon={<Diagram3 color="green" />}
                    />
                    <SelectWithMenu
                      name="clasification.name"
                      placeholder="Clasificación"
                      options={clasifications.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                      size="sm"
                      onClickCreate={() => setShowProvinceCreateModal(true)}
                      onClickEdit={() => setShowProvinceUpdateModal(true)}
                      onClickDelete={() => {
                        const province = methods.getValues("province");
                        if (province) {
                          deleteProvinceMutation(province);
                        }
                      }}
                    />
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
            <Col className="d-flex flex-column gap-2" xs={3}>
              <Row>
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
              <Row>
                <Form.Group>
                  <CustomLabel
                    label="Estado agrupado"
                    icon={<Box2 color="#864e16" />}
                  ></CustomLabel>
                  <SelectWithMenu
                    name="groupedState.name"
                    placeholder="Estado agrupado"
                    options={groupedStates.map(({ name }) => ({
                      label: name,
                      value: name,
                    }))}
                    size="sm"
                    onClickCreate={() => setShowProvinceCreateModal(true)}
                    onClickEdit={() => setShowProvinceUpdateModal(true)}
                    onClickDelete={() => {
                      const province = methods.getValues("province");
                      if (province) {
                        deleteProvinceMutation(province);
                      }
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Juridico"
                      icon={<PersonWorkspace color="green" />}
                    />
                    <SelectUser placeholder="Juridico" type="juridico" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <CustomLabel
                      label="Tecnico"
                      icon={<PersonGear color="brown" />}
                    />
                    <SelectUser placeholder="Tecnico" type="tecnico" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Group>
                  <CustomLabel
                    label="Referencia"
                    icon={<Link45deg color="#7d7907" />}
                  />
                  <SelectWithMenu
                    name="reference.name"
                    placeholder="Referencia"
                    options={references.map(({ name }) => ({
                      label: name,
                      value: name,
                    }))}
                    size="sm"
                    onClickCreate={() => setShowProvinceCreateModal(true)}
                    onClickEdit={() => setShowProvinceUpdateModal(true)}
                    onClickDelete={() => {
                      const province = methods.getValues("province");
                      if (province) {
                        deleteProvinceMutation(province);
                      }
                    }}
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="submit" className="float-end mt-3">
                Crear predio
              </Button>
            </Col>
          </Row>
        </Form>
      </FormProvider>
      {/* formLayout.map((layout, index) => <React.Fragment key={index}>{renderLayout(layout)}</React.Fragment>) */}
    </Container>
  );
};

export default PropertyForm;
