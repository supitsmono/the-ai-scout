"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FilterState {
  ageMin: number | null;
  ageMax: number | null;
  heightMin: number | null;
  heightMax: number | null;
  country: string | null;
}

interface ModelFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function ModelFilter({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: ModelFilterProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [countries, setCountries] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const res = await fetch(`${API_BASE}/models/countries/list`);
        if (res.ok) {
          const data = await res.json();
          setCountries(data.countries || []);
        }
      } catch (err) {
        console.error("Error loading countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    if (open) {
      loadCountries();
    }
  }, [open]);

  // Sync local filters with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const hasActiveFilters = () => {
    return (
      localFilters.ageMin !== null ||
      localFilters.ageMax !== null ||
      localFilters.heightMin !== null ||
      localFilters.heightMax !== null ||
      localFilters.country !== null
    );
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      ageMin: null,
      ageMax: null,
      heightMin: null,
      heightMax: null,
      country: null,
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
    onOpenChange(false);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset to original filters when closing without applying
      setLocalFilters(filters);
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent 
        side="left" 
        className="w-[380px] sm:w-[420px] bg-[#0B0F19] border-slate-800/50 overflow-y-auto p-0"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-800/50">
            <SheetTitle className="text-white text-lg font-bold">Filters</SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Age Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Age</label>
                <span className="text-xs text-slate-400">
                  {localFilters.ageMin !== null || localFilters.ageMax !== null
                    ? `${localFilters.ageMin ?? 16} - ${localFilters.ageMax ?? 50}`
                    : "All"}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Min</span>
                    <span className="text-xs text-white font-semibold">{localFilters.ageMin ?? 16}</span>
                  </div>
                  <Slider
                    value={[localFilters.ageMin ?? 16]}
                    onValueChange={([value]) => updateFilter("ageMin", value)}
                    min={16}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Max</span>
                    <span className="text-xs text-white font-semibold">{localFilters.ageMax ?? 50}</span>
                  </div>
                  <Slider
                    value={[localFilters.ageMax ?? 50]}
                    onValueChange={([value]) => updateFilter("ageMax", value)}
                    min={16}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Height Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Height (cm)</label>
                <span className="text-xs text-slate-400">
                  {localFilters.heightMin !== null || localFilters.heightMax !== null
                    ? `${localFilters.heightMin ?? 150} - ${localFilters.heightMax ?? 200}`
                    : "All"}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Min</span>
                    <span className="text-xs text-white font-semibold">{localFilters.heightMin ?? 150}</span>
                  </div>
                  <Slider
                    value={[localFilters.heightMin ?? 150]}
                    onValueChange={([value]) => updateFilter("heightMin", value)}
                    min={150}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Max</span>
                    <span className="text-xs text-white font-semibold">{localFilters.heightMax ?? 200}</span>
                  </div>
                  <Slider
                    value={[localFilters.heightMax ?? 200]}
                    onValueChange={([value]) => updateFilter("heightMax", value)}
                    min={150}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Country */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-white block">Country</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm hover:bg-slate-800/70 hover:border-slate-600/50 transition-all">
                    <span className={localFilters.country ? "text-white" : "text-slate-400"}>
                      {localFilters.country || "All Countries"}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto bg-slate-900 border-slate-700"
                >
                  <DropdownMenuItem
                    onClick={() => updateFilter("country", null)}
                    className={`text-sm cursor-pointer ${
                      localFilters.country === null
                        ? "bg-slate-800 text-white font-medium"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    All Countries
                  </DropdownMenuItem>
                  {loadingCountries ? (
                    <DropdownMenuItem className="text-sm text-slate-400 cursor-default">
                      Loading...
                    </DropdownMenuItem>
                  ) : (
                    countries.map((country) => (
                      <DropdownMenuItem
                        key={country}
                        onClick={() => updateFilter("country", country)}
                        className={`text-sm cursor-pointer ${
                          localFilters.country === country
                            ? "bg-slate-800 text-white font-medium"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {country}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Footer with buttons */}
          <div className="px-6 py-4 border-t border-slate-800/50 space-y-2 bg-[#0B0F19]">
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-all border border-slate-700 hover:border-slate-600"
              >
                Filter Off
              </button>
            )}
            <button
              onClick={applyFilters}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-purple-900/20"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
