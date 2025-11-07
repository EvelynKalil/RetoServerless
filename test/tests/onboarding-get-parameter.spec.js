const lambdaTestUtils = require("@nequi/nequi-ci-utils").Lambda8TestUtils;
const index = require("../../index.js");

const fs = require("fs");
const path = require("path");
const handler = require("../../src/handler/handler");

describe("onboarding-get-parameter Lambda", () => {
  it("Caso exitoso: obtiene parámetro existente", async () => {
    try {
      let response = await lambdaTestUtils.test(
        index.handler,
        "test/success.json"
      );

      // Estructura general
      expect(response).toBeDefined();
      expect(response.ResponseMessage).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status).toBeDefined();
      expect(
        response.ResponseMessage.ResponseHeader.Status.StatusCode
      ).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status.StatusCode).toBe(
        "0"
      );
    } catch (error) {
      console.log("ERROR: ", error);
      expect(error).not.toBeDefined();
    }
  });

  it("Caso: parámetro no existe", async () => {
    try {
      let response = await lambdaTestUtils.test(
        index.handler,
        "test/notfound.json"
      );

      // Estructura general
      expect(response).toBeDefined();
      expect(response.ResponseMessage).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status).toBeDefined();
      expect(
        response.ResponseMessage.ResponseHeader.Status.StatusCode
      ).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status.StatusCode).toBe(
        "20-08A"
      );
    } catch (error) {
      console.log("ERROR: ", error);
      expect(error).not.toBeDefined();
    }
  });

  it("Caso: request inválido (sin RequestMessage)", async () => {
    try {
      let response = await lambdaTestUtils.test(
        index.handler,
        "test/invalid.json"
      );

      // Estructura general
      expect(response).toBeDefined();
      expect(response.ResponseMessage).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status).toBeDefined();
      expect(
        response.ResponseMessage.ResponseHeader.Status.StatusCode
      ).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status.StatusCode).toBe(
        "20-05A"
      );
    } catch (error) {
      console.log("ERROR: ", error);
      expect(error).not.toBeDefined();
    }
  });
});
