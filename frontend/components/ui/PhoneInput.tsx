"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRY_DIAL_CODES, type CountryDialCode } from "@/lib/countryCodes";

/* ---------------------- HELPERS ---------------------- */

function isoToFlagEmoji(iso2: string): string {
  const codePoints = iso2
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function stripTrunkPrefix(country: CountryDialCode, digits: string): string {
  const trunk = country.trunkPrefix ?? "";
  if (trunk && digits.startsWith(trunk)) return digits.slice(trunk.length);
  if (trunk === "0" && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function formatLocalDisplay(country: CountryDialCode, raw: string): string {
  const all = stripNonDigits(raw);
  if (!all) return "";

  let trunk = "";
  let rest = all;

  if (country.trunkPrefix && all.startsWith(country.trunkPrefix)) {
    trunk = country.trunkPrefix;
    rest = all.slice(country.trunkPrefix.length);
  } else if (country.trunkPrefix === "0" && all.startsWith("0")) {
    trunk = "0";
    rest = all.slice(1);
  }

  const lenRest = rest.length;

  if (country.iso2 === "NL") {
    if (lenRest <= 1) return `${trunk}${rest}`;
    if (lenRest <= 5) return `${trunk}${rest[0]} ${rest.slice(1)}`;
    return `${trunk}${rest[0]} ${rest.slice(1, 5)} ${rest.slice(5)}`;
  }

  if (["GB", "FR", "DE", "ES", "IT", "BE"].includes(country.iso2)) {
    return (trunk + rest).replace(/(.{2,3})/g, "$1 ").trim();
  }

  if (["US", "CA"].includes(country.iso2)) {
    if (lenRest <= 3) return rest;
    if (lenRest <= 6) return `${rest.slice(0, 3)} ${rest.slice(3)}`;
    return `${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }

  return (trunk + rest).replace(/(.{3})/g, "$1 ").trim();
}

function getMaskExample(country: CountryDialCode): string {
  const trunk = country.trunkPrefix ?? "";
  const length = country.minLength ?? 9;

  const mobileStartMap: Record<string, string> = {
    NL: "6",
    BE: "4",
    FR: "6",
    DE: "15",
    ES: "6",
    IT: "3",
    GB: "7",
    PT: "9",
    SE: "7",
    NO: "4",
    DK: "2",
    FI: "4",
    CH: "7",
    AT: "6",
    IE: "85",
    PL: "5",
    CZ: "6",
    HU: "20",
    RO: "7",
    GR: "6",
    US: "201",
    CA: "416",
    AU: "4",
    NZ: "2",
    BR: "11",
    AR: "11",
    MX: "55",
    ZA: "7",
    IN: "9",
    JP: "80",
    CN: "13",
    HK: "9",
    SG: "8",
    AE: "50",
    TR: "5",
  };

  const override = mobileStartMap[country.iso2];
  const baseStart =
    override ?? (country.trunkPrefix === "0" ? "6" : "2");

  const remaining = Math.max(length - baseStart.length, 0);
  const filler = "1".repeat(remaining);
  const raw = trunk + baseStart + filler;

  return formatLocalDisplay(country, raw);
}

/* ---------------------- COMPONENT ---------------------- */

export default function PhoneInput() {
  const defaultCountry =
    COUNTRY_DIAL_CODES.find((c) => c.iso2 === "NL") || COUNTRY_DIAL_CODES[0];

  const [selected, setSelected] = useState<CountryDialCode>(defaultCountry);
  const [localRaw, setLocalRaw] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      COUNTRY_DIAL_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search) ||
          c.iso2.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const digits = stripNonDigits(localRaw);
  const maxDigits =
    (selected.maxLength ?? 12) + (selected.trunkPrefix?.length ?? 0);
  const limited = digits.slice(0, maxDigits);

  const trimmedForCountry = stripTrunkPrefix(selected, limited);
  const formattedLocal = formatLocalDisplay(selected, limited);
  const fullE164 = `${selected.code}${trimmedForCountry}`;

  const maskText = getMaskExample(selected);

  function onSelectCountry(c: CountryDialCode) {
    setSelected(c);
    setOpen(false);
  }

  function onNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = stripNonDigits(e.target.value);
    setLocalRaw(val);
  }

  return (
    <div className="relative w-full text-xs select-none">
      {/* Hidden backend fields */}
      <input type="hidden" name="phoneCountryIso" value={selected.iso2} />
      <input type="hidden" name="phoneCountryCode" value={selected.code} />
      <input type="hidden" name="phoneLocal" value={trimmedForCountry} />
      <input type="hidden" name="phoneE164" value={fullE164} />

      <div className="flex gap-2">
        {/* COUNTRY SELECT BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-between w-[150px] text-[12px] hover:bg-slate-800/70 transition"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-[18px]">{isoToFlagEmoji(selected.iso2)}</span>
            {selected.code}
          </span>
          <span className="text-[10px] opacity-50">▼</span>
        </button>

        {/* PHONE INPUT + GHOST MASK */}
        <div className="relative flex-1">
          {/* GHOST MASK */}
          <div
            className="
              pointer-events-none absolute inset-0 
              flex items-center px-3
              text-[14px] font-mono font-semibold tracking-wide
              text-white/55
            "
            style={{ zIndex: 1, whiteSpace: "pre", userSelect: "none" }}
          >
            {maskText}
          </div>

          {/* INPUT (nooit leeg, gebruikt NBSP) */}
          <input
            required
            name="phoneDisplay"
            value={formattedLocal === "" ? "\u00A0" : formattedLocal}
            onChange={onNumberChange}
            className={`
              input w-full font-mono bg-transparent relative z-10 
              text-[14px] py-2.5 
              ${formattedLocal === "" ? "text-transparent" : "text-white"}
            `}
            inputMode="numeric"
            style={{ position: "relative" }}
          />
        </div>
      </div>

      {/* COUNTRY DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="
              absolute top-full left-0 mt-2 w-[280px] 
              max-h-72 overflow-y-auto rounded-xl 
              bg-slate-900 border border-slate-800 shadow-xl z-20 p-2
            "
          >
            <input
              className="w-full px-2 py-1.5 rounded-md bg-slate-800 text-[12px] text-slate-200 mb-2"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filtered.map((c) => (
              <button
                key={c.iso2}
                onClick={() => onSelectCountry(c)}
                type="button"
                className="w-full flex items-center justify-between px-2 py-2 text-[12px] rounded-md hover:bg-slate-700/40"
              >
                <span className="flex items-center gap-2 truncate">
                  {isoToFlagEmoji(c.iso2)} {c.name}
                </span>
                <span className="opacity-70">{c.code}</span>
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="text-[11px] text-slate-500 text-center py-2">
                No results
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
