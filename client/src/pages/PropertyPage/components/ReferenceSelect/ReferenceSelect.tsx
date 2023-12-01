import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { SelectNameable } from '../../../HomePage/HomePage';
import { Property } from '../../models/types';
import { useReferenceStore } from '../../state/useSelectablesStore';
import { useModalStore } from '../../state/useModalStore';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { Reference } from '../../../ReferencePage/models/types';
import { useReferenceMutations } from '../../hooks/useRepository';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';

export type ReferenceSelectProps = {
	readOnly: boolean
}

const GET_ALL_REFERENCES_QUERY = `
	query GetAllReferencesQuery {
		references: getAllReferences {
			name
		}
	}
`

const ReferenceSelect: React.FC<ReferenceSelectProps> = ({ readOnly }) => {
	const { control, getValues, resetField, watch } = useFormContext<Property>();
	const { setModal } = useModalStore();
	const { mutationDelete: mutationReferenceDelete } = useReferenceMutations<{
		reference: Pick<Reference, 'name'>;
	}>();
	const { items: references, setItems: setReferences } = useReferenceStore();
	const reference = watch('reference.name');

	const { error } = useCustomQuery<{ references: Reference[] }>(
		GET_ALL_REFERENCES_QUERY,
		["getAllReferences"],
		{
			onSuccess({ references }) {
				setReferences(references);
			},
		},
	);

	return <Controller
		name="reference.name"
		control={control}
		defaultValue="Verificado"
		render={({ field }) => (
			<SelectNameable
				{...field}
				size="sm"
				readOnly={readOnly}
				placeholder={"Referencia"}
				options={references.map(({ name }) => ({
					label: name,
					value: name,
				}))}
				highlight
				onCreate={() => {
					setModal({
						form: "createReference",
						title: "Crear referencia",
						show: true,
					});
				}}
				onEdit={() => {
					setModal({
						form: "updateReference",
						title: "Actualizar referencia",
						show: true,
						params: { name: reference },
					});
				}}
				onDelete={() => {
					const reference = getValues("reference");

					if (reference) {
						mutationReferenceDelete(reference, {
							onSuccess({
								data: {
									reference: { name },
								},
							}) {
								customSwalSuccess(
									"Referencia eliminada",
									`La referencia ${name} se ha eliminado correctamente`,
								);
							},
							onError(error, { name }) {
								customSwalError(
									error.response!.data.errors[0].message,
									`Ocurrio un error al intentar eliminar la referencia ${name}`,
								);
							},
							onSettled() {
								resetField("reference.name", {
									defaultValue: "undefined",
								});
							},
						});
					}
				}}
			/>
		)}
	/>;
};

export default ReferenceSelect;
