const { validatePackSize } = require("./pack-size");

const translations = require(`${__dirname}/../../../translations/form-fields.json`);

describe(`lib/validation/individual-fields/pack-size`, () => {
  const testCases = (languageCode) => [
    [
      "missing field is allowed",
      undefined,
      {
        packSize: {
          isValid: true,
          messages: [],
          value: "",
        },
      },
    ],
    [
      "wrong data type returns an empty string",
      false,
      {
        packSize: {
          isValid: true,
          messages: [],
          value: "",
        },
      },
    ],
    [
      "provided field is empty",
      "",
      {
        packSize: {
          isValid: true,
          messages: [],
          value: "",
        },
      },
    ],
    [
      "given a number returns a string",
      6665,
      {
        packSize: {
          isValid: true,
          messages: [],
          value: "6665",
        },
      },
    ],
    [
      "is too long",
      "a".repeat(256),
      {
        packSize: {
          isValid: false,
          messages: [
            translations.incidentProductPackSize.validation.invalidLength[
              languageCode
            ],
            translations.incidentProductPackSize.validation.invalidNumber[
              languageCode
            ],
          ],
          value: "a".repeat(256),
        },
      },
    ],
    [
      "happy path",
      "12345",
      {
        packSize: {
          isValid: true,
          messages: [],
          value: "12345",
        },
      },
    ],
  ];

  ["en", "cy"].forEach((languageCode) => {
    test.each(testCases(languageCode))(
      `%s - ${languageCode}`,
      (description, given, expected) => {
        const i18n = {
          languageCode,
          ...translations,
        };

        expect(validatePackSize(given, i18n)).toEqual(expected);
      }
    );
  });
});
