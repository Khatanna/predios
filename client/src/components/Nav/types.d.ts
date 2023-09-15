export type Route = {
  path: string
  name: string,
  children?: Route[]
}