import { EyeFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

export type ButtonReviewNotificationProps = {
	propertyId: string
}

const ButtonReviewNotification: React.FC<ButtonReviewNotificationProps> = ({ propertyId }) => {
	const navigate = useNavigate();
	return <EyeFill
		color="#3c7714"
		fontSize={20}
		role="button"
		onClick={() => {
			navigate(`/properties/${propertyId}`, {
				replace: true,
			});
		}}
	/>
}

export default ButtonReviewNotification;
