import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Dropdown,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import {
  Check,
  InfoCircle,
  Pencil,
  PeopleFill,
  Trash,
  X,
} from "react-bootstrap-icons";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Tooltip } from "../../../../components/Tooltip";
import { useCustomMutation } from "../../../../hooks";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { Beneficiary } from "../../../BeneficiaryPage/models/types";
// import { DropdownMenu } from "../../../HomePage/HomePage";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { DropdownMenu } from "../../../../components/DropdownMenu";
import { useAuthStore } from "../../../../state/useAuthStore";
import Swal from "sweetalert2";

export type BeneficiaryListProps = {
  maxHeight: number;
};

type BeneficiaryItemProps = {
  beneficiary: Pick<Beneficiary, "name">;
  index: number;
  update: (index: number, beneficiary: Pick<Beneficiary, "name">) => void;
  remove: (indeX: number) => void;
};

const CREATE_BENEFICIARY_MUTATION = `
	mutation CreateBeneficiary($propertyId: String, $input: BeneficiaryInput) {
		beneficiary: createBeneficiary(propertyId: $propertyId, input: $input) {
			name
		}
	}
`;

const DELETE_BENEFICIARY_MUTATION = `
	mutation UpdateBeneficiary($propertyId: String, $input: BeneficiaryInput, $all: Boolean) {
		deleted: deleteBeneficiary(propertyId: $propertyId, input: $input, all: $all) 
	}
`;

const UPDATE_BENEFICIARY_MUTATION = `
	mutation UpdateBeneficiary($name: String, $input: BeneficiaryInput) {
		beneficiary: updateBeneficiary(name: $name, input: $input) {
			name
		}
	}
`;

