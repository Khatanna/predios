import { useMemo } from 'react';
import { buildTimeAgo } from '../../utilities/buildTimeAgo';
import { buildFullName } from '../../pages/UserPage/utils/buildFullName';
import { Toast } from 'react-bootstrap';
import { Bell } from 'react-bootstrap-icons';
import { Notification, fieldNames } from '../../state/useNotificationStore';
import { CustomClipboard } from '../CustomClipboard';
import { Tooltip } from '../Tooltip';
import { ButtonReviewNotification } from '../ButtonReviewNotification';
import { ButtonToggleReadNotification } from '../ButtonToggleReadNotification';

const NotificationItem: React.FC<Notification> = ({ fieldName, from, id, property, read, timeAgo, title, to }) => {
	const timeAgoMemo = useMemo(() => buildTimeAgo(timeAgo), [timeAgo])
	const fromMemo = useMemo(() => buildFullName(from), []);
	const toMemo = useMemo(() => buildFullName(to), []);

	return <Toast className="w-100">
		<Toast.Header closeButton={false}>
			<Bell className="rounded me-2" color="red" fontSize={18} />
			<strong className="me-auto">{title}</strong>
			<small>{timeAgoMemo}</small>
		</Toast.Header>
		<Toast.Body>
			<div>
				De:{" "}
				<i>
					<b>{fromMemo}</b>
				</i>
			</div>
			<div>
				Para:{" "}
				<i>
					<b>{toMemo}</b>
				</i>
			</div>
			<div>
				Campo modificado:{" "}
				<span className="text-primary fw-bold">
					{fieldNames[fieldName]}
				</span>
			</div>
			{property.code && property.code.length !== 0 && <div className="d-flex align-items-center gap-2">
				<div>Codigo de predio: {property.code}</div>
				<CustomClipboard text={property.code} />
			</div>}
			<div>
				<div>Nombre del predio:</div>
				<p className="text-success fw-bold">{property.name}</p>
			</div>
			<div className="d-flex justify-content-end gap-2 mt-2">
				<Tooltip label="Revisar">
					<ButtonReviewNotification propertyId={property.id} />
				</Tooltip>
				<Tooltip
					label={read ? "Marcar como no leido" : "Marcar como leido"}
				>
					<ButtonToggleReadNotification read={read} notificationId={id} />
				</Tooltip>
			</div>
		</Toast.Body>
	</Toast>
}


export default NotificationItem;
