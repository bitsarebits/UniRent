// Domain types and data models for the UniRent student housing platform.

export type City = 'Bologna' | 'Padova';

export type RoomType = 'Singola' | 'Doppia' | 'Monolocale';

export type ListingSource = 'Subentro da studente' | 'Proprietario diretto';

export type ApplicationStatus =
  | 'Inviata'
  | 'In valutazione'
  | 'Colloquio fissato'
  | 'Ritirata';

export type TabKey = 'esplora' | 'preferiti' | 'candidature' | 'profilo';

export interface Roommate {
  name: string;
  age: number;
  faculty: string;
  habitBadge: string;
}

export interface Listing {
  id: string;
  title: string;
  city: City;
  neighborhood: string;
  universityHub: string;
  distanceToFaculty: string;
  roomType: RoomType;
  listingSource: ListingSource;
  verified: boolean;
  priceMonthly: number;
  depositAmount: number;
  billsIncluded: boolean;
  billsEstimate: string;
  availableFrom: string;
  availableMonthKey: 'subito' | 'dicembre' | 'gennaio';
  imageUrl: string;
  hostName: string;
  hostRole: string;
  description: string;
  vibeTags: string[];
  roommates: Roommate[];
  highlights: string[];
}

export interface FilterState {
  searchQuery: string;
  city: 'Tutte' | City;
  maxPrice: number;
  roomTypes: RoomType[];
  listingSource: 'Tutti' | ListingSource;
  billsIncludedOnly: boolean;
  availableMonth: 'tutte' | 'subito' | 'dicembre' | 'gennaio';
}

export interface ApplicationRecord {
  id: string;
  listingId: string;
  submittedAt: string;
  status: ApplicationStatus;
  message: string;
  moveInPreference: string;
  callSlot: string;
}

export interface StudentProfile {
  fullName: string;
  university: string;
  faculty: string;
  studyYear: string;
  maxBudget: number;
  bio: string;
  verifiedStudent: boolean;
}
