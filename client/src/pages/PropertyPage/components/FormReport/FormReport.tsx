import { gql, useLazyQuery } from "@apollo/client";
import { Button, Col, Form, Spinner } from "react-bootstrap";
import { FiletypeXlsx } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { exportToExcel } from "../../../UserPage/utils/exportToExcel";
import { Property } from "../../models/types";

type TReport = {
  numberOfRecords: number;
  all: boolean;
};

const GET_ALL_PROPERTIES_QUERY_GQL = gql`
  query GetProperties(
    $page: Int
    $limit: Int
    $orderBy: String
    $all: Boolean
  ) {
    results: getProperties(
      page: $page
      limit: $limit
      orderBy: $orderBy
      all: $all
    ) {
      total
      properties {
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
          id
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
      }
    }
  }
`;

const FormReport: React.FC<{ max: number }> = ({ max }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getFieldState,
    watch,
    reset,
  } = useForm<TReport>();
  const [numberOfRecods, all] = watch(["numberOfRecords", "all"]);
  const [getProperties, { loading }] = useLazyQuery<{
    results: { total: number; properties: Property[] };
  }>(GET_ALL_PROPERTIES_QUERY_GQL);

  const submit = ({ all, numberOfRecords }: TReport) => {
    const variables = all
      ? {
          variables: {
            all,
          },
        }
      : {
          variables: {
            page: 1,
            limit: numberOfRecords,
            orderBy: "asc",
          },
        };

    toast.promise(getProperties(variables), {
      loading: "Generando reporte",
      success: ({ data }) => {
        if (data) {
          exportToExcel({ data: data.results.properties });
          return `Se ha generado un reporte de ${data.results.properties.length} registros`;
        }
      },
      error: "Ocurrio un error al intentar generar el reporte",
      finally: () => {
        reset();
      },
      dismissible: false,
    });
  };

  return (
    <Form noValidate onSubmit={handleSubmit(submit)} className="row g-3">
      {!all && (
        <Col>
          <Form.Control
            type="number"
            isValid={
              !all &&
              getFieldState("numberOfRecords").isDirty &&
              !errors.numberOfRecords
            }
            isInvalid={!all && !!errors.numberOfRecords}
            placeholder="Número de registros"
            {...register("numberOfRecords", {
              max: {
                message: `El valor maximo es ${max}`,
                value: max,
              },
              min: {
                message: "Debe tener minimo 1 registro",
                value: 1,
              },
              required: {
                message: "Debe completar este campo",
                value: !all && true,
              },
              valueAsNumber: true,
            })}
          />
          {errors.numberOfRecords && (
            <Form.Control.Feedback type="invalid">
              {errors.numberOfRecords.message}
            </Form.Control.Feedback>
          )}
        </Col>
      )}
      {!numberOfRecods && (
        <Col xs={12}>
          <Form.Check label="Obtener todos" id="all" {...register("all")} />
        </Col>
      )}
      <Col xs={12} className="d-flex justify-content-end">
        <Button
          disabled={loading}
          size="sm"
          type="submit"
          variant={loading ? "primary" : "success"}
          className="d-flex gap-2 align-items-center text-white"
        >
          {!loading ? (
            <>
              <div>Generar reporte</div>
              <FiletypeXlsx />
            </>
          ) : (
            <>
              <div>Generando reporte</div>
              <Spinner size="sm" />
            </>
          )}
        </Button>
      </Col>
    </Form>
  );
};

export default FormReport;
