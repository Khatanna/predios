import { gql, useMutation } from "@apollo/client";
import { Check2All } from "react-bootstrap-icons";
import { GET_ALL_NOTIFICATIONS } from "../NotificationPanel/NotficationPanel";

export type ButtonToggleReadNotificationProps = {
	read: boolean, notificationId: string
}
const TOGGLE_READ_NOTIFICATION_MUTATION = gql`
  mutation ToggleReadNotification($id: String, $read: Boolean) {
    notification: toggleReadNotification(id: $id, read: $read) {
      id
    }
  }
`;

const ButtonToggleReadNotification: React.FC<ButtonToggleReadNotificationProps> = ({ read, notificationId }) => {
	const [toggleReadNotification] = useMutation<
		{ notification: Notification },
		{ id: string; read: boolean }
	>(TOGGLE_READ_NOTIFICATION_MUTATION, {
		refetchQueries: [GET_ALL_NOTIFICATIONS],
	});

	return <Check2All
		color={read ? "#10c2b3" : "gray"}
		fontSize={20}
		role="button"
		onClick={() => {
			toggleReadNotification({
				variables: {
					id: notificationId,
					read: !read,
				},
			});
		}}
	/>
}


export default ButtonToggleReadNotification;
