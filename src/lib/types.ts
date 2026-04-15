export interface BucketListItem {
  id: string;
  user_id: string;
  country_code: string;
  country_name: string;
  flag_url: string | null;
  region: string | null;
  notes: string | null;
  visited: boolean;
  priority: number;
  travel_date: string | null;
  created_at: string;
  updated_at: string;
}
