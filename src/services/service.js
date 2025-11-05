const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const env = nequiUtils.Environment
const lambdaUtils = nequiUtils.Lambda8

const service = async (event) => {
  try {
    // Implementar el llamado a elementos externos
    // let data = await nequiDynamo.getItem('table', {id:1});
  } catch (error) {
    throw lambdaUtils.buildOutput(true, true,
      getOutput(event, RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
        RESPONSE_MESSAGES.TECHNICAL_ERROR.DESCRIPTION),
      'Sistema que fallo', 'proceso o función', error)
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}

module.exports = {
  service: service
}
