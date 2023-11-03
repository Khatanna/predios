import { useRef } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  Activity as ActivityIcon,
  ArrowLeftShort,
  ArrowRightShort,
  BodyText,
  Box2,
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
  Info,
  InfoCircle,
  Link45deg,
  ListColumns,
  People,
  PeopleFill,
  PersonGear,
  PersonWorkspace,
} from "react-bootstrap-icons";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useCustomMutation } from "../../../../hooks";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { GroupedState } from "../../../GroupedState/models/types";
import { Reference } from "../../../ReferencePage/models/types";
import { Tracking } from "../../../TrackingPage/models/types";
import {
  useGroupedStateMutations,
  useGroupedStateStore,
  useReferenceMutations,
  useReferenceStore,
} from "../../hooks/useRepository";
import { Property } from "../../models/types";
import { useModalStore } from "../../state/useModalStore";
import { ActivitySelect } from "../ActivitySelect";
import { ClasificationSelect } from "../ClasificationSelect";
import { CustomLabel } from "../CustomLabel";
import { EnhancedSelect } from "../EnhancedSelect";
import { Localization } from "../Localization";
import ModalForm from "../ModalForm/ModalForm";
import { ResponsibleUnitSelect } from "../ResponsibleUnitSelect";
import { SelectUser } from "../SelectUser";
import { StateSelect } from "../StateSelect";
import { SubdirectorySelect } from "../SubdirectorySelect";
import { TypeSelect } from "../TypeSelect";
import { Tooltip } from "../../../../components/Tooltip";

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
  stateName: string;
  responsibleUsername: string;
} & Pick<Tracking, "numberOfNote" | "observation" | "dateOfInit" | "dateOfEnd">;

type PropertyInput = {
  input: Pick<
    Property,
    | "name"
    | "area"
    | "expertiseOfArea"
    | "plots"
    | "bodies"
    | "sheets"
    | "code"
    | "codeOfSearch"
    | "agrupationIdentifier"
    | "secondState"
    | "polygone"
  > & {
    activityName: string;
    clasificationName: string;
    stateName: string;
    groupedStateName: string;
    cityName: string;
    provinceName: string;
    municipalityName: string;
    folderLocationName: string;
    technicalUsername: string;
    legalUsername: string;
    typeName: string;
    responsibleUnitName: string;
    referenceName: string;
    trackings: TrackingInput[];
  };
};

