import React from 'react';
import { Alert, Form, FormSelectProps, InputGroup, Spinner } from 'react-bootstrap';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import { PillUser } from '../../../../components/PillUser';
import { useQuery } from '@apollo/client';
import { useInputSubscription } from '../../hooks/useInputSubscription';
import { DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client';
import { Property } from '../../models/types';
import { FieldPath } from 'react-hook-form'

type TNameable = { name: string };
type TNameableResponse = { options: TNameable[] };
type QueryNameable = {
	getAllQuery:
	| DocumentNode
	| TypedDocumentNode<TNameableResponse, OperationVariables>;
	// createQuery:
	// | DocumentNode
	// | TypedDocumentNode<TNameableResponse, OperationVariables>;
	// updateQuery:
	// | DocumentNode
	// | TypedDocumentNode<TNameableResponse, OperationVariables>;
	// deleteQuery:
	// | DocumentNode
	// | TypedDocumentNode<TNameableResponse, OperationVariables>;
};

// type DropdownNameableProps = Omit<QueryNameable, "getAllQuery"> & TNameable;
type CustomSelectProps = {
	name: FieldPath<Property>;
} & FormSelectProps &
	QueryNameable;
const CustomSelect: React.FC<CustomSelectProps> = ({
	name,
	placeholder,
	getAllQuery,
	...props
}) => {
	const { data, loading, error } = useQuery<TNameableResponse>(getAllQuery);
	const { subscribe, username, isFocus } = useInputSubscription({
		name,
	});

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center border border-1 rounded-1 h-50">
				<Spinner
					variant="danger"
					size={props.size === "sm" ? "sm" : undefined}
				/>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="danger" className="p-1 m-0">
				<small>
					<div className="d-flex align-items-center gap-1">
						<ExclamationTriangle size={16} color="red" />
						<div>{error.message}</div>
					</div>
				</small>
			</Alert>
		);
	}

	return (
		<div className="position-relative">
			{isFocus && <PillUser username={username} />}
			<InputGroup size={props.size}>
				{subscribe.readOnly ? (
					<Form.Control {...subscribe} readOnly size={props.size} />
				) : (
					<Form.Select {...subscribe} size={props.size} {...props}>
						<option value="undefined" className="text-body-tertiary" disabled>
							{placeholder}
						</option>
						{data?.options.map(({ name }) => (
							<option value={name} style={{ color: "black" }}>
								{name}
							</option>
						))}
					</Form.Select>
				)}
				<InputGroup.Text>
					{/* <DropdownNameable
            createQuery={createQuery}
            deleteQuery={deleteQuery}
            updateQuery={updateQuery}
          /> */}
				</InputGroup.Text>
			</InputGroup>
		</div>
	);
};

export default CustomSelect;
