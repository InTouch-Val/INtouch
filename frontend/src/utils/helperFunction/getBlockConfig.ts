export const getBlockConfig = (
  getValues: (fieldName: string) => any,
  fieldName: string,
) => ({
  type: "open",
  question: getValues(fieldName),
  description: "d",
});
