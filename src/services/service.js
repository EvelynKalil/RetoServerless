const nequiUtils = require("@nequi/nequi-utils");
const nequiApiUtils = require("@nequi/nequi-api-utils");
const responseUtils = nequiApiUtils.ResponseAPIUtils;
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES;
const lambdaUtils = nequiUtils.Lambda8;

const nequiDynamoDB = require("@nequi/nequi-aws-dynamodb");

const service = async (event, key, region) => {
  try {
    const tableName = process.env.DYNAMO_TABLE;
    const dynamoKey = { key, region };

    lambdaUtils.log(
      "Consultando Dynamo (Nequi SDK) con:",
      JSON.stringify(dynamoKey)
    );

    const result = await nequiDynamoDB.getItem(tableName, dynamoKey);

    // Si no encontró el item, lanza error controlado
    if (!result || !result.Item) {
      throw lambdaUtils.buildOutput(
        true,
        false,
        getOutput(
          event,
          RESPONSE_MESSAGES.DATA_NOT_FOUND.CODE,
          "Parámetro no encontrado en la tabla Dynamo"
        ),
        "onboarding-get-parameter",
        "service"
      );
    }

    return result.Item;
  } catch (error) {
    if (error && error.output) {
      throw error;
    }

    // Si es un error inesperado, construye un error técnico
    throw lambdaUtils.buildOutput(
      true,
      true,
      getOutput(
        event,
        RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
        RESPONSE_MESSAGES.TECHNICAL_ERROR.DESCRIPTION
      ),
      "onboarding-get-parameter",
      "service",
      error
    );
  }
};

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body);
};

module.exports = { service };
