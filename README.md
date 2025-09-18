# 🌍 countrymap

A lightweight TypeScript package providing country data, names, codes, currencies, languages, locales and more.

## 🧩 Features

- ⚡️Lightweight
- 📝 Fully typed
- 🛠️ Supports both ES Modules and CommonJS
- 🔎 Useful utilities for country lookups and data access.

## 📊 Data

Here's the data that `countrymap` provide

- Country Name
- ISO-3166 alpha 2 Country Code
- ISO-3166 alpha 3 Country Code
- ISO-3166 numeric Country Code
- Country Capital
- Country Geo Meta Data
- Country Internet Code (tld)
- Country Official languages (ISO-639-1, ISO-639-2)
- Country Currency
- Country Locale
- Country Dialing Code
- Country Region
- Country Continent
- Country Flag (Emoji and Svg Web link)

> ⚠️ Data structure might evolve in future versions.

## 📦 Installation

Install with your package manager

```bash
npm install countrymap
```

## 🕹️ Usage

```ts
import cm from "countrymap";

// types
import type {
  Alpha2,
  Alpha3,
  Continent,
  Country,
  CountryName,
  CurrencyCode,
  Language,
  LocaleCode,
  Region,
} from "countrymap";

const { lookup, findBy, getAllCountries } = cm;
```

#### `lookup`

List countries by continents, languages, currencies, locales or any combination

```ts
// Find all European countries
const europe_countries = cm.lookup({ continents: ["Europe"] });

// Find Arabic-speaking countries in Africa & Asia
const arabic_speakers = lookup({
  continents: ["Africa", "Asia"],
  languages: ["Arabic"],
});

// Find countries that use USD currency on the Americas continent
const usd_countries_americas = cm.lookup({
  currencies: ["USD"],
  continents: ["Americas"],
});
```

#### `findBy`

Find country by name, alpha2, alpha3 or numeric

```ts
cm.findBy("name", "Canada");
cm.findBy("alpha2", "CA");
cm.findBy("alpha3", "CAN");
cm.findBy("numeric", "124");
```

#### `all`

List all countries

```ts
cm.getAllCountries();
```

## 📚 Resources

- **[Country Codes](https://www.iso.org/obp/ui)**
- **[Languages Codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)**
- **[Wikipedia](https://www.wikipedia.org)**
