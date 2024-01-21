import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Municipality } from "../../../MunicipalityPage/models/types";
import { useModalStore } from "../../../../state/useModalStore";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { SelectNameable } from "../../../../components/SelectNameable";
import {
  GET_ALL_CITIES_QUERY,
  GET_ALL_PROVINCES_BY_CITY_NAME,
  GET_MUNICIPALITIES_BY_PROVINCE_NAME,
  cityMutations,
  provinceMutations,
} from "../Localization/Localization";
import { toast } from "sonner";

type MunicipalityInput = Pick<Municipality, "name" | "province">;

const GET_MUNICIPALITY_QUERY = gql`
  query GetMunicipality($name: String) {
    municipality: getMunicipality(name: $name) {
      name
      province {
        name
        city {
          name
        }
      }
    }
  }
`;

const CREATE_MUNICIPALITY_MUTATION = gql`
  mutation CreateMunicipality($input: MunicipalityInput) {
    municipality: createMunicipality(input: $input) {
      name
    }
  }
`;

const UPDATE_MUNICIPALITY_MUTATION = gql`
  mutation UpdateMunicipality($name: String, $input: MunicipalityInput) {
    municipality: updateMunicipality(name: $name, input: $input) {
      name
    }
  }
`;

const MunicipalityFormCreate: React.FC = () => {
  const [getMunicipality] = useLazyQuery<
    { municipality: Municipality },
    { name: string }
  >(GET_MUNICIPALITY_QUERY);
  const { closeModal, value } = useModalStore();
  const { register, handleSubmit, getFieldState, control, watch } =
    useForm<MunicipalityInput>({
      defaultValues: value
        ? () =>
            getMunicipality({ variables: { name: value } }).then(
              ({ data }) => data!.municipality,
            )
        : undefined,
    });

  const province = watch("province.name");
  const city = watch("province.city.name");
  const [createMutation] = useMutation<
    { municipality: Municipality },
    { input: MunicipalityInput }
  >(CREATE_MUNICIPALITY_MUTATION, {
    refetchQueries: [
      { query: GET_ALL_PROVINCES_BY_CITY_NAME, variables: { city } },
      {
        query: GET_MUNICIPALITIES_BY_PROVINCE_NAME,
        variables: { province },
      },
    ],
  });
  const [updateMutation] = useMutation<
    { municipality: Municipality },
    { name: string; input: MunicipalityInput }
  >(UPDATE_MUNICIPALITY_MUTATION, {
    refetchQueries: [
      { query: GET_ALL_PROVINCES_BY_CITY_NAME, variables: { city } },
      {
        query: GET_MUNICIPALITIES_BY_PROVINCE_NAME,
        variables: { province },
      },
      {
        query: GET_MUNICIPALITY_QUERY,
        variables: { name: value },
      },
    ],
  });
  const submit: SubmitHandler<MunicipalityInput> = (data) => {
    if (!value) {
      toast.promise(
        createMutation({
          variables: {
            input: data,
          },
        }),
        {
          loading: "Creando municipio",
          success: "Se ha creado un municipio",
          error: (e) => e?.message ?? "Ocurrio un error, intentelo más tarde",
          finally: closeModal,
        },
      );
    } else {
      toast.promise(
        updateMutation({
          variables: {
            name: value,
            input: data,
          },
        }),
        {
          loading: "Actualizando municipio",
          success: "Se ha actualizado un municipio",
          error: (e) => e?.message ?? "Ocurrio un error, intentelo más tarde",
          finally: closeModal,
        },
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Modal.Body>
        <Row className="">
          <Col xs={6}>
            <Form.Label>Departamento</Form.Label>
            <Controller
              name="province.city.name"
              control={control}
              rules={{
                required: {
                  message: "Este campo es obligatorio",
                  value: true,
                },
                pattern: {
                  message: "Este campo es obligatorio",
                  value: /^(?!undefined$).*$/gi,
                },
              }}
              render={({ field }) => (
                <SelectNameable
                  {...field}
                  size="sm"
                  value={city}
                  resource="CITY"
                  mutations={cityMutations}
                  placeholder={"Departamento"}
                  query={GET_ALL_CITIES_QUERY}
                  isValid={
                    getFieldState(field.name).isTouched &&
                    !getFieldState(field.name).error?.message
                  }
                  isInvalid={!!getFieldState(field.name).error?.message}
                  error={
                    <Form.Control.Feedback type="invalid">
                      {getFieldState(field.name).error?.message}
                    </Form.Control.Feedback>
                  }
                  fetchPolicy="no-cache"
                />
              )}
            />
          </Col>
          <Col xs={6}>
            <Form.Label>Provincia</Form.Label>
            <Controller
              name="province.name"
              control={control}
              rules={{
                required: {
                  message: "Este campo es obligatorio",
                  value: true,
                },
                pattern: {
                  message: "Este campo es obligatorio",
                  value: /^(?!undefined$).*$/gi,
                },
              }}
              defaultValue="undefined"
              render={({ field }) => (
                <SelectNameable
                  {...field}
                  size="sm"
                  resource="PROVINCE"
                  placeholder={"Provincia"}
                  query={GET_ALL_PROVINCES_BY_CITY_NAME}
                  disabled={!city}
                  variables={{ city }}
                  mutations={provinceMutations}
                  isValid={
                    getFieldState(field.name).isTouched &&
                    !getFieldState(field.name).error?.message
                  }
                  isInvalid={!!getFieldState(field.name).error?.message}
                  error={
                    <Form.Control.Feedback type="invalid">
                      {getFieldState(field.name).error?.message}
                    </Form.Control.Feedback>
                  }
                  fetchPolicy="no-cache"
                />
              )}
            />
          </Col>
          <Col xs={12}>
            <Form.Label>Municipio</Form.Label>
            <Form.Control
              {...register("name")}
              placeholder="Municipio"
              disabled={
                !city ||
                city === "undefined" ||
                !province ||
                province === "undefined"
              }
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" className="text-white">
          {value ? "Actualizar" : "Crear"} municipio
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default MunicipalityFormCreate;
