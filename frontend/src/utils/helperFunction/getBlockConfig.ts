export const getBlockConfig = (
  getValues: (fieldName: string) => string,
  fieldName: string,
) => ({
  type: "open",
  question: getValues(fieldName),
  description: "d",
});
