import { expect, test } from "vitest";
import data from "../src/data.json";
import countrymap from "../src";

const cm = countrymap();

test("should return Europe countries if Europe passed in continents on lookup function ", () => {
  const europeCountries = data.filter((e) => e.continent == "Europe");
  const countries = cm.lookup({
    continents: ["Europe"],
  });
  expect(countries).to.deep.equal(europeCountries);
});

test("should return Africa and Asia countries that speaks Arabic on lookup function", () => {
  const africaCountries = data.filter((e) => e.continent == "Africa");
  const asiaCountries = data.filter((e) => e.continent == "Asia");
  const africaAsiaCountries = [...africaCountries, ...asiaCountries];
  const africaAsiaArabicSpeakers = africaAsiaCountries.filter((e) =>
    e.languages.spokenLanguages.some((l) => l.name === "Arabic"),
  );

  const countries = cm.lookup({
    continents: ["Africa", "Asia"],
    languages: ["Arabic"],
  });
  expect(countries).to.deep.equal(africaAsiaArabicSpeakers);
});

test("should return Northern Africa countries if Africa and Europe is passed with Northern Africa region on lookup function ", () => {
  const northernAfricaCountries = data.filter(
    (e) => e.region == "Northern Africa",
  );

  const countries = cm.lookup({
    continents: ["Africa", "Europe"],
    regions: ["Northern Africa"],
  });

  expect(countries).to.deep.equal(northernAfricaCountries);
});

test("should return empty array if no filters are passed on lookup function ", () => {
  const countries = cm.lookup({});

  expect(countries).to.deep.equal([]);
});

test("should throw an error if invalid query is passed on lookup function", () => {
  expect(() =>
    cm.lookup({
      //@ts-ignore
      unknown: [""],
    }),
  ).toThrowError(/expected a valid query key/);
});

test("should throw an error if query value is other than array on lookup function", () => {
  expect(() =>
    cm.lookup({
      //@ts-ignore
      continents: "",
    }),
  ).toThrowError(/expected an array of values/);
});

test("should throw an error if invalid query is passed on findBy function", () => {
  expect(() =>
    //@ts-ignore
    cm.findBy("unknown", "value"),
  ).toThrowError(/expected a valid query key/);
});

test("should return Canada if Canada passed as name field on findBy function ", () => {
  const canada = data.find((e) => e.alpha2 == "CA");
  const country = cm.findBy("name", "Canada");

  expect(country).to.not.equal(undefined);
  expect(country).to.deep.equal(canada);
});

test("should return Estonia if ET passed as alpha2 field on findBy function ", () => {
  const estonia = data.find((e) => e.name.common == "Estonia");
  const country = cm.findBy("alpha2", "EE");

  expect(country).to.not.equal(undefined);
  expect(country).to.deep.equal(estonia);
});

test("should return Spain if SPA passed as alpha3 field on findBy function ", () => {
  const spain = data.find((e) => e.alpha2 === "ES");
  const country = cm.findBy("alpha3", "ESP");

  expect(country).to.not.equal(undefined);
  expect(country).to.deep.equal(spain);
});

test("should return Chile if SPA passed as alpha3 field on findBy function ", () => {
  const chile = data.find((e) => e.alpha2 === "CL");

  const country = cm.findBy("numeric", "152");
  expect(country).to.not.equal(undefined);
  expect(country).to.deep.equal(chile);
});

test("should return undefined if field value is incorrect on findBy function ", () => {
  const country = cm.findBy("numeric", "999");

  expect(country).to.equal(undefined);
});

test("should both of findBy and lookup functions object value to be equal", () => {
  const findByResult = cm.findBy("name", "Italy");
  const lookupResult = cm.lookup({
    continents: ["Europe"],
    regions: ["Southern Europe"],
    languages: ["Italian"],
    currencies: ["EUR"],
    locales: ["it-IT"],
  });

  // 'lookup' function returns an array and the filtering above returns only one
  expect(findByResult).to.deep.equal(lookupResult[0]);
});

// Since 'lookup' and 'findBy' functions return the same object values,
// we're now comparing their properties.
test("should have Country type properties", () => {
  const findByResult = cm.findBy("name", "Italy");

  expect(findByResult).to.have.property("name");
  expect(findByResult).to.have.property("alpha2");
  expect(findByResult).to.have.property("alpha3");
  expect(findByResult).to.have.property("alpha2");
  expect(findByResult).to.have.property("capital");
  expect(findByResult).to.have.property("continent");
  expect(findByResult).to.have.property("currencies");
  expect(findByResult).to.have.property("dialingCodes");
  expect(findByResult).to.have.property("emoji");
  expect(findByResult).to.have.property("flag");
  expect(findByResult).to.have.property("languages");
  expect(findByResult).to.have.property("locale");
  expect(findByResult).to.have.property("numeric");
  expect(findByResult).to.have.property("region");
  expect(findByResult).to.have.property("tld");
});

test("should return all countires on all function", () => {
  expect(cm.all()).to.have.length(250);
});
