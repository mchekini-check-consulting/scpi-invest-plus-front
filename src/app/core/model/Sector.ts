export class SectorId {
  scpiId: number;
  name: string;
  constructor(scpiId: number, name: string) {
    this.scpiId = scpiId;
    this.name = name;
  }
}
export class Sector {
  id: SectorId;
  sectorPercentage: number;

  constructor(id: SectorId, sectorPercentage: number) {
    this.id = id;
    this.sectorPercentage = sectorPercentage;
  }
}
