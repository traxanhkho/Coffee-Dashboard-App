export const validateForm = async (schema, data, setError) => {
  try {
    await schema.validateAsync(data, { abortEarly: false });
    return {};
  } catch (error) {
    const formattedErrors = {};
    error.details.forEach((err) => {
      setError(err.path[0], {
        type: "manual",
        message: err.message,
      });
      formattedErrors[err.path[0]] = err.message;
    });
    return formattedErrors;
  }
};
