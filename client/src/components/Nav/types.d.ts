import {
  Level,
  Resource,
} from "../../pages/UserPage/components/Permission/Permission";

export type Route = {
  path: string;
  name: string;
  icon?: React.ReacNode;
  children?: Route[];
  permission: {
    level: Level;
    resource: Resource;
  };
};
