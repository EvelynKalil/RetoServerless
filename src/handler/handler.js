const lambdaUtils = require("@nequi/nequi-utils").Lambda8;
const nequiApiUtils = require("@nequi/nequi-api-utils");
const responseUtils = nequiApiUtils.ResponseAPIUtils;
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES;

const validateSchema = require("../config/schema/validateSchema");
const processBusiness = require("../business/business");

module.exports = async function defaultHandler(event, context) {
  lambdaUtils.log("Entry event:", JSON.stringify(event));

  try {
    //Validar estructura del request contra el schema
    await validateSchema(event);

    //Ejecutar la lógica de negocio
    const response = await processBusiness(event);

    //Construir la respuesta de éxito
    const output = lambdaUtils.buildOutput(
      true,
      false,
      getOutput(
        event,
        RESPONSE_MESSAGES.SUCCESS.CODE,
        RESPONSE_MESSAGES.SUCCESS.DESCRIPTION,
        { testRS: response }
      )
    );

    //Finalizar lambda (runtime AWS)
    await lambdaUtils.finish(context, output);

    //Retornar respuesta (para entorno local y tests)
    return output;
  } catch (error) {
    //Manejo de errores técnico o de validación
    await lambdaUtils.finish(context, error);

    //Retornar también el error (para pruebas locales)
    return error;
  }
};

// Función auxiliar para construir la respuesta estándar Nequi
const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body);
};
