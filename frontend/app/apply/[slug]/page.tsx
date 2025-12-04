"use client";

import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

export default function ApplyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    city: "",
    instagram: "",
    tiktok: "",
    height_cm: "",
    chest_cm: "",
    waist_cm: "",
    hips_cm: "",
    notes: "",
  });

  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null, null]);

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhotoChange(index: number, file: File | null) {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach((file, i) => {
        if (file) fd.append(`photo_${i + 1}`, file);
      });

      const res = await fetch(`${API_BASE}/api/apply/${slug}`, {
        method: "POST",
        body: fd,
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || "Application failed");
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message || "Application failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md mx-auto text-center space-y-4 px-4">
          <h1 className="text-xl font-semibold">Application received</h1>
          <p className="text-sm text-neutral-400">
            Thank you for applying. Our team will review your profile and get back
            to you if there is a match.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-950 to-neutral-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950/70 backdrop-blur-xl p-6 space-y-6 shadow-2xl shadow-black/60"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Model application</h1>
          <div className="flex gap-1 text-[10px]">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`w-6 h-1 rounded-full ${
                  s <= step ? "bg-indigo-500" : "bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/60 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {step === 1 && (
          <section className="grid md:grid-cols-2 gap-4 text-sm">
            <Field
              label="Full name"
              required
              value={form.name}
              onChange={(v) => updateField("name", v)}
            />
            <Field
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(v) => updateField("email", v)}
            />
            <Field
              label="Age"
              type="number"
              value={form.age}
              onChange={(v) => updateField("age", v)}
            />
            <Field
              label="City"
              value={form.city}
              onChange={(v) => updateField("city", v)}
            />
            <Field
              label="Instagram"
              placeholder="@username"
              value={form.instagram}
              onChange={(v) => updateField("instagram", v)}
            />
            <Field
              label="TikTok"
              placeholder="@username"
              value={form.tiktok}
              onChange={(v) => updateField("tiktok", v)}
            />
          </section>
        )}

        {step === 2 && (
          <section className="grid md:grid-cols-2 gap-4 text-sm">
            <Field
              label="Height (cm)"
              type="number"
              value={form.height_cm}
              onChange={(v) => updateField("height_cm", v)}
            />
            <Field
              label="Chest (cm)"
              type="number"
              value={form.chest_cm}
              onChange={(v) => updateField("chest_cm", v)}
            />
            <Field
              label="Waist (cm)"
              type="number"
              value={form.waist_cm}
              onChange={(v) => updateField("waist_cm", v)}
            />
            <Field
              label="Hips (cm)"
              type="number"
              value={form.hips_cm}
              onChange={(v) => updateField("hips_cm", v)}
            />
            <div className="md:col-span-2">
              <label className="text-xs text-neutral-300 mb-1 block">
                Notes
              </label>
              <textarea
                className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 min-h-[80px]"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {photos.map((file, i) => (
              <div key={i} className="space-y-2">
                <p className="text-[11px] text-neutral-300">
                  Photo {i + 1} {i === 0 && <span className="text-red-400">*</span>}
                </p>
                <label className="block rounded-xl border border-dashed border-neutral-700 bg-neutral-900/80 h-28 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/70 hover:bg-neutral-900 transition">
                  <span className="text-[10px] text-neutral-400">
                    {file ? file.name : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handlePhotoChange(i, e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
            ))}
            <p className="text-[10px] text-neutral-500 md:col-span-4">
              Minimum 1 photo required. Clear full-body and portrait shots are
              recommended.
            </p>
          </section>
        )}

        <div className="flex justify-between pt-2 text-xs">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-3 py-2 rounded-xl border border-neutral-700 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-900/80 transition"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !photos[0]}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-700/70 text-white font-medium transition"
            >
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-neutral-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
