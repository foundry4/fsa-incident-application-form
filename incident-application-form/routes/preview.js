const express = require("express");
const { assemblePayload } = require("../lib/formatting/final-payload-assembly");
const { validate } = require("../lib/validation/your-details");
const { getCompanyTypes } = require("../lib/lookups/company-types");
const { getCountries } = require("../lib/lookups/countries");
const { getNotifierTypes } = require("../lib/lookups/notifier-types");
const { getProductTypes } = require("../lib/lookups/product-types");
const { getUnits } = require("../lib/lookups/units");
const send = require("../lib/email/send");

const router = express.Router();

const template = "preview";

const languageCode = "en";
const pageTranslations = require(`${__dirname}/../translations/${template}.json`);
const formFieldTranslations = require(`${__dirname}/../translations/form-fields.json`);

const routes = require(`${__dirname}/../routes/routes.json`);

const i18n = {
  languageCode,
  ...pageTranslations,
  ...formFieldTranslations,
};

const sendConfirmationEmail = async (data) => {
  const email = data.yourDetails.email.value;
  const personalisation = {
    contactName: data.yourDetails.contactName.value,
    referenceNumber: "//TODO auto generate a reference number",
  };
  await send("en-confirmation-email", email, personalisation);
};

const sendNotificationEmail = async (data) => {
  const email = process.env.NOTIFICATION_EMAIL;
  const personalisation = {
    contactName: data.yourDetails.contactName.value,
    referenceNumber: "//TODO auto generate a reference number",
  };
  await send("en-notification-of-incident-email", email, personalisation);
};

router.get("/", async function (req, res, next) {
  const [
    companyTypes,
    countries,
    notifierTypes,
    productTypes,
    units,
  ] = await Promise.all([
    getCompanyTypes(languageCode),
    getCountries(languageCode),
    getNotifierTypes(languageCode),
    getProductTypes(languageCode),
    getUnits(languageCode),
  ]);

  res.render(template, {
    i18n,
    companyTypes,
    countries,
    detailsOfIncident: req.session.detailsOfIncident || {},
    notifierTypes,
    products: req.session.products || {},
    productTypes,
    routes,
    units,
    yourDetails: req.session.yourDetails || {},
  });
});

router.post("/", async function (req, res, next) {
  //TODO? note- there's a strong argument that we should be using the payload to populate these
  //  .. at the point i was testing i only had tests covering some of the pages so the
  //  payload wasn't building properly; i just stuck these in here so i could prove the integration
  //  you can see inside those methods that it's not like it particularly matters where the
  //  data comes from..
  await sendConfirmationEmail(req.session);
  await sendNotificationEmail(req.session);

  const payload = assemblePayload(req.session);

  // TODO clear the session here.

  res.render(template, {
    i18n,
    yourDetails: req.session.yourDetails || {},
    detailsOfIncident: req.session.detailsOfIncident || {},
    routes,
    payload: JSON.stringify(payload, null, 2),
  });
});

module.exports = router;
