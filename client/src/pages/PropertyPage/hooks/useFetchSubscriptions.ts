import { gql, useQuery } from "@apollo/client";
import { Subscription } from "./usePropertySubscription";

export const GET_SUBSCRIPTIONS_OF_USER = gql`
  query GetSubscriptionsByUserName {
    subscriptions: getSubscriptionsByUserName {
      user {
        username
      }
      property {
        id
      }
    }
  }
`;

export const useFetchSubscriptions = () => {
  return useQuery<{ subscriptions: Subscription[] }, { username: string }>(
    GET_SUBSCRIPTIONS_OF_USER,
  );
};
