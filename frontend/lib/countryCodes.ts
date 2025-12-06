// lib/countryCodes.ts

export type CountryDialCode = {
  name: string;
  iso2: string;         // ISO 3166-1 alpha-2, e.g. "NL"
  code: string;         // E.164 prefix, e.g. "+31"
  trunkPrefix?: string; // e.g. "0" when domestic numbers often start with 0
  minLength?: number;   // national significant number length (without trunk)
  maxLength?: number;
};

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  // Europe (met trunkPrefix + lengte)
  { name: "Netherlands", iso2: "NL", code: "+31", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Belgium", iso2: "BE", code: "+32", trunkPrefix: "0", minLength: 8, maxLength: 9 },
  { name: "Germany", iso2: "DE", code: "+49", trunkPrefix: "0", minLength: 7, maxLength: 11 },
  { name: "France", iso2: "FR", code: "+33", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "United Kingdom", iso2: "GB", code: "+44", trunkPrefix: "0", minLength: 9, maxLength: 10 },
  { name: "Spain", iso2: "ES", code: "+34", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Italy", iso2: "IT", code: "+39", trunkPrefix: "0", minLength: 6, maxLength: 10 },
  { name: "Portugal", iso2: "PT", code: "+351", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Sweden", iso2: "SE", code: "+46", trunkPrefix: "0", minLength: 7, maxLength: 10 },
  { name: "Norway", iso2: "NO", code: "+47", minLength: 8, maxLength: 8 },
  { name: "Denmark", iso2: "DK", code: "+45", minLength: 8, maxLength: 8 },
  { name: "Finland", iso2: "FI", code: "+358", trunkPrefix: "0", minLength: 5, maxLength: 10 },
  { name: "Switzerland", iso2: "CH", code: "+41", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Austria", iso2: "AT", code: "+43", trunkPrefix: "0", minLength: 7, maxLength: 13 },
  { name: "Ireland", iso2: "IE", code: "+353", trunkPrefix: "0", minLength: 7, maxLength: 9 },
  { name: "Poland", iso2: "PL", code: "+48", minLength: 9, maxLength: 9 },
  { name: "Czech Republic", iso2: "CZ", code: "+420", minLength: 9, maxLength: 9 },
  { name: "Hungary", iso2: "HU", code: "+36", trunkPrefix: "06", minLength: 8, maxLength: 9 },
  { name: "Greece", iso2: "GR", code: "+30", trunkPrefix: "0", minLength: 10, maxLength: 10 },
  { name: "Romania", iso2: "RO", code: "+40", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Bulgaria", iso2: "BG", code: "+359", trunkPrefix: "0", minLength: 7, maxLength: 9 },
  { name: "Croatia", iso2: "HR", code: "+385", trunkPrefix: "0", minLength: 8, maxLength: 9 },
  { name: "Serbia", iso2: "RS", code: "+381", trunkPrefix: "0", minLength: 8, maxLength: 9 },
  { name: "Bosnia and Herzegovina", iso2: "BA", code: "+387", trunkPrefix: "0", minLength: 8, maxLength: 8 },
  { name: "Slovakia", iso2: "SK", code: "+421", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Slovenia", iso2: "SI", code: "+386", trunkPrefix: "0", minLength: 8, maxLength: 8 },

  // Noord-Amerika
  { name: "United States", iso2: "US", code: "+1", minLength: 10, maxLength: 10 },
  { name: "Canada", iso2: "CA", code: "+1", minLength: 10, maxLength: 10 },
  { name: "Mexico", iso2: "MX", code: "+52", trunkPrefix: "0", minLength: 10, maxLength: 10 },

  // Latijns-Amerika (globale regels)
  { name: "Argentina", iso2: "AR", code: "+54", trunkPrefix: "0", minLength: 8, maxLength: 10 },
  { name: "Brazil", iso2: "BR", code: "+55", trunkPrefix: "0", minLength: 10, maxLength: 11 },
  { name: "Chile", iso2: "CL", code: "+56", minLength: 9, maxLength: 9 },
  { name: "Colombia", iso2: "CO", code: "+57", minLength: 10, maxLength: 10 },
  { name: "Peru", iso2: "PE", code: "+51", trunkPrefix: "0", minLength: 8, maxLength: 9 },
  { name: "Venezuela", iso2: "VE", code: "+58", trunkPrefix: "0", minLength: 10, maxLength: 10 },
  { name: "Uruguay", iso2: "UY", code: "+598", minLength: 8, maxLength: 9 },
  { name: "Paraguay", iso2: "PY", code: "+595", minLength: 9, maxLength: 9 },
  { name: "Bolivia", iso2: "BO", code: "+591", trunkPrefix: "0", minLength: 8, maxLength: 8 },

  // Afrika (globaal)
  { name: "South Africa", iso2: "ZA", code: "+27", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Egypt", iso2: "EG", code: "+20", trunkPrefix: "0", minLength: 9, maxLength: 10 },
  { name: "Nigeria", iso2: "NG", code: "+234", trunkPrefix: "0", minLength: 7, maxLength: 10 },
  { name: "Kenya", iso2: "KE", code: "+254", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Morocco", iso2: "MA", code: "+212", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Ghana", iso2: "GH", code: "+233", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Ethiopia", iso2: "ET", code: "+251", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Tanzania", iso2: "TZ", code: "+255", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Uganda", iso2: "UG", code: "+256", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Algeria", iso2: "DZ", code: "+213", trunkPrefix: "0", minLength: 9, maxLength: 9 },

  // Azië / Oceanië
  { name: "Australia", iso2: "AU", code: "+61", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "New Zealand", iso2: "NZ", code: "+64", trunkPrefix: "0", minLength: 8, maxLength: 9 },
  { name: "India", iso2: "IN", code: "+91", minLength: 10, maxLength: 10 },
  { name: "Pakistan", iso2: "PK", code: "+92", trunkPrefix: "0", minLength: 9, maxLength: 10 },
  { name: "Bangladesh", iso2: "BD", code: "+880", minLength: 10, maxLength: 10 },
  { name: "Indonesia", iso2: "ID", code: "+62", trunkPrefix: "0", minLength: 9, maxLength: 11 },
  { name: "Philippines", iso2: "PH", code: "+63", trunkPrefix: "0", minLength: 9, maxLength: 10 },
  { name: "Malaysia", iso2: "MY", code: "+60", trunkPrefix: "0", minLength: 8, maxLength: 9 },
  { name: "Singapore", iso2: "SG", code: "+65", minLength: 8, maxLength: 8 },
  { name: "Thailand", iso2: "TH", code: "+66", trunkPrefix: "0", minLength: 8, maxLength: 9 },
  { name: "Vietnam", iso2: "VN", code: "+84", trunkPrefix: "0", minLength: 9, maxLength: 10 },
  { name: "Japan", iso2: "JP", code: "+81", trunkPrefix: "0", minLength: 9, maxLength: 10 },
  { name: "South Korea", iso2: "KR", code: "+82", trunkPrefix: "0", minLength: 8, maxLength: 10 },
  { name: "China", iso2: "CN", code: "+86", minLength: 10, maxLength: 11 },
  { name: "Hong Kong", iso2: "HK", code: "+852", minLength: 8, maxLength: 8 },
  { name: "Taiwan", iso2: "TW", code: "+886", minLength: 8, maxLength: 9 },
  { name: "United Arab Emirates", iso2: "AE", code: "+971", minLength: 9, maxLength: 9 },
  { name: "Saudi Arabia", iso2: "SA", code: "+966", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Qatar", iso2: "QA", code: "+974", minLength: 8, maxLength: 8 },
  { name: "Kuwait", iso2: "KW", code: "+965", minLength: 8, maxLength: 8 },
  { name: "Turkey", iso2: "TR", code: "+90", trunkPrefix: "0", minLength: 10, maxLength: 10 },

  // Overig / fallback
  { name: "Iceland", iso2: "IS", code: "+354", minLength: 7, maxLength: 9 },
  { name: "Luxembourg", iso2: "LU", code: "+352", minLength: 8, maxLength: 9 },
  { name: "Estonia", iso2: "EE", code: "+372", minLength: 7, maxLength: 8 },
  { name: "Latvia", iso2: "LV", code: "+371", minLength: 8, maxLength: 8 },
  { name: "Lithuania", iso2: "LT", code: "+370", minLength: 8, maxLength: 8 },
  { name: "Ukraine", iso2: "UA", code: "+380", trunkPrefix: "0", minLength: 9, maxLength: 9 },
  { name: "Russia", iso2: "RU", code: "+7", trunkPrefix: "8", minLength: 10, maxLength: 10 },
];
