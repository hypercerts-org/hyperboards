export interface HyperboardEntry {
  type: "speaker" | "company" | "person";
  id: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  image: string;
  value: number;
}
