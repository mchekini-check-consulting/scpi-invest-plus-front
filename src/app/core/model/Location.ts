export class LocationId{
    scpiId: number;
    country: string;

    constructor(scpiId:number, country:string){
        this.scpiId = scpiId;
        this.country = country;

    }

}
export class Location {
    id: LocationId;
    countryPercentage: number;

    constructor(id: LocationId, countryPercentage: number) {
        this.id = id;
        this.countryPercentage = countryPercentage;
    }
}