"use client";

type Props = {
  value: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
};

export default function ToggleView({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-full bg-neutral-900 border border-neutral-700 p-1 text-[10px]">
      <button
        onClick={() => onChange("grid")}
        className={`px-3 py-1 rounded-full transition ${
          value === "grid"
            ? "bg-neutral-100 text-black"
            : "text-neutral-400 hover:text-neutral-100"
        }`}
      >
        Grid
      </button>
      <button
        onClick={() => onChange("list")}
        className={`px-3 py-1 rounded-full transition ${
          value === "list"
            ? "bg-neutral-100 text-black"
            : "text-neutral-400 hover:text-neutral-100"
        }`}
      >
        List
      </button>
    </div>
  );
}
