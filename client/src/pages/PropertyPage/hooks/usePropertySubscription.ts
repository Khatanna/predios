import { gql, useSubscription } from "@apollo/client";
import { useAuthStore } from "../../../state/useAuthStore";
import { User } from "../../UserPage/models/types";
import { Property } from "../models/types";
import { useFetchSubscriptions } from "./useFetchSubscriptions";
import { GET_ALL_NOTIFICATIONS } from "../../../components/NotificationPanel/NotficationPanel";

const ON_CHANGE_SUBSCRIPTION = gql`
  subscription PropertyChange($username: String) {
    propertyChange(username: $username) {
      fieldName
      to {
        names
        firstLastName
        secondLastName
        username
      }
      from {
        names
        firstLastName
        secondLastName
        username
      }
      property {
        id
        name
        code
      }
    }
  }
`;

export type Subscription = {
  id: string;
  user: User;
  property: Property;
};

export const usePropertySubscription = () => {
  const { user } = useAuthStore();
  const { data } = useFetchSubscriptions();
  return useSubscription<
    {
      propertyChange: {
        fieldName: string;
        to: User;
        from: User;
        property: Property;
      };
    },
    { username: string }
  >(ON_CHANGE_SUBSCRIPTION, {
    skip: !data?.subscriptions.length,
    variables: {
      username: user!.username,
    },
    onData({ client }) {
      client.refetchQueries({
        include: [GET_ALL_NOTIFICATIONS],
      });
    },
  });
};
