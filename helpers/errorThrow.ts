const errorThrow = (statusCode: number, message: string) => {
  const error = new Error(message);
  error.status = statusCode;
  throw error;
};
