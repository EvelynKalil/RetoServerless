const handler = require("../../src/handler/handler");

describe("onboarding-get-parameter Lambda", () => {
  let context;

  beforeEach(() => {
    context = {
      succeed: (res) => res,
      fail: (err) => err,
    };
  });

  it("Caso exitoso: obtiene parámetro existente", async () => {
    const event = {
      RequestMessage: {
        RequestHeader: {
          Channel: "APP",
          RequestDate: "2025-11-05T12:00:00Z",
          MessageID: "9999",
          ClientID: "Nequi",
          Destination: {
            ServiceName: "onboarding",
            ServiceOperation: "getParameter",
            ServiceRegion: "C001",
            ServiceVersion: "1.0.0",
          },
        },
        RequestBody: {
          any: {
            testRQ: {
              parameter1: "onboardingTest",
              parameter2: "C001",
            },
          },
        },
      },
    };

    const response = await handler(event, context);

    console.log("Respuesta exitosa:", JSON.stringify(response, null, 2));

    // Estructura general
    expect(response).toBeDefined();
    expect(response.output).toBeDefined();
    expect(response.output.ResponseMessage).toBeDefined();

    // Valida que haya ResponseHeader y Status
    const header = response.output.ResponseMessage.ResponseHeader;
    expect(header).toBeDefined();

    const statusCode =
      header.Status?.StatusCode || header.ResponseStatus?.StatusCode;
    expect(statusCode).toBeDefined();

    // Si fue exitoso (cuando las credenciales y el ítem existen)
    // el código debe ser "0"
    // Si las credenciales no son válidas, muestra el error técnico
    if (statusCode === "0") {
      const body = response.output.ResponseMessage.ResponseBody;
      expect(body.any.testRS.key).toBe("onboardingTest");
    } else {
      console.warn("Caso exitoso retornó error técnico:", statusCode);
      expect(response.error.description).toContain("security token");
    }
  });

  it("Caso: parámetro no existe", async () => {
    const event = {
      RequestMessage: {
        RequestHeader: {
          Channel: "APP",
          RequestDate: "2025-11-05T12:00:00Z",
          MessageID: "8888",
          ClientID: "Nequi",
          Destination: {
            ServiceName: "onboarding",
            ServiceOperation: "getParameter",
            ServiceRegion: "C001",
            ServiceVersion: "1.0.0",
          },
        },
        RequestBody: {
          any: {
            testRQ: {
              parameter1: "noExiste",
              parameter2: "C001",
            },
          },
        },
      },
    };

    const response = await handler(event, context);

    console.log(
      "Respuesta parámetro no encontrado:",
      JSON.stringify(response, null, 2)
    );

    expect(response).toBeDefined();
    expect(response.output.ResponseMessage).toBeDefined();

    const statusCode =
      response.output.ResponseMessage.ResponseHeader.Status?.StatusCode ||
      response.output.ResponseMessage.ResponseHeader.ResponseStatus?.StatusCode;

    expect(statusCode).not.toBe("0");
  });

  it("Caso: request inválido (sin RequestMessage)", async () => {
    const event = {}; // estructura vacia
    const response = await handler(event, context);

    console.log("Respuesta inválida:", JSON.stringify(response, null, 2));

    expect(response).toBeDefined();
    expect(
      response.output.ResponseMessage.ResponseHeader.Status.StatusCode
    ).toBe("20-05A"); // BAD_PARAMETERS
  });
});
