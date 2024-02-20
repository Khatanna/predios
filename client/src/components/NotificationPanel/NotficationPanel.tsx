import { useState, useMemo, useEffect } from 'react';
import { Notification, useNotificationStore } from '../../state/useNotificationStore';
import { NotificationItem } from '../NotificationItem';
import { Offcanvas } from 'react-bootstrap';
import { FilterNotificationPanel } from '../FilterNotificationPanel';
import { gql, useQuery } from '@apollo/client';

export const GET_ALL_NOTIFICATIONS = gql`
  query GetAllNotifications {
    notifications: getAllNotifications {
      id
      fieldName
      title
      timeAgo
      read
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


const filterNotification = (notifications?: Notification[], show?: boolean) => {
	if (!notifications) {
		return [];
	}
	if (typeof show === "undefined") {
		return notifications;
	}
	return notifications.filter((n) => n.read === show);
};

const NotificationPanel: React.FC = () => {
	const { show, onHide, setUnreadNotifications } = useNotificationStore();

	const [showOnlyRead, setShowOnlyRead] = useState<boolean | undefined>(
		undefined,
	);
	const { data } = useQuery<{ notifications: Notification[] }>(
		GET_ALL_NOTIFICATIONS
	);

	useEffect(() => {
		if (data?.notifications) {
			setUnreadNotifications(data.notifications.filter((n) => !n.read).length);
		}
	}, [data?.notifications]);

	const filteredNotifications = useMemo(() => filterNotification(data?.notifications, showOnlyRead), [data?.notifications, showOnlyRead])

	return (
		<Offcanvas show={show} onHide={onHide}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Panel de notificaciones</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body className="d-flex gap-2 flex-column">
				<FilterNotificationPanel
					handleChange={(value) => setShowOnlyRead(value)}
					showOnlyRead={showOnlyRead}
				/>
				{filteredNotifications.map(
					(notification) => (
						<NotificationItem {...notification} />
					),
				)}
			</Offcanvas.Body>
		</Offcanvas>
	);
};


export default NotificationPanel;
