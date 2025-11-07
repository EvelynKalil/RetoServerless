const nequiUtils = require("@nequi/nequi-utils");
const nequiApiUtils = require("@nequi/nequi-api-utils");
const responseUtils = nequiApiUtils.ResponseAPIUtils;
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES;
const env = nequiUtils.Environment;
const lambdaUtils = nequiUtils.Lambda8;

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

const service = async (event, key, region) => {
  try {
    const params = {
      TableName: process.env.DYNAMO_TABLE || "nequi-parameters-qa",
      Key: { key, region },
    };

    lambdaUtils.log("Consultando Dynamo con params:", JSON.stringify(params));

    const result = await dynamo.get(params).promise();
    if (!result.Item) {
      throw lambdaUtils.buildOutput(
        true,
        false,
        getOutput(
          event,
          RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
          "Parámetro no encontrado en la tabla Dynamo"
        ),
        "onboarding-get-parameter",
        "service"
      );
    }

    // Retorna el item directamente al business
    return result.Item;
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
        "service",
        error
      );
    }
  }
};

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body);
};

module.exports = {
  service,
};