const PropertyForm: React.FC<PropertyFormProps> = ({ property }) => {
  const colRef = useRef<HTMLDivElement | null>(null);
  const { handleSubmit, register, ...methods } = useForm<Property>({
    defaultValues: property,
  });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "trackings",
  });
  const {
    fields: observations,
    append: appendObservation,
    remove: removeObservation,
  } = useFieldArray({
    control: methods.control,
    name: "observations",
  });

  const { setItems: setReferences, items: references } = useReferenceStore();
  const { setItems: setGroupedStates, items: groupedStates } =
    useGroupedStateStore();
  const [groupedState, reference] = methods.watch([
    "groupedState.name",
    "reference.name",
  ]);

  const { error } = useCustomQuery<ResponseAPI>(
    GET_QUERY,
    ["getFieldsForCreate"],
    {
      onSuccess({ references, groupedStates }) {
        setReferences(references);
        setGroupedStates(groupedStates);
      },
    },
  );
  const [createProperty] = useCustomMutation<
    { property: Property },
    PropertyInput
  >(CREATE_PROPERTY_MUTATION);

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
        folderLocationName: data.folderLocation?.name,
        technicalUsername: data.technical?.user.username,
        legalUsername: data.legal?.user.username,
        typeName: data.type?.name,
        responsibleUnitName: data.responsibleUnit?.name,
        referenceName: data?.reference?.name,
        trackings: data.trackings.map((tracking) => ({
          stateName: tracking.state.name,
          numberOfNote: tracking.numberOfNote,
          observation: tracking.observation,
          responsibleUsername: tracking.responsible?.username,
          dateOfInit: tracking.dateOfInit,
          dateOfEnd: tracking.dateOfEnd,
        })),
      },
    });
  };
  const { setModal, ...modal } = useModalStore();

  const { mutationDelete: mutationGroupedStateDelete } =
    useGroupedStateMutations<{ groupedState: GroupedState }>();
  const { mutationDelete: mutationReferenceDelete } = useReferenceMutations<{
    reference: Reference;
  }>();

  if (error) {
    <div>{error}</div>;
  }

  return (
    <Container fluid>
      <FormProvider
        {...methods}
        handleSubmit={handleSubmit}
        register={register}
      >
        {modal.show && (
          <ModalForm
            centered
            onHide={() =>
              setModal({
                form: undefined,
                show: false,
                params: undefined,
                title: undefined,
              })
            }
            {...modal}
          />
        )}
        {property && (
          <div className="position-fixed bottom-0 text-white m-3 start-0 z-2 d-flex gap-2">
            <div className="bg-success border rounded-circle py-2 px-2">
              <ArrowLeftShort size={24} />
            </div>
            <Tooltip label="Número de registro">
              <div className="bg-success border rounded-circle px-3 py-2 fw-bold">
                {property.registryNumber}
              </div>
            </Tooltip>
            <div className="bg-success border rounded-circle px-2 py-2 fw-bold">
              <ArrowRightShort size={24} />
            </div>
          </div>
        )}
        <Form onSubmit={handleSubmit(submit)} id="propertyForm" as={Row}>
          <Col>
            <Row className="d-flex flex-row gap-2">
              <Col className="d-flex gap-2 flex-column">
                <Row className="border border-1 py-2 border-dark-subtle rounded-1 align-items-end">
                  <Col>
                    <Row className="mb-1">
                      <Form.Group>
                        <CustomLabel
                          label="Nombre del predio"
                          icon={<BodyText color="#b3245b" />}
                        />
                        <Form.Control
                          className="fw-bold"
                          as="textarea"
                          rows={2}
                          readOnly={!!property}
                          placeholder="Nombre del predio"
                          {...register("name")}
                          autoComplete="off"
                        />
                        {/* <InputGroup.Text>
                          <Tooltip label="Observaciones">
                            <EyeFill color="#2d86da" role="button" />
                          </Tooltip>
                        </InputGroup.Text> */}
                      </Form.Group>
                    </Row>
                    <Row>
                      <Col>
                        <InputGroup size="sm">
                          <InputGroup.Text>
                            <Hexagon color="purple" className="me-1" />
                            <Form.Label column="sm">Poligono</Form.Label>
                          </InputGroup.Text>
                          <Form.Control
                            size="sm"
                            placeholder="Poligono"
                            readOnly={!!property}
                            {...register("polygone")}
                            autoComplete="off"
                          />
                          <InputGroup.Text>
                            <Hash color="#d44da2" className="me-1" />
                            <Form.Label column="sm">
                              Nro. de expediente
                            </Form.Label>
                          </InputGroup.Text>
                          <Form.Control
                            size="sm"
                            readOnly={!!property}
                            placeholder="Nro de expediente"
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={4}>
                    <Row className="mb-1">
                      <Form.Label column="sm">Codigo de busqueda:</Form.Label>
                      <Col>
                        <Form.Control
                          {...register("codeOfSearch")}
                          readOnly={!!property}
                          size="sm"
                          className="text-danger fw-bold"
                          placeholder="Codigo de busqueda"
                          autoComplete="off"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Form.Label column="sm">Codigo de predio:</Form.Label>
                      <Col>
                        <Form.Control
                          size="sm"
                          readOnly={!!property}
                          placeholder="Codigo de predio"
                          {...register("code")}
                          autoComplete="off"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Form.Label column="sm">ID Agrupación:</Form.Label>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            readOnly={!!property}
                            {...register("agrupationIdentifier")}
                            size="sm"
                            placeholder="ID Agrupación"
                            autoComplete="off"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                  <Localization readOnly={!!property} />
                </Row>
                <Row>
                  <Tabs
                    defaultActiveKey={"datosDePredio"}
                    variant="pills"
                    className="mb-2"
                  >
                    <Tab eventKey={"datosDePredio"} title="Datos de predio">
                      <Row className="border border-1 py-2 border-dark-subtle rounded-1">
                        <Col xs={8}>
                          <Row className="gy-2" ref={colRef}>
                            <Col xs={12}>
                              <Form.Group>
                                <CustomLabel
                                  label="Datos"
                                  icon={<Database color="#dc0e67" />}
                                />
                                <InputGroup size="sm">
                                  <InputGroup.Text>Parcelas</InputGroup.Text>
                                  <Form.Control
                                    {...register("plots")}
                                    size="sm"
                                    readOnly={!!property}
                                  />
                                  <InputGroup.Text>Fojas</InputGroup.Text>
                                  <Form.Control
                                    {...register("sheets")}
                                    size="sm"
                                    readOnly={!!property}
                                  />
                                  <InputGroup.Text>Cuerpos</InputGroup.Text>
                                  <Form.Control
                                    {...register("bodies")}
                                    size="sm"
                                    readOnly={!!property}
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <Form.Group>
                                <CustomLabel
                                  label="Datos de superficie"
                                  icon={<Compass color="#3aa0f4" />}
                                />
                                <InputGroup size="sm">
                                  <InputGroup.Text>Superficie</InputGroup.Text>
                                  <Form.Control
                                    {...register("area")}
                                    size="sm"
                                    readOnly={!!property}
                                  />
                                  <InputGroup.Text>Pericia</InputGroup.Text>
                                  <Form.Control
                                    {...register("expertiseOfArea")}
                                    size="sm"
                                    readOnly={!!property}
                                  />
                                  <InputGroup.Text className="fw-bold">
                                    [ha]
                                  </InputGroup.Text>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col xs={6}>
                              <Form.Group>
                                <CustomLabel
                                  label="Actividad"
                                  icon={<ActivityIcon color="red" />}
                                />
                                <ActivitySelect readOnly={!!property} />
                              </Form.Group>
                            </Col>
                            <Col xs={6}>
                              <Form.Group>
                                <CustomLabel
                                  label="Clasificación"
                                  icon={<Diagram3 color="green" />}
                                />
                                <ClasificationSelect readOnly={!!property} />
                              </Form.Group>
                            </Col>
                            <Col xs={6}>
                              <Form.Group>
                                <CustomLabel
                                  label="Tipo de predio"
                                  icon={<ListColumns />}
                                />
                                <TypeSelect readOnly={!!property} />
                              </Form.Group>
                            </Col>
                            <Col xs={6}>
                              <Form.Group>
                                <CustomLabel
                                  label="Ubicación de carpeta"
                                  icon={<Folder color="orange" />}
                                />
                                <SubdirectorySelect readOnly={!!property} />
                              </Form.Group>
                            </Col>
                            <Col xs={6}>
                              <Form.Group>
                                <CustomLabel
                                  label="Unidad responsable"
                                  icon={<People color="#40d781" />}
                                />
                                <ResponsibleUnitSelect readOnly={!!property} />
                              </Form.Group>
                            </Col>
                            <Col xs={6}>
                              <Form.Group>
                                <CustomLabel
                                  label="Estado"
                                  icon={<DeviceSsd color="#ff5e00" />}
                                />
                                <StateSelect
                                  name="state.name"
                                  readOnly={!!property}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          xs={4}
                          className="d-flex flex-column gap-2 justify-content-between"
                        >
                          <Row>
                            <Col xs={12}>
                              <CustomLabel
                                label="Beneficiarios"
                                icon={<PeopleFill color="green" />}
                              />
                            </Col>
                            <Col>
                              {property && property.beneficiaries.length ? (
                                <ListGroup
                                  as={"ol"}
                                  numbered
                                  style={{
                                    maxHeight:
                                      (colRef.current?.scrollHeight ?? 0) - 40,
                                  }}
                                  className="overflow-y-scroll pe-2"
                                >
                                  {property.beneficiaries.map((b) => (
                                    <ListGroup.Item key={b.id}>
                                      {b.name}
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              ) : (
                                <Alert
                                  className="d-flex flex-row gap-2"
                                  variant="info"
                                >
                                  <InfoCircle size={24} />
                                  Este predio no tiene beneficiarios
                                </Alert>
                              )}
                            </Col>
                          </Row>
                          <Row className="align-self-end">
                            <Col>
                              <Button size="sm" variant="success">
                                Añadir beneficiario
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab eventKey={"seguimiento"} title="Seguimiento">
                      <Col className="d-flex gap-2 flex-column">
                        {fields.length ? (
                          fields.map((tracking, index) => (
                            <Row
                              className="border border-1 border-dark-subtle py-2 rounded-1 position-relative"
                              key={crypto.randomUUID()}
                            >
                              <Col xs={6}>
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
                                    type="date"
                                    {...register(
                                      `trackings.${index}.dateOfInit`,
                                    )}
                                    size="sm"
                                    placeholder="Fecha de inicio"
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
                                    type="date"
                                    key={crypto.randomUUID()}
                                    placeholder="Fecha de finalización"
                                    {...register(
                                      `trackings.${index}.dateOfEnd`,
                                    )}
                                    size="sm"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={6}>
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
                                        placeholder="Responsable"
                                        type="responsable"
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
                                    {...register(
                                      `trackings.${index}.numberOfNote`,
                                    )}
                                    size="sm"
                                    placeholder="# Nota"
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <CustomLabel
                                    label="Observación"
                                    icon={<Link45deg color="#7d7907" />}
                                  />
                                  <Form.Control
                                    {...register(
                                      `trackings.${index}.observation`,
                                    )}
                                    size="sm"
                                    placeholder="Observación"
                                  />
                                </Form.Group>
                              </Col>
                              <div
                                className={
                                  "position-absolute top-0 left-0 mt-2"
                                }
                              >
                                <Tooltip label="Quitar seguimiento">
                                  <DashCircle
                                    color="red"
                                    className="float-end"
                                    role="button"
                                    onClick={() => remove(index)}
                                  />
                                </Tooltip>
                              </div>
                            </Row>
                          ))
                        ) : (
                          <Row>
                            <Alert
                              className="d-flex flex-row gap-2"
                              variant="info"
                            >
                              <InfoCircle size={24} />
                              Este predio aun no tiene seguimientos
                            </Alert>
                          </Row>
                        )}
                        <Row>
                          <Button
                            size="sm"
                            className="text-white"
                            variant="info"
                            onClick={() =>
                              append({
                                numberOfNote: "",
                                observation: "",
                                state: {
                                  name: "undefined",
                                },
                                dateOfInit: new Date()
                                  .toISOString()
                                  .substring(0, 10),
                              })
                            }
                          >
                            Añadir seguimiento
                          </Button>
                        </Row>
                      </Col>
                    </Tab>
                    <Tab eventKey={"observaciones"} title="Observaciones">
                      <Col className="d-flex gap-2 flex-column">
                        {observations.filter((o) => o.type === "STANDARD")
                          .length ? (
                          <Row className="border border-1 gy-2 py-2">
                            {observations
                              .filter((o) => o.type === "STANDARD")
                              ?.map((observation, index) => (
                                <Col xs={6} key={crypto.randomUUID()}>
                                  {observation.type}

                                  <div className="position-relative">
                                    <Form.Control
                                      as="textarea"
                                      rows={3}
                                      placeholder="Observación..."
                                      {...register(
                                        `observations.${index}.observation`,
                                      )}
                                      autoComplete="off"
                                    />
                                    <div
                                      className={
                                        "position-absolute top-0 end-0 m-2"
                                      }
                                    >
                                      <Tooltip label="Quitar observación">
                                        <DashCircle
                                          color="red"
                                          className="float-end"
                                          role="button"
                                          onClick={() => {
                                            const index =
                                              observations.findIndex(
                                                (o) => o.id === observation.id,
                                              );
                                            removeObservation(index);
                                          }}
                                        />
                                      </Tooltip>
                                    </div>
                                  </div>
                                </Col>
                              ))}
                          </Row>
                        ) : (
                          <Row>
                            <Alert
                              className="d-flex flex-row gap-2"
                              variant="info"
                            >
                              <InfoCircle size={24} />
                              Este predio aun no tiene observaciones
                            </Alert>
                          </Row>
                        )}
                        <Row>
                          <Button
                            size="sm"
                            className="text-white"
                            variant="info"
                            onClick={() =>
                              appendObservation({
                                id: crypto.randomUUID(),
                                observation: "",
                                type: "STANDARD",
                              })
                            }
                          >
                            Añadir observación
                          </Button>
                        </Row>
                      </Col>
                    </Tab>
                  </Tabs>
                </Row>
              </Col>
              <Col xs={3}>
                <Row className="border border-1 py-2 border-dark-subtle rounded-1 gap-2 h-100 align-content-start">
                  <Col xs={12}>
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
                  <Col xs={12}>
                    <Form.Group>
                      <CustomLabel
                        label="Estado agrupado"
                        icon={<Box2 color="#864e16" />}
                      />
                      <Controller
                        name="groupedState.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Estado agrupado"}
                            options={groupedStates.map(({ name }) => ({
                              label: name,
                              value: name,
                            }))}
                            onCreate={() => {
                              setModal({
                                form: "createGroupedState",
                                title: "Crear estado agrupado",
                                show: true,
                              });
                            }}
                            onEdit={() => {
                              setModal({
                                form: "updateGroupedState",
                                title: "Actualizar estado agrupado",
                                show: true,
                                params: { name: groupedState },
                              });
                            }}
                            onDelete={() => {
                              const groupedState =
                                methods.getValues("groupedState");

                              if (groupedState) {
                                mutationGroupedStateDelete(groupedState, {
                                  onSuccess({
                                    data: {
                                      groupedState: { name },
                                    },
                                  }) {
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
                                    methods.resetField("groupedState.name", {
                                      defaultValue: "undefined",
                                    });
                                  },
                                });
                              }
                            }}
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <CustomLabel
                        label="Juridico"
                        icon={<PersonWorkspace color="green" />}
                      />
                      <Controller
                        name="legal.user"
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
                  <Col xs={12}>
                    <Form.Group>
                      <CustomLabel
                        label="Tecnico"
                        icon={<PersonGear color="brown" />}
                      />
                      <Controller
                        name="technical.user"
                        control={methods.control}
                        render={({ field }) => (
                          <SelectUser
                            {...field}
                            type="tecnico"
                            placeholder="Tecnico"
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <CustomLabel
                        label="Referencia"
                        icon={<Link45deg color="#7d7907" />}
                      />
                      <Controller
                        name="reference.name"
                        control={methods.control}
                        defaultValue="undefined"
                        render={({ field }) => (
                          <EnhancedSelect
                            {...field}
                            size="sm"
                            placeholder={"Referencia"}
                            options={references.map(({ name }) => ({
                              label: name,
                              value: name,
                            }))}
                            onCreate={() => {
                              setModal({
                                form: "createReference",
                                title: "Crear referencia",
                                show: true,
                              });
                            }}
                            onEdit={() => {
                              setModal({
                                form: "updateReference",
                                title: "Actualizar referencia",
                                show: true,
                                params: { name: reference },
                              });
                            }}
                            onDelete={() => {
                              const reference = methods.getValues("reference");

                              if (reference) {
                                mutationReferenceDelete(reference, {
                                  onSuccess({
                                    data: {
                                      reference: { name },
                                    },
                                  }) {
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
                                    methods.resetField("reference.name", {
                                      defaultValue: "undefined",
                                    });
                                  },
                                });
                              }
                            }}
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <CustomLabel
                      label="Observación tecnica"
                      icon={<EyeFill color="#bada2d" />}
                    />
                    {observations.filter((o) => o.type === "TECHNICAL")
                      .length ? (
                      observations
                        .filter((o) => o.type === "TECHNICAL")
                        ?.map((observation, index) => (
                          <Row className="mt-1">
                            {observation.type}
                            <Col>
                              <div className="position-relative">
                                <Form.Control
                                  as="textarea"
                                  rows={5}
                                  placeholder="Observación tecnica"
                                  {...register(
                                    `observations.${index}.observation`,
                                  )}
                                  autoComplete="off"
                                />
                                <div
                                  className={
                                    "position-absolute top-0 end-0 m-2"
                                  }
                                >
                                  <Tooltip label="Quitar observación tecnica">
                                    <DashCircle
                                      color="red"
                                      className="float-end"
                                      role="button"
                                      onClick={() => {
                                        const index = observations.findIndex(
                                          (o) => o.id === observation.id,
                                        );
                                        removeObservation(index);
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        ))
                    ) : (
                      <Alert
                        className="d-flex flex-row gap-2 align-items-center"
                        variant="info"
                      >
                        <InfoCircle size={24} />
                        Este predio aun no tiene observaciones tecnicas
                      </Alert>
                    )}
                    <Button
                      size="sm"
                      className="text-white mt-2"
                      variant="info"
                      onClick={() =>
                        appendObservation({
                          id: crypto.randomUUID(),
                          observation: "",
                          type: "TECHNICAL",
                        })
                      }
                    >
                      Añadir observación tecnica
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="my-2">
              <Col className="d-flex justify-content-end">
                <Row className="d-flex flex-column gap-2">
                  <Button type="submit" variant="success" className="float-end">
                    Crear predio
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Form>
      </FormProvider>
    </Container>
  );
};

export default PropertyForm;
