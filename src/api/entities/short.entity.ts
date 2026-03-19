export interface Short {
  id: string;
  url: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  accessCount?: number;
}

export class CreateShortDTO {
  url: string;
}

export class UpdateShortDTO {
  url: string;
}
