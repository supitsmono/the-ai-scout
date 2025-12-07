"use client";

import { useState } from "react";
import ModelCard from "./ModelCard";
import ModelDetailPanel from "./ModelDetailPanel";
import StatusBadge from "@/components/ui/StatusBadge";

// ----------------------
// DUMMY MODELS
// ----------------------
const dummyModels = [
  {
    id: 1,
    name: "Sophia Berg",
    age: 21,
    height: 176,
    country: "Netherlands",
    photos: [
      { url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", type: "Full Face" },
      { url: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg", type: "Side Profile" },
      { url: "https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg", type: "Full Body" }
    ],
    measurements: { bust: 82, waist: 60, hips: 90 },
    motivation: "Modeling allows me to express myself creatively while connecting with inspiring people.",
    status: "perfectFit",
  },
  {
    id: 2,
    name: "Emma Li",
    age: 19,
    height: 170,
    country: "China",
    photos: [
      { url: "https://images.pexels.com/photos/371160/pexels-photo-371160.jpeg", type: "Full Face" },
      { url: "https://images.pexels.com/photos/458718/pexels-photo-458718.jpeg", type: "Full Body" }
    ],
    measurements: { bust: 80, waist: 58, hips: 88 },
    motivation: "I love the fashion industry and want to grow internationally.",
    status: "goodFit",
  },
  {
    id: 3,
    name: "Mila Rossi",
    age: 22,
    height: 173,
    country: "Italy",
    photos: [
      { url: "https://images.pexels.com/photos/204611/pexels-photo-204611.jpeg", type: "Full Body" },
      { url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", type: "Close-Up" }
    ],
    measurements: { bust: 85, waist: 61, hips: 92 },
    motivation: "Modeling gives me confidence and opens opportunities.",
    status: "lowPotential",
  },
  {
    id: 4,
    name: "Ava Johnson",
    age: 20,
    height: 174,
    country: "USA",
    photos: [
      { url: "https://images.pexels.com/photos/428361/pexels-photo-428361.jpeg", type: "Full Face" }
    ],
    measurements: { bust: 83, waist: 62, hips: 91 },
    motivation: "Looking for international opportunities and runway projects.",
    status: "contacted",
  },
];

// ----------------------
// TABS
// ----------------------
const tabs = [
  { key: "all", label: "ALL" },
  { key: "perfectFit", label: "PERFECT FIT" },
  { key: "goodFit", label: "GOOD FIT" },
  { key: "lowPotential", label: "LOW POTENTIAL" },
  { key: "favorite", label: "FAVORITES" },
  { key: "rejected", label: "REJECTED" },
  { key: "contacted", label: "CONTACTED" },
];

// ----------------------
// COMPONENT
// ----------------------
export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedModel, setSelectedModel] = useState(null);

  const filteredModels =
    selectedTab === "all"
      ? dummyModels.filter((m) => m.status !== "contacted")
      : dummyModels.filter((m) => m.status === selectedTab);

  return (
    <div className="w-full flex flex-col p-6 relative">

      {/* TABS */}
      <div className="flex gap-8 mb-8 border-b border-white/10 pb-2">
        {tabs.map((tab) => {
          const active = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`relative pb-3 text-sm font-semibold transition-all ${
                active ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full bg-purple-500 transition-all ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* CONTACTED PIPELINE */}
      {selectedTab === "contacted" ? (
        <div className="flex flex-col gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="flex items-center justify-between bg-[#111] border border-white/10 rounded-2xl p-4 hover:bg-[#181818]"
            >
              {/* LEFT SECTION */}
              <div className="flex items-center gap-4">
                <img
                  src={model.photos[0].url}
                  className="w-16 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-white text-lg font-semibold">{model.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {model.age} y/o • {model.height} cm • {model.country}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 italic">No messages yet</p>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <StatusBadge status="contacted" />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white text-sm">
                  Open Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* MODEL GRID FOR OTHER TABS */
        <div className="grid grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onClick={() => setSelectedModel(model)}
            />
          ))}
        </div>
      )}

      {/* DETAIL PANEL */}
      <ModelDetailPanel
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
      />
    </div>
  );
}