const BeneficiaryItem: React.FC<BeneficiaryItemProps> = ({
  beneficiary,
  index,
  remove,
  update,
}) => {
  const oldName = beneficiary.name;
  const [edit, setEdit] = useState(false);
  const { register, getValues } = useFormContext<Property>();
  const [createBeneficiary] = useCustomMutation<
    { beneficiary: Beneficiary },
    { propertyId: string; input: Pick<Beneficiary, "name"> }
  >(CREATE_BENEFICIARY_MUTATION, {
    onSuccess(_data, { input: { name } }) {
      customSwalSuccess(
        "Beneficiario agregado correctamente",
        "Se ha creado un beneficiario para este predio",
      );
      update(index, { name });
    },
    onError(error) {
      remove(index);
      customSwalError(
        error,
        "Ocurrio un error al intentar crear el beneficiario",
      );
    },
  });
  const [deleteBeneficiary] = useCustomMutation<
    { deleted: boolean },
    { propertyId: string; input: Pick<Beneficiary, "name">; all: boolean }
  >(DELETE_BENEFICIARY_MUTATION, {
    onSuccess() {
      customSwalSuccess(
        "Beneficiario eliminado correctamente",
        `Se ha eliminado al beneficiario: (${getValues(
          `beneficiaries.${index}.name`,
        )}) de este predio`,
      );
      remove(index);
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar eliminar el beneficiario",
      );
    },
  });
  const [updateBeneficiary] = useCustomMutation<
    { beneficiary: Beneficiary },
    { name: string; input: Pick<Beneficiary, "name"> }
  >(UPDATE_BENEFICIARY_MUTATION, {
    onSuccess({ beneficiary: { name } }) {
      customSwalSuccess(
        "Beneficiario actualizado correctamente",
        `Se ha actualizado al beneficiario: (${name}) de este predio`,
      );
      update(index, { name });
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar actualizar el beneficiario",
      );
    },
  });
  const { can } = useAuthStore();
  const thisCan = can("DELETE@BENEFICIARY") && can("UPDATE@BENEFICIARY");
  if (!edit && beneficiary.name.length > 0) {
    return (
      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <div className="ms-1 me-auto text-wrap">{beneficiary.name}</div>
        {thisCan && (
          <div className="d-flex gap-1">
            <Tooltip label="Editar beneficiario">
              <Badge bg="info" role="button" onClick={() => setEdit(true)}>
                <Pencil />
              </Badge>
            </Tooltip>
            <Tooltip label="Quitar beneficiario">
              <Badge
                bg="danger"
                role="button"
                onClick={() => {
                  if (getValues("id")) {
                    Swal.fire({
                      icon: "question",
                      title: "¿Eliminar beneficiario?",
                      text: `¿Desea eliminar el beneficiario: ${getValues(
                        `beneficiaries.${index}.name`,
                      )}?`,
                      showDenyButton: true,
                      showCancelButton: true,
                      confirmButtonText: "Solo de este predio",
                      denyButtonText: `De todos los predios`,
                      cancelButtonText: "Cancelar",
                      confirmButtonColor: "green",
                      cancelButtonColor: "red",
                      denyButtonColor: "orange",
                    }).then((result) => {
                      if(!result.dismiss) {
                        deleteBeneficiary({
                          propertyId: getValues("id"),
                          input: getValues(`beneficiaries.${index}`),
                          all: result.isDenied,
                        });
                      }
                    });
                  } else {
                    remove(index);
                  }
                }}
              >
                <Trash />
              </Badge>
            </Tooltip>
          </div>
        )}
      </ListGroup.Item>
    );
  }

  return (
    <InputGroup>
      <Form.Control
        {...register(`beneficiaries.${index}.name`)}
        onKeyDown={(e) => {
          const name = getValues(`beneficiaries.${index}.name`);

          if (e.key === "Enter") {
            if (name.length > 0) {
              if (getValues("id")) {
                if (edit) {
                  updateBeneficiary({
                    input: { name },
                    name: oldName,
                  });
                } else {
                  createBeneficiary({
                    propertyId: getValues("id"),
                    input: { name },
                  });
                }
              } else {
                update(index, {
                  name: getValues(`beneficiaries.${index}.name`),
                });
                if (edit) {
                  setEdit(false);
                }
              }
            } else {
              customSwalError(
                "El beneficiario debe tener al menos 1 nombre",
                "Beneficiario sin nombre",
              );
            }
          }
        }}
        autoComplete="off"
        autoFocus
      />
      <InputGroup.Text>
        <DropdownMenu>
          <Dropdown.Item
            onClick={() => {
              if (edit) {
                setEdit(false);
              } else {
                remove(index);
              }
            }}
          >
            <X fontSize={24} color="red"></X>
            Cancelar
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              const name = getValues(`beneficiaries.${index}.name`);

              if (name.length > 0) {
                if (edit) {
                  updateBeneficiary({
                    input: { name },
                    name: oldName,
                  });
                } else if (getValues("id")) {
                  createBeneficiary({
                    propertyId: getValues("id"),
                    input: { name },
                  });
                } else {
                  update(index, {
                    name: getValues(`beneficiaries.${index}.name`),
                  });
                }
              } else {
                customSwalError(
                  "El beneficiario debe tener al menos 1 nombre",
                  "Beneficiario sin nombre",
                );
              }
            }}
          >
            <Check fontSize={24} color="green" />
            Confirmar
          </Dropdown.Item>
        </DropdownMenu>
      </InputGroup.Text>
    </InputGroup>
  );
};

const BeneficiaryList: React.FC<BeneficiaryListProps> = ({ maxHeight }) => {
  const { control, getValues } = useFormContext<Property>();
  const {
    fields: beneficiaries,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "beneficiaries",
  });
  const { can } = useAuthStore();
  return (
    <>
      <Row>
        <Col xs={12}>
          <CustomLabel
            label="Beneficiarios"
            icon={<PeopleFill color="green" />}
          />
        </Col>
        <Col>
          {getValues("beneficiaries")?.length ? (
            <ListGroup
              as={"ol"}
              numbered
              style={{
                maxHeight: maxHeight - 35,
              }}
              className={`${
                beneficiaries.length > 2 ? "overflow-y-scroll" : ""
              }  pe-1`}
            >
              {beneficiaries.map((beneficiary, index) => (
                <BeneficiaryItem
                  beneficiary={beneficiary}
                  index={index}
                  remove={remove}
                  update={update}
                />
              ))}
            </ListGroup>
          ) : (
            <Alert className="d-flex flex-row gap-2" variant="info">
              <InfoCircle size={24} />
              Este predio no tiene beneficiarios
            </Alert>
          )}
        </Col>
      </Row>
      {can("CREATE@BENEFICIARY") && (
        <Row className="align-self-end">
          <Col>
            <Button
              size="sm"
              className="text-white"
              variant={
                beneficiaries.some((b) => b.name.length === 0)
                  ? "danger"
                  : "success"
              }
              onClick={() => {
                append({
                  name: "",
                });
              }}
              disabled={beneficiaries.some((b) => b.name.length === 0)}
            >
              Añadir beneficiario
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BeneficiaryList;
