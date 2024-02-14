import { useState, useMemo } from 'react';
import { Notification } from '../../state/useNotificationStore';
import { NotificationItem } from '../NotificationItem';
import { Offcanvas } from 'react-bootstrap';
import { FilterNotificationPanel } from '../FilterNotificationPanel';

export type NotficationPanelProps = {
	notifications?: Notification[];
	show: boolean;
	onHide: () => void;
}
const filterNotification = (notifications?: Notification[], show?: boolean) => {
	if (!notifications) {
		return [];
	}
	if (typeof show === "undefined") {
		return notifications;
	}
	return notifications.filter((n) => n.read === show);
};

const NotificationPanel: React.FC<NotficationPanelProps> = ({ show, onHide, notifications }) => {
	const [showOnlyRead, setShowOnlyRead] = useState<boolean | undefined>(
		undefined,
	);

	const filteredNotifications = useMemo(() => filterNotification(notifications, showOnlyRead), [notifications, showOnlyRead])

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
