import { gql } from "@apollo/client";
import { Col, Form } from "react-bootstrap";
import { GeoAlt, GlobeAmericas, Map } from "react-bootstrap-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SelectNameable } from "../../../../components/SelectNameable";
import { Property } from "../../models/types";
import { CustomLabel } from "../CustomLabel";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

export const GET_ALL_CITIES_QUERY = gql`
  query GetAllCities {
    options: getAllCities {
      name
    }
  }
`;

export const GET_ALL_PROVINCES_BY_CITY_NAME = gql`
  query GetProvincesByCityName($city: String) {
    options: getProvinces(city: $city) {
      name
    }
  }
`;

export const GET_MUNICIPALITIES_BY_PROVINCE_NAME = gql`
  query GetMunicipalitiesByProvinceName($province: String) {
    options: getMunicipalities(province: $province) {
      name
    }
  }
`;

export const cityMutations = {
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
export const provinceMutations = {
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
  const {
    control,
    watch,
    getValues,
    getFieldState,
    resetField,
    setError,
    clearErrors,
  } = useFormContext<Property>();
  const province = watch("province.name");
  const city = watch("city.name");

  const { subscribe } = useSelectSubscription(getValues("id"));
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
                onChange={(e) => {
                  field.onChange(e);
                  resetField("province.name", {
                    defaultValue: "undefined",
                  });
                  if (getValues("id")) {
                    setError(
                      "province.name",
                      {
                        message: "Debe reasignar una provincia",
                        type: "required",
                      },
                      { shouldFocus: true },
                    );
                  }
                }}
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
                onChange={(e) => {
                  field.onChange(e);
                  resetField("municipality.name", {
                    defaultValue: "undefined",
                  });
                  if (getValues("id")) {
                    setError(
                      "municipality.name",
                      {
                        message: "Debe reasignar un municipio",
                        type: "required",
                      },
                      { shouldFocus: true },
                    );
                    clearErrors(field.name);
                  }
                }}
                resource="PROVINCE"
                highlight
                disabled={getValues("city.name") === "undefined"}
                size="sm"
                placeholder={"Provincia"}
                query={GET_ALL_PROVINCES_BY_CITY_NAME}
                variables={{ city: city ?? "La paz" }}
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
                onChange={(e) => {
                  field.onChange(e);
                  if (getValues("id")) {
                    subscribe(field).onChange(e);
                    if (getFieldState("city.name").isDirty) {
                      subscribe({
                        onChange() {},
                        name: "city.name",
                        onBlur() {},
                        ref: () => {},
                        value: getValues("city.name"),
                      }).onChange({
                        target: {
                          value: getValues("city.name"),
                          name: "city.name",
                        },
                      });
                    }

                    if (getFieldState("province.name").isDirty) {
                      subscribe({
                        onChange() {},
                        name: "province.name",
                        onBlur() {},
                        ref: () => {},
                        value: getValues("province.name"),
                      }).onChange({
                        target: {
                          value: getValues("province.name"),
                          name: "province.name",
                        },
                      });
                    }

                    clearErrors(field.name);
                  }
                }}
                disabled={province === "undefined" || !province}
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
