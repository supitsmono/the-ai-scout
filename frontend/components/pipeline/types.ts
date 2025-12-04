export type Stage =
  | "incoming"
  | "shortlisted"
  | "contacted"
  | "scouted"
  | "archived";

export type ModelApplicant = {
  id: number;
  agency_id: number;
  name: string;
  email: string | null;
  age: number | null;
  city: string | null;
  instagram: string | null;
  tiktok: string | null;
  height_cm: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  photo_1?: string | null;
  photo_2?: string | null;
  photo_3?: string | null;
  photo_4?: string | null;
  notes?: string | null;
  ai_score?: number | null;
  ai_category?: "high" | "medium" | "low" | null;
  stage: Stage;
  created_at?: string;
};
