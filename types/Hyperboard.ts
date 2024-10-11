export interface HyperboardEntry {
  type: string;
  id: string;
  avatar?: string | null;
  displayName?: string | null;
  value: number;
  isBlueprint: boolean;
}
