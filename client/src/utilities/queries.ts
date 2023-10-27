export const GET_CITY_BY_NAME_QUERY = {
  query: `
    query GetCityByName($name: String) {
      city: getCity(name: $name) {
        name
      }
    }
  `,
  key: 'getCityByName'
}