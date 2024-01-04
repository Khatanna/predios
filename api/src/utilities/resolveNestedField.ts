export const resolveNestedField = (
  dataObject: any,
  fields: string[],
  value: string,
): any => {
  const [currentField, ...remainingFields] = fields;

  if (remainingFields.length === 0) {
    return { ...dataObject, connect: { [currentField]: value } };
  }

  return {
    ...dataObject,
    [currentField]: resolveNestedField(
      dataObject[currentField] || {},
      remainingFields,
      value,
    ),
  };
};