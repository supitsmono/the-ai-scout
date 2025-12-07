"use client";

// This page is now handled by the WorkspaceLayout in layout.tsx
// The page component is kept for Next.js routing but content is in WorkspaceLayout

export default function DashboardPage() {
  return null; // Content is rendered in WorkspaceLayout
}

// Export types for use in other components
export type ModelStatus =
  | "perfectFit"
  | "goodFit"
  | "lowPotential"
  | "favorite"
  | "rejected"
  | "contacted";

export type Photo = {
  url: string;
  type?: string;
};

export type Measurements = {
  bust: number;
  waist: number;
  hips: number;
};

export type DashboardModel = {
  id: number;
  name: string;
  age: number;
  height: number;
  country: string;
  photos: Photo[];
  measurements: Measurements;
  motivation: string;
  status: ModelStatus;
  aiCategory?: string | null;
  aiReasons?: string[] | null;
};
