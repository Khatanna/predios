export type Route = {
  path: string;
  name: string;
  icon?: React.ReacNode;
  children?: Route[];
  role: string
}