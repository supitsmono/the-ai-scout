"use client";

import type { ModelApplicant, Stage } from "./types";

const STAGES: Stage[] = [
  "incoming",
  "shortlisted",
  "contacted",
  "scouted",
  "archived",
];

const IMAGE_BASE = "http://127.0.0.1:5000/uploads/model_photos";

type Props = {
  model: ModelApplicant | null;
  onClose: () => void;
  onMoveStage: (id: number, stage: Stage) => void;
};

export default function DetailPanel({ model, onClose, onMoveStage }: Props) {
  if (!model) return null;

  const photos = [model.photo_1, model.photo_2, model.photo_3, model.photo_4].filter(
    Boolean
  ) as string[];

  return (
    <aside className="w-80 xl:w-96 border border-neutral-800 bg-neutral-950/90 backdrop-blur-xl rounded-3xl p-4 flex flex-col shadow-2xl shadow-black/70">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Model details</h2>
        <button
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-neutral-100"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-xs overflow-y-auto">
        <div>
          <p className="text-sm font-medium">{model.name}</p>
          <p className="text-[11px] text-neutral-500">
            {model.city || "Unknown city"}
          </p>
        </div>

        {photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((p, i) => (
              <img
                key={i}
                src={`${IMAGE_BASE}/${p}`}
                alt={`${model.name} ${i + 1}`}
                className="w-20 h-24 rounded-xl object-cover border border-neutral-800"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Info label="Age" value={model.age?.toString() || "N/A"} />
          <Info label="Height" value={model.height_cm ? `${model.height_cm} cm` : "N/A"} />
          <Info label="Chest" value={model.chest_cm ? `${model.chest_cm} cm` : "N/A"} />
          <Info label="Waist" value={model.waist_cm ? `${model.waist_cm} cm` : "N/A"} />
          <Info label="Hips" value={model.hips_cm ? `${model.hips_cm} cm` : "N/A"} />
          <Info
            label="AI score"
            value={model.ai_score != null ? model.ai_score.toString() : "N/A"}
          />
        </div>

        <div>
          <p className="text-[11px] text-neutral-500 mb-1">Socials</p>
          <div className="space-y-1">
            {model.instagram && (
              <a
                href={`https://instagram.com/${model.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-indigo-300 hover:text-indigo-200"
              >
                Instagram: @{model.instagram.replace("@", "")}
              </a>
            )}
            {model.tiktok && (
              <a
                href={`https://tiktok.com/@${model.tiktok.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-indigo-300 hover:text-indigo-200"
              >
                TikTok: @{model.tiktok.replace("@", "")}
              </a>
            )}
            {!model.instagram && !model.tiktok && (
              <p className="text-[11px] text-neutral-600">No socials provided.</p>
            )}
          </div>
        </div>

        {model.notes && (
          <div>
            <p className="text-[11px] text-neutral-500 mb-1">Notes</p>
            <p className="text-[11px] text-neutral-300 whitespace-pre-wrap bg-neutral-900/70 border border-neutral-800 rounded-xl px-3 py-2">
              {model.notes}
            </p>
          </div>
        )}

        <div>
          <p className="text-[11px] text-neutral-500 mb-1">Move to stage</p>
          <div className="flex flex-wrap gap-1">
            {STAGES.map((s) => (
              <button
                key={s}
                disabled={s === model.stage}
                onClick={() => onMoveStage(model.id, s)}
                className={`text-[10px] px-2 py-1 rounded-full border transition ${
                  s === model.stage
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "border-neutral-800 text-neutral-300 hover:border-indigo-500/60 hover:text-indigo-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-900/70 border border-neutral-800 px-3 py-2">
      <p className="text-[10px] text-neutral-500 mb-0.5">{label}</p>
      <p className="text-xs text-neutral-200">{value}</p>
    </div>
  );
}
