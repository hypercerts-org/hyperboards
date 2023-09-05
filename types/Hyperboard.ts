export interface HyperboardCompanyEntry {
  type: "company";
  id: string;
  name: string;
  image: string;
  value: number;
}

export interface HyperboardPersonEntry {
  type: "person";
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  value: number;
}

export interface HyperboardSpeakerEntry {
  type: "speaker";
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  value: number;
}

export type HyperboardEntry =
  | HyperboardCompanyEntry
  | HyperboardPersonEntry
  | HyperboardSpeakerEntry;
