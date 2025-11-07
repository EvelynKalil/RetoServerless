const nequiUtils = require("@nequi/nequi-utils");
const nequiApiUtils = require("@nequi/nequi-api-utils");
const responseUtils = nequiApiUtils.ResponseAPIUtils;
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES;
const env = nequiUtils.Environment;
const lambdaUtils = nequiUtils.Lambda8;

const { service } = require("../services/service");

module.exports = async function processBusiness(event) {
  return await callService(event);
};

const callService = async (event) => {
  try {
    // Extraer los parámetros del cuerpo NORMAL
    const requestBody = event.RequestMessage.RequestBody.any.testRQ;
    const { parameter1, parameter2 } = requestBody;

    // Enviar a la capa de servicio
    const result = await service(event, parameter1, parameter2);

    // Devolver el resultado al handler
    return result;
  } catch (error) {
    if (error && error.output) {
      throw error;
    } else {
      throw lambdaUtils.buildOutput(
        true,
        true,
        getOutput(
          event,
          RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
          RESPONSE_MESSAGES.TECHNICAL_ERROR.DESCRIPTION
        ),
        "onboarding-get-parameter",
        "business",
        error
      );
    }
  }
};

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body);
};
