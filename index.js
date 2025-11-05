'use strict'
/**
 * @module onboarding-get-parameter
 * @description Lambda que consulta un parámetro en Dynamo según el body recibido
 * @author Evelyn Rendon Kalil <evarendo@nequi.com>
 * @version 1.0.0
 * @since 2025-11-05
 * @lastModified 2025-11-05
 */

const srcHandler = require('./src/handler/handler')

exports.handler = async (event, context) => {
  await srcHandler(event, context)
}
