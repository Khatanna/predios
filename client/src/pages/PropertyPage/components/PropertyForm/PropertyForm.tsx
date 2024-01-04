import { useRef } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  BodyText,
  Compass,
  Database,
  EyeFill,
  Hash,
  Hexagon,
  Icon2Circle,
  PersonGear,
  PersonWorkspace,
} from "react-bootstrap-icons";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Cursor } from "../../../../components/Cursor";
import { useAuth, useCustomMutation } from "../../../../hooks";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import {
  CREATE_PROPERTY_MUTATION,
  UPDATE_PROPERTY_MUTATION,
} from "../../graphQL/types";
import { Property } from "../../models/types";
import { useFormStore } from "../../state/useFormStore";
import { useModalStore } from "../../state/useModalStore";
import { usePaginationStore } from "../../state/usePaginationStore";
import { ActivitySelect } from "../ActivitySelect";
import { BeneficiaryList } from "../BeneficiaryList";
import { ClasificationSelect } from "../ClasificationSelect";
import { CustomInput } from "../CustomInput";
import { CustomLabel } from "../CustomLabel";
import { EditableInput } from "../EditableInput";
import { GroupedStateSelect } from "../GroupedStateSelect";
import { Localization } from "../Localization";
import ModalForm from "../ModalForm/ModalForm";
import { ObservationList } from "../ObservationList";
import { Paginator } from "../Paginator";
import { ReferenceSelect } from "../ReferenceSelect";
import { ResponsibleUnitSelect } from "../ResponsibleUnitSelect";
import { SelectUser } from "../SelectUser";
import { StateSelect } from "../StateSelect";
import { SubdirectorySelect } from "../SubdirectorySelect";
import { TrackingList } from "../TrackingList";
import { TypeSelect } from "../TypeSelect";

