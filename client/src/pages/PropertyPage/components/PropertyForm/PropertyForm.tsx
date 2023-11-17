import { useRef } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Tab,
  Tabs
} from "react-bootstrap";
import {
  Activity as ActivityIcon,
  BodyText,
  Box2,
  Compass,
  DashCircle,
  Database,
  DeviceSsd,
  Diagram3,
  EyeFill,
  FastForwardFill,
  Folder,
  Hash,
  Hexagon,
  Icon2Circle,
  InfoCircle,
  Link45deg,
  ListColumns,
  People,
  PeopleFill,
  PersonGear,
  PersonWorkspace,
  X
} from "react-bootstrap-icons";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Tooltip } from "../../../../components/Tooltip";
import { useAuth, useCustomMutation } from "../../../../hooks";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { Property } from "../../models/types";
import { useModalStore } from "../../state/useModalStore";
import { usePaginationStore } from "../../state/usePaginationStore";
import { ActivitySelect } from "../ActivitySelect";
import { BeneficiaryList } from "../BeneficiaryList";
import { ClasificationSelect } from "../ClasificationSelect";
import { CustomLabel } from "../CustomLabel";
import { EditableInput } from "../EditableInput";
import { GroupedStateSelect } from "../GroupedStateSelect";
import { Localization } from "../Localization";
import ModalForm from "../ModalForm/ModalForm";
import { ReferenceSelect } from "../ReferenceSelect";
import { ResponsibleUnitSelect } from "../ResponsibleUnitSelect";
import { SelectUser } from "../SelectUser";
import { StateSelect } from "../StateSelect";
import { SubdirectorySelect } from "../SubdirectorySelect";
import { TypeSelect } from "../TypeSelect";
import { useFormStore } from "../../state/useFormStore";
import { TrackingList } from "../TrackingList";

const GET_PROPERTY_QUERY = `
query GetPropertyPaginate($nextCursor: String, $prevCursor: String) {
    result: getProperty(nextCursor: $nextCursor, prevCursor: $prevCursor){
      nextCursor
      prevCursor
      property {
        id
        name
        registryNumber
        code
        codeOfSearch
        plots
        bodies
        sheets
        area
        polygone
        expertiseOfArea
        secondState
        agrupationIdentifier
        technicalObservation
        technical {
          user {
            names
            firstLastName
            secondLastName
            username
          }
        }
        legal {
          user {
            names
            firstLastName
            secondLastName
            username
          }
        }
        fileNumber {
          number
        }		
        groupedState {
          name
        }
        beneficiaries {
          name
        }
        city {
          name
        }
        province {
          name
        }
        municipality {
          name
        }
        type {
          name
        }
        activity {
          name
        }
        clasification {
          name
        }
        observations {
          observation
        }
        reference {
          name
        }
        responsibleUnit {
          name
        }
        folderLocation {
          name
        }
        state {
          name
        }
        trackings {
          observation
          numberOfNote
          dateOfEnd
          state {
            name
          }
          responsible {
            names
            firstLastName
            secondLastName
            username
          }
        }
      }
    }
  } 
`
const CREATE_PROPERTY_MUTATION = `
  mutation CreateProperty($input: PropertyInput) {
    property: createProperty(input: $input) {
      name
    }
  }
`;

const UPDATE_PROPERTY_MUTATION = `
  mutation UpdateProperty($id: String, $input: PropertyInput) {
    property: updateProperty(id: $id, input: $input) {
      name
    }
  }
`;

