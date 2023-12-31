import { Col, Form } from "react-bootstrap";
import { useFormContext, Controller } from "react-hook-form";
import {
  useCityMutations,
  useMunicipalityMutations,
  useProvinceMutations,
  useMunicipalityStore,
  useCityStore,
  useProvinceStore,
} from "../../hooks/useRepository";
import { Property } from "../../models/types";
import { City } from "../../../CityPage/models/types";
import { Province } from "../../../ProvincePage/models/types";
import { Municipality } from "../../../MunicipalityPage/models/types";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { CustomLabel } from "../CustomLabel";
import { GeoAlt, GlobeAmericas, Map } from "react-bootstrap-icons";
import {
  customSwalError,
  customSwalSuccess,
} from "../../../../utilities/alerts";
import { useModalStore } from "../../state/useModalStore";
import { SelectNameable } from "../../../HomePage/HomePage";
import { useInputSubscription } from "../../hooks/useInputSubscription";

const GET_ALL_CITIES_QUERY = `
	query GetAllCities {
		cities: getAllCities {
      name
    }
	}
`;

const GET_ALL_PROVINCES_BY_CITY_NAME = `
  query GetProvincesByCityName ($city: String) {
    provinces: getProvinces(city: $city) {
      name
    }
  }
`;

const GET_MUNICIPALITIES_BY_PROVINCE_NAME = `
	query GetMunicipalitiesByProvinceName($province: String) {
		municipalities: getMunicipalities(province: $province) {
			name
		}
	}
`;

