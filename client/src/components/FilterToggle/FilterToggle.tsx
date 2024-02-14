import { Filter } from "react-bootstrap-icons";

export type FilterToggleProps = {
	filter: string
}

const FilterToggle: React.FC<FilterToggleProps> = ({ filter, ...props }) => {
	return (
		<strong {...props}>
			Filtrar por <Filter fontSize={24} /> ({filter})
		</strong>
	);
};

export default FilterToggle;