const PropertyForm: React.FC<{ newItem: boolean }> = ({ newItem }) => {
  const { role } = useAuth();
  const { propertyForm, setPropertyForm } = useFormStore();
  const { property, nextCursor, prevCursor, setState } = usePaginationStore(s => {
    if (!newItem) {
      return { ...s, property: undefined }
    }

    return s;
  });
  const colRef = useRef<HTMLDivElement | null>(null);
  const { handleSubmit, register, ...methods } = useForm<Property>({
    values: property ?? propertyForm,
    // defaultValues: propertyForm
  });
  const { fields, append, remove, update } = useFieldArray({
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
  const {
    fields: beneficiaries,
    append: appendBeneficiary,
    remove: removeBeneficiary,
    update: updateBeneficiaries,
  } = useFieldArray({
    control: methods.control,
    name: 'beneficiaries',
  })

  const [createProperty] = useCustomMutation<
    { property: Property },
    { input: Property }
  >(CREATE_PROPERTY_MUTATION, {
    onSuccess() {
      customSwalSuccess('Predio creado', 'Se ha creado un nuevo predio correctamente')
      setPropertyForm({ propertyForm: undefined })
    },
    onError(error) {
      customSwalError(error, 'Ocurrio un error al intentar crear el predio')
      // methods.reset();
    },
  });

  const [updateProperty] = useCustomMutation<
    { property: Property },
    { input: Property }
  >(UPDATE_PROPERTY_MUTATION, {
  })
  const submit = (data: Property) => {
    console.log(data);
    if (!property) {
      createProperty({
        input: data
      });
    } else {
      console.log("update");
      updateProperty({
        input: data,
      });
    }
  };
  const { setModal, ...modal } = useModalStore();

  const { refetch: fetchNext } = useCustomQuery<{ result: { nextCursor?: string, prevCursor?: string, property: Property } }>(GET_PROPERTY_QUERY, ['getPropertyPaginateNext', { nextCursor, prevCursor: undefined }], {
    onSuccess({ result }) {
      setState(result)
    },
    enabled: false,
  })
  const { refetch: fetchPrev } = useCustomQuery<{ result: { nextCursor?: string, prevCursor?: string, property: Property } }>(GET_PROPERTY_QUERY, ['getPropertyPaginatePrev', { nextCursor: undefined, prevCursor }], {
    onSuccess({ result }) {
      setState(result)
    },
    enabled: false
  })

  // useEffect(() => {
  //   let interval: NodeJS.Timer;
  //   if (!property) {
  //     interval = setInterval(() => {

  //     }, 7000)
  //   }
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   }
  // }, [])

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
        <Form onSubmit={handleSubmit(submit)} id="propertyForm" className="mb-2">
          <Row>
            <Col>
              <Row className="d-flex flex-row gap-2">
                <Col className="d-flex gap-2 flex-column">
                  <Row className="border border-1 py-2 border-dark-subtle rounded-1 align-items-end position-relative ">
                    {property && (
                      <div className="position-absolute top-0 end-0 d-flex gap-2 justify-content-end align-items-center mt-1">
                        <Tooltip label="Anterior">
                          <FastForwardFill color="orange" size={24} style={{ rotate: '-180deg' }} onClick={() => fetchPrev()} />
                        </Tooltip>
                        <Tooltip label="Número de registro">
                          <Badge className="fw-bold mx-2 fs-6">
                            {property.registryNumber}
                          </Badge>
                        </Tooltip>
                        <Tooltip label="Siguiente">
                          <FastForwardFill color="orange" size={24} onClick={() => fetchNext()} />
                        </Tooltip>
                      </div>
                    )}
                    <Col>
                      <Row className="mb-1">
                        <Form.Group>
                          <CustomLabel
                            label="Nombre del predio"
                            icon={<BodyText color="#b3245b" />}
                          />
                          <EditableInput
                            isEdit={!property}
                            render={({ edit }) => (
                              <Form.Control
                                className="fw-bold"
                                as="textarea"
                                rows={2}
                                readOnly={!edit}
                                placeholder="Nombre del predio"
                                autoFocus={edit}
                                {...register("name")}
                                autoComplete="off"
                              />
                            )}
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Col className="d-flex ">
                          <EditableInput
                            size="sm"
                            isEdit={!property}
                            render={({ edit }) => (
                              <>
                                <InputGroup.Text>
                                  <Hexagon color="purple" className="me-1" />
                                  <Form.Label column="sm" className="fw-bold">Poligono</Form.Label>
                                </InputGroup.Text>
                                <Form.Control
                                  size="sm"
                                  placeholder="Poligono"
                                  readOnly={!edit}
                                  {...register("polygone")}
                                  autoComplete="off" />
                              </>
                            )}
                          />
                          <EditableInput
                            size="sm"
                            isEdit={!property}
                            render={({ edit }) => (
                              <>
                                <InputGroup.Text>
                                  <Hash color="#d44da2" className="me-1" />
                                  <Form.Label column="sm" className="fw-bold">
                                    Nro. de expediente
                                  </Form.Label>
                                </InputGroup.Text>
                                <Form.Control
                                  size="sm"
                                  readOnly={!edit}
                                  {...register('fileNumber.number')}
                                  placeholder="Nro de expediente"
                                  autoFocus={edit}
                                />
                              </>
                            )}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={4}>
                      <Row className="mb-1">
                        <Form.Label column="sm" className="fw-bold">Codigo de busqueda:</Form.Label>
                        <Col>
                          <EditableInput
                            isEdit={!property}
                            render={({ edit }) => (
                              <Form.Control
                                {...register("codeOfSearch")}
                                readOnly={!edit}
                                size="sm"
                                autoFocus={edit}
                                className="text-danger fw-bold"
                                placeholder="Codigo de busqueda"
                                autoComplete="off"
                              />
                            )}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1">
                        <Form.Label column="sm" className="fw-bold">Codigo de predio:</Form.Label>
                        <Col>
                          <EditableInput
                            isEdit={!property}
                            render={({ edit }) => (
                              <Form.Control
                                readOnly={!edit}
                                placeholder="Codigo de predio"
                                {...register("code")}
                                autoComplete="off"
                                autoFocus={edit}
                                size="sm"
                              />
                            )}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Form.Label column="sm" className="fw-bold">ID Agrupación:</Form.Label>
                        <Col>
                          <Form.Group>
                            <EditableInput
                              isEdit={!property}
                              render={({ edit }) => (
                                <Form.Control
                                  readOnly={!edit}
                                  {...register("agrupationIdentifier")}
                                  size="sm"
                                  placeholder="ID Agrupación"
                                  autoComplete="off"
                                  autoFocus={edit}
                                />
                              )}
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
                                    label="Datos de superficie"
                                    icon={<Compass color="#3aa0f4" />}
                                  />
                                  <div className="d-flex">
                                    <EditableInput
                                      isEdit={!property}
                                      size="sm"
                                      render={({ edit }) => (
                                        <>
                                          <InputGroup.Text className="fw-bold text-primary">Superficie</InputGroup.Text>
                                          <Form.Control
                                            {...register("area")}
                                            size="sm"
                                            readOnly={!edit}
                                            autoFocus={edit}
                                          />
                                          <InputGroup.Text className="fw-bold">
                                            ha
                                          </InputGroup.Text>
                                        </>
                                      )}
                                    />
                                    <EditableInput
                                      isEdit={!property}
                                      size="sm"
                                      render={({ edit }) => (
                                        <>
                                          <InputGroup.Text className="fw-bold text-primary">Superficie de pericia</InputGroup.Text>
                                          <Form.Control
                                            {...register("expertiseOfArea")}
                                            size="sm"
                                            readOnly={!edit}
                                            autoFocus={edit}
                                          />
                                          <InputGroup.Text className="fw-bold">
                                            ha
                                          </InputGroup.Text>
                                        </>
                                      )}
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col xs={12}>
                                <Form.Group>
                                  <CustomLabel
                                    label="Datos"
                                    icon={<Database color="#dc0e67" />}
                                  />
                                  <div className="d-flex">
                                    <EditableInput
                                      size="sm"
                                      isEdit={!property}
                                      render={({ edit }) => (
                                        <>
                                          <InputGroup.Text className="fw-bold text-success">Parcelas</InputGroup.Text>
                                          <Form.Control
                                            {...register("plots", { valueAsNumber: true })}
                                            type="number"
                                            defaultValue={0}
                                            size="sm"
                                            readOnly={!edit}
                                            autoFocus={edit}
                                          />
                                        </>
                                      )}
                                    />
                                    <EditableInput
                                      size="sm"
                                      isEdit={!property}
                                      render={({ edit }) => (
                                        <>
                                          <InputGroup.Text className="fw-bold text-success">Fojas</InputGroup.Text>
                                          <Form.Control
                                            {...register("sheets", { valueAsNumber: true })}
                                            type="number"
                                            defaultValue={0}
                                            size="sm"
                                            readOnly={!edit}
                                            autoFocus={edit}
                                          />
                                        </>
                                      )}
                                    />
                                    <EditableInput
                                      size="sm"
                                      isEdit={!property}
                                      render={({ edit }) => (
                                        <>
                                          <InputGroup.Text className="fw-bold text-success">Cuerpos</InputGroup.Text>
                                          <Form.Control
                                            {...register("bodies", { valueAsNumber: true })}
                                            type="number"
                                            defaultValue={0}
                                            size="sm"
                                            readOnly={!edit}
                                            autoFocus={edit}
                                          />
                                        </>
                                      )}
                                    />
                                  </div>
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
                              <Col xs={4}>
                                <Form.Group>
                                  <CustomLabel
                                    label="Actividad"
                                    icon={<ActivityIcon color="red" />}
                                  />
                                  <ActivitySelect readOnly={!!property} />
                                </Form.Group>
                              </Col>
                              <Col xs={8}>
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
                                {beneficiaries.length ? (
                                  <BeneficiaryList
                                    maxHeight={colRef.current?.scrollHeight ?? 0}
                                    beneficiaries={beneficiaries}
                                    remove={removeBeneficiary}
                                    update={updateBeneficiaries}
                                  />
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
                            {role === 'Administrador' && <Row className="align-self-end">
                              <Col>
                                <Button className="text-white" size="sm" variant="success" onClick={() => {
                                  appendBeneficiary({
                                    name: ''
                                  })
                                }}
                                  disabled={beneficiaries.some(b => b.name.length === 0)}
                                >
                                  Añadir beneficiario
                                </Button>
                              </Col>
                            </Row>}
                          </Col>
                        </Row>
                      </Tab>
                      <Tab eventKey={"seguimiento"} title="Seguimiento">
                        <Col className="">
                          {fields.length ? (
                            <TrackingList trackings={fields} remove={remove} update={update} />
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
                          {role === 'Administrador' && <Row>
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
                          </Row>}
                        </Col>
                      </Tab>
                      <Tab eventKey={"observaciones"} title="Observaciones">
                        {observations.length ?
                          observations.map((observation, index) => (
                            <Row className="position-relative mb-2">
                              <Form.Control
                                as="textarea"
                                rows={2}

                                placeholder="Observación..."
                                {...register(
                                  `observations.${index}.observation`,
                                )}
                                autoComplete="off"
                              />
                              {role === "Administrador" && <div
                                className={
                                  "position-absolute top-0 end-0 mt-2"
                                }
                              >
                                <Tooltip label="Quitar observación">
                                  <DashCircle
                                    color="red"
                                    className="float-end"
                                    role="button"
                                    onClick={() => {
                                      removeObservation(index);
                                    }}
                                  />
                                </Tooltip>
                              </div>}
                            </Row>
                          )
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
                        {role === 'Administrador' && <Row>
                          <Button
                            size="sm"
                            className="text-white"
                            variant="info"
                            onClick={() =>
                              appendObservation({
                                observation: "",
                              })
                            }
                          >
                            Añadir observación
                          </Button>
                        </Row>}
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
                        <EditableInput
                          isEdit={!property}
                          render={({ edit }) => (
                            <Form.Control
                              {...register("secondState")}
                              size="sm"
                              placeholder="Estado 2"
                              autoComplete="off"
                              autoFocus={edit}
                            />
                          )}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <CustomLabel
                          label="Estado agrupado"
                          icon={<Box2 color="#864e16" />}
                        />
                        <GroupedStateSelect readOnly={!!property} />
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
                        <ReferenceSelect readOnly={!!property} />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <CustomLabel
                        label="Observación tecnica"
                        icon={<EyeFill color="#bada2d" />}
                      />
                      <EditableInput
                        isEdit={!property}
                        render={({ edit }) => (
                          <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Observación tecnica"
                            {...register("technicalObservation")}
                            readOnly={!edit}
                            autoComplete="off"
                            autoFocus={edit}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {role === 'Administrador' && <Row className="my-2">
                <Col className="d-flex justify-content-end gap-2">
                  {!property && <>
                    <Button variant="primary" onClick={() => {
                      methods.reset(undefined)
                      setPropertyForm({ propertyForm: undefined });
                      remove()
                      removeBeneficiary()
                      removeObservation()
                    }}>
                      Limpiar
                    </Button>
                    <Button variant="success" onClick={() => {
                      setPropertyForm({ propertyForm: methods.getValues() })
                    }}>
                      Guardar
                    </Button>
                  </>}
                  <Button type="submit" variant="warning" >
                    {property ? 'Actualizar' : 'Crear'} predio
                  </Button>
                </Col>
              </Row>}
            </Col>
          </Row>
        </Form>
      </FormProvider>
    </Container>
  );
};

export default PropertyForm;