const PropertyForm: React.FC<{ newItem: boolean }> = ({ newItem }) => {
  const { role } = useAuth();
  const { propertyForm, setPropertyForm } = useFormStore();
  const { property } = usePaginationStore((s) => {
    if (!newItem) {
      return { ...s, property: undefined };
    }

    return s;
  });
  const colRef = useRef<HTMLDivElement | null>(null);
  const { handleSubmit, register, ...methods } = useForm<Property>({
    values: property ?? propertyForm,
  });

  const [createProperty] = useCustomMutation<
    { property: Property },
    { input: Property }
  >(CREATE_PROPERTY_MUTATION, {
    onSuccess() {
      customSwalSuccess(
        "Predio creado",
        "Se ha creado un nuevo predio correctamente",
      );
      setPropertyForm({ propertyForm: undefined });
    },
    onError(error) {
      customSwalError(error, "Ocurrio un error al intentar crear el predio");
    },
  });

  const [updateProperty] = useCustomMutation<
    { property: Property },
    { input: Property }
  >(UPDATE_PROPERTY_MUTATION, {
    onSuccess() {
      customSwalSuccess(
        "Predio actualizado",
        "Se ha actualizado el predio correctamente",
      );
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar actualizar los datos de este predio",
      );
    },
  });
  const submit = (data: Property) => {
    console.log(data);
    if (!property) {
      createProperty({
        input: data,
      });
    } else {
      console.log("update");
      updateProperty({
        input: data,
      });
    }
  };
  const { setModal, ...modal } = useModalStore();

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
        <Form
          onSubmit={handleSubmit(submit)}
          id="propertyForm"
          className="mb-2"
        >
          <Row>
            <Col>
              <Row className="d-flex flex-row gap-2">
                <Col className="d-flex gap-2 flex-column">
                  <Row className="border border-1 py-2 border-dark-subtle rounded-1 align-items-end position-relative ">
                    {property && <Paginator />}
                    <Col>
                      <Row className="mb-1">
                        <Form.Group>
                          <CustomLabel
                            label="Nombre del predio"
                            icon={<BodyText color="#b3245b" />}
                          />
                          <CustomInput
                            className="fw-bold"
                            as="textarea"
                            name="name"
                            rows={2}
                            placeholder="Nombre del predio"
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Col className="d-flex">
                          <InputGroup size="sm">
                            <InputGroup.Text>
                              <Hexagon color="purple" className="me-1" />
                              <Form.Label column="sm" className="fw-bold">
                                Poligono
                              </Form.Label>
                            </InputGroup.Text>
                            <CustomInput
                              size="sm"
                              name="polygone"
                              placeholder="Poligono"
                              noWrap
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={4}>
                      <Row className="mb-1">
                        <Form.Label column="sm" className="fw-bold">
                          Codigo de busqueda:
                        </Form.Label>
                        <Col>
                          <CustomInput
                            name="codeOfSearch"
                            size="sm"
                            className="text-danger fw-bold"
                            placeholder="Codigo de busqueda"
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1">
                        <Form.Label column="sm" className="fw-bold">
                          Codigo de predio:
                        </Form.Label>
                        <Col>
                          <CustomInput
                            name="code"
                            size="sm"
                            placeholder="Codigo de predio"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Form.Label column="sm" className="fw-bold">
                          ID Agrupación:
                        </Form.Label>
                        <Col>
                          <Form.Group>
                            <CustomInput
                              name="agrupationIdentifier"
                              size="sm"
                              placeholder="ID Agrupación"
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
                                <StateSelect
                                  name="state.name"
                                  readOnly={!!property}
                                />
                              </Col>
                              <Col xs={12}>
                                <Form.Group>
                                  <CustomLabel
                                    label="Datos de superficie"
                                    icon={<Compass color="#3aa0f4" />}
                                  />
                                  <InputGroup size="sm">
                                    <InputGroup.Text className="fw-bold text-primary">
                                      Superficie
                                    </InputGroup.Text>
                                    <CustomInput name="area" size="sm" noWrap />
                                    <InputGroup.Text className="fw-bold">
                                      ha
                                    </InputGroup.Text>
                                    <InputGroup.Text className="fw-bold text-primary">
                                      Superficie de pericia
                                    </InputGroup.Text>
                                    <CustomInput
                                      name="expertiseOfArea"
                                      size="sm"
                                      noWrap
                                    />
                                    <InputGroup.Text className="fw-bold">
                                      ha
                                    </InputGroup.Text>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                              <Col xs={12}>
                                <Form.Group>
                                  <CustomLabel
                                    label="Datos"
                                    icon={<Database color="#dc0e67" />}
                                  />
                                  <InputGroup size="sm">
                                    <InputGroup.Text className="fw-bold text-success">
                                      Parcelas
                                    </InputGroup.Text>
                                    <CustomInput
                                      size="sm"
                                      name="plots"
                                      options={{ valueAsNumber: true }}
                                      type="number"
                                      defaultValue={0}
                                      noWrap
                                    />
                                    <InputGroup.Text className="fw-bold text-success">
                                      Fojas
                                    </InputGroup.Text>
                                    <CustomInput
                                      size="sm"
                                      name="sheets"
                                      options={{ valueAsNumber: true }}
                                      type="number"
                                      defaultValue={0}
                                      noWrap
                                    />
                                    <InputGroup.Text className="fw-bold text-success">
                                      Cuerpos
                                    </InputGroup.Text>
                                    <CustomInput
                                      size="sm"
                                      name="bodies"
                                      options={{ valueAsNumber: true }}
                                      type="number"
                                      defaultValue={0}
                                      noWrap
                                    />
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                              <Col xs={4}>
                                <TypeSelect readOnly={!!property} />
                              </Col>
                              <Col xs={4}>
                                <ClasificationSelect readOnly={!!property} />
                              </Col>
                              <Col xs={4}>
                                <ActivitySelect readOnly={!!property} />
                              </Col>
                              <Col xs={4}>
                                <SubdirectorySelect readOnly={!!property} />
                              </Col>
                              <Col xs={4}>
                                <ResponsibleUnitSelect readOnly={!!property} />
                              </Col>
                              <Col>
                                <CustomLabel
                                  label="Nro. de expediente"
                                  icon={<Hash color="#d44da2" />}
                                />
                                <CustomInput
                                  name="fileNumber.number"
                                  placeholder="Nro de expediente"
                                  size="sm"
                                />
                                {/* <EditableInput
                                  size="sm"
                                  isEdit={!property}
                                  render={({ edit }) => (
                                    <Form.Control
                                      size="sm"
                                      readOnly={!edit}
                                      {...register("fileNumber.number")}
                                      placeholder="Nro de expediente"
                                      autoFocus={edit}
                                    />
                                  )}
                                /> */}
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            xs={4}
                            className="d-flex flex-column gap-2 justify-content-between"
                          >
                            <BeneficiaryList
                              maxHeight={colRef.current?.scrollHeight ?? 0}
                            />
                          </Col>
                        </Row>
                      </Tab>
                      <Tab eventKey={"seguimiento"} title="Seguimiento">
                        <TrackingList />
                      </Tab>
                      <Tab eventKey={"observaciones"} title="Observaciones">
                        <ObservationList />
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
                        <CustomInput
                          name="secondState"
                          size="sm"
                          placeholder="Estado 2"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <GroupedStateSelect readOnly={!!property} />
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
                      <ReferenceSelect readOnly={!!property} />
                    </Col>
                    <Col xs={12}>
                      <CustomLabel
                        label="Observación tecnica"
                        icon={<EyeFill color="#bada2d" />}
                      />
                      <CustomInput
                        name="technicalObservation"
                        placeholder="Observación tecnica"
                        as="textarea"
                        rows={5}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {role === "administrador" && (
                <Row className="my-2">
                  <Col className="d-flex justify-content-end gap-2">
                    {!property && (
                      <>
                        {/* <Button
                          variant="primary"
                          onClick={() => {
                            methods.reset(undefined);
                            if (property) {
                              location.reload();
                              setPropertyForm({ propertyForm: undefined });
                            }
                          }}
                        >
                          Limpiar
                        </Button> */}
                        {/* <Button
                          variant="success"
                          onClick={() => {
                            setPropertyForm({
                              propertyForm: methods.getValues(),
                            });
                          }}
                        >
                          Guardar
                        </Button> */}
                      </>
                    )}
                    <Button type="submit" variant="warning">
                      {property ? "Actualizar" : "Crear"} predio
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Form>
        {/* {methods.getValues("id") && <Cursor />} */}
      </FormProvider>
    </Container>
  );
};

export default PropertyForm;
