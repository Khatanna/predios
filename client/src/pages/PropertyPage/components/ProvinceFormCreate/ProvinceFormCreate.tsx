import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Province } from "../../../ProvincePage/models/types";
import { SelectNameable } from "../../../../components/SelectNameable";
import {
  GET_ALL_CITIES_QUERY,
  GET_ALL_PROVINCES_BY_CITY_NAME,
  cityMutations,
} from "../Localization/Localization";
import { useModalStore } from "../../../../state/useModalStore";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";

type ProvinceInput = Pick<Province, "name" | "code" | "city">;

const CREATE_PROVINCE_MUTATION = gql`
  mutation CreateProvince($input: ProvinceInput) {
    province: createProvince(input: $input) {
      name
      city {
        name
      }
    }
  }
`;

const UPDATE_PROVINCE_MUTATION = gql`
  mutation UpdateProvince($name: String, $input: ProvinceInput) {
    province: updateProvince(name: $name, input: $input) {
      name
      city {
        name
      }
    }
  }
`;

const GET_PROVINCE_QUERY = gql`
  query GetProvince($name: String) {
    province: getProvince(name: $name) {
      name
      code
      city {
        name
      }
    }
  }
`;

const ProvinceFormCreate: React.FC = () => {
  const { closeModal, value } = useModalStore();
  const [getProvince, { data }] = useLazyQuery<
    { province: Province },
    { name: string }
  >(GET_PROVINCE_QUERY);
  const currentCity = data?.province.city.name;
  const { register, handleSubmit, control, reset } = useForm<ProvinceInput>({
    defaultValues: value
      ? () =>
          getProvince({ variables: { name: value } }).then(
            ({ data }) => data!.province,
          )
      : undefined,
  });
  const [createMutation] = useMutation<
    { province: Province },
    { input: ProvinceInput }
  >(CREATE_PROVINCE_MUTATION, {
    refetchQueries({ data }) {
      return [
        {
          query: GET_ALL_PROVINCES_BY_CITY_NAME,
          variables: { city: data?.province.city.name },
        },
      ];
    },
  });
  const [updateMutation] = useMutation<
    { province: Province },
    { name: string; input: ProvinceInput }
  >(UPDATE_PROVINCE_MUTATION, {
    refetchQueries({ data }) {
      return [
        {
          query: GET_ALL_PROVINCES_BY_CITY_NAME,
          variables: { city: currentCity },
        },
        {
          query: GET_ALL_PROVINCES_BY_CITY_NAME,
          variables: { city: data?.province.city.name },
        },
        {
          query: GET_PROVINCE_QUERY,
          variables: {
            name: value,
          },
        },
      ];
    },
  });

  const submit: SubmitHandler<ProvinceInput> = (data) => {
    if (!value) {
      toast.promise(
        createMutation({
          variables: {
            input: data,
          },
        }),
        {
          loading: "Creando provincia",
          success: "Se ha creado una nueva provincia",
          error: (e) => e.message,
          finally: reset,
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
          loading: "Actualizando provincia",
          success: "Se ha actualizo la provincia",
          error: (e) => e.message,
          finally: closeModal,
        },
      );
    }
  };
  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Modal.Body>
        <Row>
          <Col>
            <Form.Label>Nombre</Form.Label>
            <Form.Control {...register("name")} placeholder="Provincia" />
          </Col>
          <Col>
            <Form.Label>Codigo</Form.Label>
            <Form.Control {...register("code")} placeholder="Codigo" />
          </Col>
          <Col xs={12}>
            <Form.Label>Departamento</Form.Label>
            <Controller
              name="city.name"
              control={control}
              render={({ field }) => (
                <SelectNameable
                  {...field}
                  resource="CITY"
                  mutations={cityMutations}
                  placeholder={"Departamento"}
                  query={GET_ALL_CITIES_QUERY}
                  fetchPolicy="no-cache"
                />
              )}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" className="text-white">
          {value ? "Actualizar" : "Crear"} provincia
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default ProvinceFormCreate;
