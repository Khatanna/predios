import { gql } from "@apollo/client";
import { Col, Form } from "react-bootstrap";
import { GeoAlt, GlobeAmericas, Map } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";

const GET_ALL_CITIES_QUERY = gql`
  query GetAllCities {
    options: getAllCities {
      name
    }
  }
`;

const GET_ALL_PROVINCES_BY_CITY_NAME = gql`
  query GetProvincesByCityName($city: String) {
    options: getProvinces(city: $city) {
      name
    }
  }
`;

const GET_MUNICIPALITIES_BY_PROVINCE_NAME = gql`
  query GetMunicipalitiesByProvinceName($province: String) {
    options: getMunicipalities(province: $province) {
      name
    }
  }
`;

const cityMutations = {
  create: gql`
    mutation CreateCity($name: String) {
      result: createCity(name: $name) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateCity($currentName: String, $name: String) {
      result: updateCity(currentName: $currentName, name: $name) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteCity($name: String) {
      result: deleteCity(name: $name) {
        name
      }
    }
  `,
};
const provinceMutations = {
  create: gql`
    mutation CreateProvince($input: ProvinceInput) {
      province: createProvince(input: $input) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateProvince($name: String, $item: ProvinceInput) {
      province: updateProvince(name: $name, item: $item) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteProvince($name: String) {
      province: deleteProvince(name: $name) {
        name
      }
    }
  `,
};
const municipalityMutations = {
  create: gql`
    mutation CreateMunicipality($input: MunicipalityInput) {
      municipality: createMunicipality(input: $input) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateMunicipality($name: String, $item: MunicipalityInput) {
      municipality: updateMunicipality(name: $name, item: $item) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteMunicipality($name: String) {
      municipality: deleteMunicipality(name: $name) {
        name
      }
    }
  `,
};

const Localization: React.FC<{ readOnly?: boolean }> = () => {
  const { control, watch, getValues, getFieldState } =
    useFormContext<Property>();
  // const [city, province] = watch(["city.name", "province.name"]);
  const [city, province] = watch(["city.name", "province.name"]);

  return (
    <>
      <Col>
        <Form.Group>
          <CustomLabel
            label="Departamento"
            icon={<GlobeAmericas color="orange" />}
          />
          <Controller
            name="city.name"
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
            defaultValue="La Paz"
            render={({ field }) => (
              <SelectNameable
                {...field}
                resource="CITY"
                size="sm"
                highlight
                placeholder="Departamento"
                query={GET_ALL_CITIES_QUERY}
                mutations={cityMutations}
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
              />
            )}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group>
          <CustomLabel label="Provincia" icon={<Map color="blue" />} />
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
                resource="PROVINCE"
                highlight
                disabled={getValues("city.name") === "undefined"}
                size="sm"
                placeholder={"Provincia"}
                query={GET_ALL_PROVINCES_BY_CITY_NAME}
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
              />
            )}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group>
          <CustomLabel label="Municipio" icon={<GeoAlt color="purple" />} />
          <Controller
            name="municipality.name"
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
                disabled={province === "undefined"}
                resource="MUNICIPALITY"
                query={GET_MUNICIPALITIES_BY_PROVINCE_NAME}
                variables={{ province }}
                mutations={municipalityMutations}
                highlight
                size="sm"
                placeholder="Municipio"
                isValid={
                  getFieldState(field.name).isTouched &&
                  !getFieldState(field.name).error?.message
                }
                isInvalid={
                  province !== "undefined" &&
                  !!getFieldState(field.name).error?.message
                }
                error={
                  <Form.Control.Feedback type="invalid">
                    {getFieldState(field.name).error?.message}
                  </Form.Control.Feedback>
                }
              />
            )}
          />
        </Form.Group>
      </Col>
    </>
  );
};

export default Localization;
