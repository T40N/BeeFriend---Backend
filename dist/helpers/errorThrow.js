"use strict";
const errorThrow = (statusCode, message) => {
    const error = new Error(message);
    error.status = statusCode;
    throw error;
};
