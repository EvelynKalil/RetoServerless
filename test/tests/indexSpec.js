'use strict';
const index = require('../../index.js');
const lambdaTestUtils = require('@nequi/nequi-ci-utils').Lambda8TestUtils;

describe('onboarding-get-parameter/index.js', () => {

  it('index.js: Success test', async () => {
    try {
      let response = await lambdaTestUtils.test(index.handler, 'test/success.json');
      expect(response).toBeDefined();
      // Validar la estructura y/o contenido de la respuesta exitosa
    } catch (error) {
      console.log('ERROR: ', error);
      expect(error).not.toBeDefined();
    }
  });
}); 