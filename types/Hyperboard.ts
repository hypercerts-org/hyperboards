export interface HyperboardEntry {
  type: string;
  id: string;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string;
  value: bigint;
}
