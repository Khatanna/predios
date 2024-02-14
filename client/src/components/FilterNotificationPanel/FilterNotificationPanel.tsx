import { Dropdown } from "react-bootstrap";
import { FilterToggle } from "../FilterToggle";
import { Check2All } from "react-bootstrap-icons";

export type FilterNotificationPanelProps = {
	// types...
}

const FilterNotificationPanel: React.FC<{ showOnlyRead?: boolean; handleChange: (value?: boolean) => void }> = ({ showOnlyRead, handleChange }) => {
	return <Dropdown role="button">
		<Dropdown.Toggle
			as={FilterToggle}
			filter={
				typeof showOnlyRead === "undefined"
					? "Todos"
					: showOnlyRead
						? "Leidos"
						: "No Leidos"
			}
		/>
		<Dropdown.Menu>
			<Dropdown.Item onClick={() => handleChange(true)}>
				<div className="d-flex gap-1 align-items-center">
					<Check2All color={"#10c2b3"} fontSize={20} />
					<div>Leidos</div>
				</div>
			</Dropdown.Item>
			<Dropdown.Item onClick={() => handleChange(false)}>
				<div className="d-flex gap-1 align-items-center">
					<Check2All color={"gray"} fontSize={20} />
					<div>No leidos</div>
				</div>
			</Dropdown.Item>
			<Dropdown.Item onClick={() => handleChange(undefined)}>
				<div className="d-flex gap-1 align-items-center">
					<Check2All fontSize={20} color="red" />
					<div>Todos</div>
				</div>
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
}

export default FilterNotificationPanel;