const Localization: React.FC<{ readOnly?: boolean }> = () => {
  const { control, resetField, getValues, watch, setValue } =
    useFormContext<Property>();
  const { mutationDelete: mutationCityDelete } = useCityMutations<{
    city: City;
  }>();
  const { mutationDelete: mutationProvinceDelete } = useProvinceMutations<{
    province: Province;
  }>();
  const { mutationDelete: mutationMunicipalityDelete } =
    useMunicipalityMutations<{ municipality: Municipality }>();
  const { setItems: setCities, items: cities } = useCityStore();
  const { setItems: setProvinces, items: provinces } = useProvinceStore();
  const { setItems: setMunicipalities, items: municipalities } =
    useMunicipalityStore();
  const [city, province] = watch(["city.name", "province.name"]);

  useCustomQuery<{ cities: Pick<City, "name">[] }>(
    GET_ALL_CITIES_QUERY,
    ["getAllCities"],
    {
      onSuccess({ cities }) {
        setCities(cities);
      },
    },
  );
  useCustomQuery<{ provinces: Pick<Province, "name">[] }>(
    GET_ALL_PROVINCES_BY_CITY_NAME,
    ["getAllProvincesByCityName", { city }],
    {
      onSuccess({ provinces }) {
        setProvinces(provinces);
      },
      enabled: !!city && city !== "undefined",
    },
  );

  useCustomQuery<{ municipalities: Pick<Municipality, "name">[] }>(
    GET_MUNICIPALITIES_BY_PROVINCE_NAME,
    ["getMunicipalitiesByProvinceName", { province }],
    {
      onSuccess({ municipalities }) {
        setMunicipalities(municipalities);
      },
      enabled: !!province && province !== "undefined",
    },
  );
  const { setModal } = useModalStore();
  const { subscribe: citySuscribe } = useInputSubscription({
    name: "city.name",
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
  });
  const { subscribe: provinceSuscribe } = useInputSubscription({
    name: "province.name",
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
    events: {
      onChange: async () => {
        setValue("municipality.name", "undefined");
      },
    },
  });
  const { subscribe: municipalitySuscribe } = useInputSubscription({
    name: "municipality.name",
    options: {
      pattern: {
        value: /^(?!undefined$).*$/gi,
        message: "Este campo es obligatorio",
      },
    },
  });
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
            defaultValue="La Paz"
            render={({ field }) => (
              <SelectNameable
                {...field}
                {...citySuscribe}
                onChange={(e) => {
                  field.onChange(e);
                  citySuscribe.onChange(e);
                }}
                size="sm"
                highlight
                placeholder="Departamento"
                options={cities.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("province.name", "undefined");
                }}
                onCreate={() => {
                  setModal({
                    form: "createCity",
                    title: "Crear departamento",
                    show: true,
                  });
                }}
                onEdit={() => {
                  setModal({
                    form: "updateCity",
                    title: "Actualizar departamento",
                    show: true,
                    params: { name: getValues("city.name") },
                  });
                }}
                onDelete={() => {
                  const city = getValues("city");
                  if (city) {
                    mutationCityDelete(city, {
                      onSuccess({
                        data: {
                          city: { name },
                        },
                      }) {
                        customSwalSuccess(
                          "Departamento eliminado",
                          `El departamento ${name} se ha eliminado correctamente`,
                        );
                      },
                      onError(error, { name }) {
                        customSwalError(
                          error.response!.data.errors[0].message,
                          `Ocurrio un error al intentar eliminar el departamento ${name}`,
                        );
                      },
                      onSettled() {
                        resetField("city.name", { defaultValue: "undefined" });
                      },
                    });
                  }
                }}
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
            defaultValue="undefined"
            render={({ field }) => (
              <SelectNameable
                {...field}
                {...provinceSuscribe}
                onChange={(e) => {
                  field.onChange(e);
                  provinceSuscribe.onChange(e);
                }}
                highlight
                // onChange={(e) => {
                //   field.onChange(e);
                //   setValue("municipality.name", "undefined");
                // }}
                disabled={city === "undefined"}
                size="sm"
                placeholder={"Provincia"}
                options={provinces.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
                onCreate={() => {
                  setModal({
                    form: "createProvince",
                    title: "Crear provincia",
                    show: true,
                    params: { cityName: getValues("city.name") },
                  });
                }}
                onEdit={() => {
                  setModal({
                    form: "updateProvince",
                    title: "Actualizar provincia",
                    show: true,
                    params: { name: getValues("province.name") },
                  });
                }}
                onDelete={() => {
                  const province = getValues("province");
                  if (province) {
                    mutationProvinceDelete(province, {
                      onSuccess({
                        data: {
                          province: { name },
                        },
                      }) {
                        customSwalSuccess(
                          "Provincia eliminada",
                          `La provincia ${name} se ha eliminado correctamente`,
                        );
                      },
                      onError(error, { name }) {
                        customSwalError(
                          error.response!.data.errors[0].message,
                          `Ocurrio un error al intentar eliminar la provincia ${name}`,
                        );
                      },
                      onSettled() {
                        resetField("province.name", {
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
      <Col>
        <Form.Group>
          <CustomLabel label="Municipio" icon={<GeoAlt color="purple" />} />

          <Controller
            name="municipality.name"
            control={control}
            defaultValue="undefined"
            render={({ field }) => (
              <SelectNameable
                {...field}
                {...municipalitySuscribe}
                onChange={(e) => {
                  field.onChange(e);
                  municipalitySuscribe.onChange(e);
                }}
                // readOnly={readOnly}
                value={
                  municipalities.map((e) => e.name).includes(field.value)
                    ? field.value
                    : "undefined"
                }
                disabled={province === "undefined"}
                highlight
                size="sm"
                placeholder="Municipio"
                options={municipalities.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
                onCreate={() => {
                  setModal({
                    form: "createMunicipality",
                    show: true,
                    title: "Crear municipio",
                    params: { provinceName: getValues("province.name") },
                  });
                }}
                onEdit={() => {
                  setModal({
                    form: "updateMunicipality",
                    show: true,
                    title: "Actualizar municipio",
                    params: { name: getValues("municipality.name") },
                  });
                }}
                onDelete={() => {
                  const municipality = getValues("municipality");
                  if (municipality) {
                    mutationMunicipalityDelete(municipality, {
                      onSuccess({
                        data: {
                          municipality: { name },
                        },
                      }) {
                        customSwalSuccess(
                          "Municipío eliminado",
                          `El municipio ${name} se ha eliminado correctamente`,
                        );
                      },
                      onError(error, { name }) {
                        customSwalError(
                          error.response!.data.errors[0].message,
                          `Ocurrio un error al intentar eliminar el municipio ${name}`,
                        );
                      },
                      onSettled() {
                        resetField("municipality.name", {
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
    </>
  );
};

export default Localization;
