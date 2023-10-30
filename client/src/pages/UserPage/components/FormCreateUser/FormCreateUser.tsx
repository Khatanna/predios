import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
  FormSelectProps,
} from "react-bootstrap";
import { CheckCircle, ExclamationTriangle } from "react-bootstrap-icons";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import { Error } from "../../../LoginPage/styled-components/Error";
import { User, UserInput, UserType } from "../../models/types";
import { useFetchCreateUserType, useFetchCreateUser } from "../../hooks";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { mutationMessages, status } from "../../../../utilities/constants";
import { useCustomMutation } from "../../../../hooks";
import { Icon } from "../../../../components/Icon";
import { EnhancedSelect } from "../../../PropertyPage/components/EnhancedSelect";

export interface FormCreateUserProps {
  user?: User;
}

const schema = yup.object({
  names: yup.string().required("El nombre es un campo obligatorio"),
  username: yup
    .string()
    .required("El nombre de usuario es un campo obligatorio"),
  firstLastName: yup
    .string()
    .required("El apellido paterno del usuario es un campo obligatorio"),
  secondLastName: yup
    .string()
    .required("El apellido paterno del usuario es un campo obligatorio"),
  password: yup
    .string()
    .required("La contraseña es un campo obligatorio")
    .min(8, "La contraseña debe tener almenos 8 caracteres")
    .max(32, "La contraseña no debe tener mas de 32 caracteres"),
  type: yup
    .object({
      name: yup.string().required("el nombre del tipo es un campo requerido"),
    })
    .required("El tipo es un campo requerdio"),
  status: yup.string().required("El usuario debe tener un estado"),
});

const GET_ALL_USER_TYPES_QUERY = `{
  userTypes: getAllUserTypes {
    id
    name
  }
}`;
const UDPATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserByUsernameInput) {
    result: updateUserByUsername(input: $input) {
      updated,
      user {
        names
        firstLastName
        secondLastName
        username
        status
        typeId
      }
    }
  }
`;

const SelectUserType: React.FC<FormSelectProps> = (props) => {
  const { data, error, isLoading } = useCustomQuery<{ userTypes: UserType[] }>(
    GET_ALL_USER_TYPES_QUERY,
    ["getAllUserTypes"],
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner variant="danger" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="p-1 py-2 m-0">
        <small>
          <div className="d-flex align-items-center gap-2">
            <ExclamationTriangle size={16} color="red" />
            <div>No tienes permisos para ver los tipos de usuario</div>
          </div>
        </small>
      </Alert>
    );
  }

  return (
    <EnhancedSelect
      placeholder="Tipo de usuario"
      options={data?.userTypes}
      onCreate={() => {}}
    />
  );
};
 
const FormCreateUser: React.FC<FormCreateUserProps> = ({ user }) => {
  // const { createUserType } = useFetchCreateUserType();
  const { createUser } = useFetchCreateUser();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: user,
    resolver: yupResolver<UserInput>(schema),
  });
  const names = watch("names");
  const [updateUser] = useCustomMutation<
    { user: User },
    {
      input: {
        username: string;
        data: UserInput;
      };
    }
  >(UDPATE_USER_MUTATION, {
    onSuccess({ user: { username } }) {
      customSwalSuccess(
        mutationMessages.UPDATE_USER.title,
        mutationMessages.UPDATE_USER.getSuccessMessage(username),
      );
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar actualizar el usuario",
      );
    },
  });

  const handleSetCredentials = () => {
    if (getValues("names").length === 0) {
      customSwalError(
        "Debe llenar correctamente los campos",
        "Error de validacion",
      );
    } else {
      const words = getValues("names").trim().toUpperCase().split(/\s/);
      if (words.length === 2) {
        words.push(" ");
      }
      const [secondLastName, firstLastName, ...names] = words.reverse();

      setValue("names", names.reverse().join(" "));
      setValue("firstLastName", firstLastName, { shouldValidate: true });
      setValue("secondLastName", secondLastName, { shouldValidate: true });
      setValue(
        "username",
        names[0].concat(".", firstLastName).toLocaleLowerCase(),
        { shouldValidate: true },
      );
      setValue("password", "Inra12345", { shouldValidate: true });
    }
  };

  const submit = (data: Omit<User, "id" | "connection" | "createdAt">) => {
    if (user) {
      updateUser({
        input: {
          username: user.username,
          data,
        },
      });
    } else {
      createUser({
        input: data,
      });
    }
    reset();
  };

  return (
    <Row>
      <Col xs={12} sm={11} md={10} lg={9} xl={8}>
        <Form
          className="row g-3 position-absolute top-50 start-50 translate-middle"
          onSubmit={handleSubmit(submit)}
        >
          <Col xs={7}>
            <Form.Group>
              <Form.Label>Nombres</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Nombres"
                  {...register("names")}
                  onKeyDown={(e) => e.key === "Enter" && handleSetCredentials()}
                  autoComplete="off"
                />
                {!user && names?.length > 0 && (
                  <Icon label="Autocompletar">
                    <InputGroup.Text
                      role="button"
                      onClick={handleSetCredentials}
                    >
                      <CheckCircle color="green" />
                    </InputGroup.Text>
                  </Icon>
                )}
              </InputGroup>
              <Error>{errors.names?.message}</Error>
            </Form.Group>
          </Col>
          <Col xs={5}>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Controller
                name="type.name"
                control={control}
                defaultValue={"undefined"}
                render={({ field }) => <SelectUserType {...field} />}
              />
              <Error>{errors.type?.name?.message}</Error>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Apellido paterno</Form.Label>
              <Form.Control
                placeholder="Apellido paterno"
                {...register("firstLastName")}
                autoComplete="off"
              />
              <Error>{errors.firstLastName?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Apellido materno</Form.Label>
              <Form.Control
                placeholder="Apellido materno"
                {...register("secondLastName")}
                autoComplete="off"
              />
              <Error>{errors.secondLastName?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group>
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                placeholder="Nombre de usuario"
                {...register("username")}
                autoComplete="off"
              />
              <Error>{errors.username?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                placeholder="Contraseña"
                {...register("password")}
                autoComplete="off"
              />
              <Error>{errors.password?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group>
              <Form.Label>Estado del usuario</Form.Label>
              <div className="d-flex flex-row justify-content-around border border-1 p-1 rounded-2">
                {Object.entries(status).map(([key, value]) => (
                  <Form.Check
                    {...register("status")}
                    value={key}
                    type="radio"
                    label={value}
                    key={crypto.randomUUID()}
                    id={key}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Button
              className="float-end w-100 text-white"
              type="submit"
              variant="success"
            >
              {user ? "Actualizar" : "Crear"} usuario
            </Button>
          </Col>
        </Form>
      </Col>
    </Row>
  );
};

export default FormCreateUser;
