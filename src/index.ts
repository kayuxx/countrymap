import data from "./data.json" with { type: "json" };
import type { Country } from "types.ts";
export type * from "types.ts";
const dataset = data as Country[];

type AnyProp = {
  [x: string]: any;
};

type CountriesByProps = {
  continents: { [x: string]: Country[] };
  regions: { [x: string]: Country[] };
  languages: { [x: string]: Country[] };
  currencies: { [x: string]: Country[] };
  locales: { [x: string]: Country[] };
};

type CountryByProps = {
  name: { [x: string]: Country };
  alpha2: { [x: string]: Country };
  alpha3: { [x: string]: Country };
  numeric: { [x: string]: Country };
};

const countriesBy: CountriesByProps = {
  continents: {},
  regions: {},
  languages: {},
  currencies: {},
  locales: {},
};

const countryBy: CountryByProps = {
  name: {},
  alpha2: {},
  alpha3: {},
  numeric: {},
};

type lookupProps = {
  regions?: string[];
  continents?: string[];
  languages?: string[];
  locales?: string[];
  currencies?: string[];
};

type findByProps = {
  name: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
};

type CountryMapFunction = () => {
  lookup: (filters: lookupProps) => Country[];
  findBy: <K extends keyof findByProps>(
    field: K,
    value: findByProps[K],
  ) => Country | undefined;
  all: () => Country[];
};

function mergeFields(
  obj: AnyProp,
  f: keyof typeof countriesBy,
  s: string,
  country: Country,
): Country[] {
  return [...(obj[f][s] || []), country];
}

const countrymap: CountryMapFunction = () => {
  for (const country of dataset) {
    countryBy["name"][country.name.common] = country;
    countryBy["alpha2"][country.alpha2] = country;
    countryBy["alpha3"][country.alpha3] = country;
    countryBy["numeric"][country.numeric] = country;

    countriesBy["continents"][country.continent] = mergeFields(
      countriesBy,
      "continents",
      country.continent,
      country,
    );

    countriesBy["regions"][country.region] = mergeFields(
      countriesBy,
      "regions",
      country.region,
      country,
    );

    for (const currency of country.currencies) {
      if (currency.code) {
        countriesBy["currencies"][currency.code] = mergeFields(
          countriesBy,
          "currencies",
          currency.code,
          country,
        );
      }
    }
    for (const locale of country.locale.locales) {
      countriesBy["locales"][locale] = mergeFields(
        countriesBy,
        "locales",
        locale,
        country,
      );
    }
    for (const lang of country.languages.spokenLanguages) {
      if (lang.name) {
        countriesBy["languages"][lang.name] = mergeFields(
          countriesBy,
          "languages",
          lang.name,
          country,
        );
      }
    }
  }

  return {
    lookup(filters) {
      const filtersArray = Object.entries(filters) as [
        keyof typeof filters,
        string[],
      ][];

      let results: Set<Country> | null = null;

      for (const [key, values] of filtersArray) {
        if (!Object.keys(countriesBy).includes(key)) {
          throw new Error("Invalid query: expected a valid query key");
        }
        if (!Array.isArray(values)) {
          throw new Error("Invalid query: expected an array of values");
        }
        const sets: Set<Country>[] = [];
        for (const value of values ?? []) {
          const countries = countriesBy[key][value] ?? [];
          sets.push(new Set(countries));
        }

        const merged = new Set<Country>(sets.flatMap((s) => [...s]));
        // filtering based on country object reference
        results = results
          ? new Set(
              (Array.from(results) as Country[]).filter((country) =>
                merged.has(country),
              ),
            )
          : merged;
      }
      return results ? [...results] : [];
    },
    findBy(key, value) {
      if (!Object.keys(countryBy).includes(key)) {
        throw new Error("Invalid query: expected a valid query key");
      }
      return countryBy[key][value];
    },
    all() {
      return dataset;
    },
  };
};

export default countrymap;
