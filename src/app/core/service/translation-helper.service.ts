import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TranslationHelperService {
  constructor(private translate: TranslateService) {}

  private readonly zoneMappings = {
    "ZONE.SPAIN": "Espagne",
    "ZONE.FRANCE": "France",
    "ZONE.ITALY": "Italie",
    "ZONE.GERMANY": "Allemagne",
    "ZONE.PORTUGAL": "Portugal",
    "ZONE.NETHERLANDS": "Pays-Bas",
    "ZONE.LUXEMBOURG": "Luxembourg",
    "ZONE.AUSTRIA": "Autriche",
    "ZONE.SWITZERLAND": "Suisse",
    "ZONE.DENMARK": "Danemark",
    "ZONE.SWEDEN": "Suède",
    "ZONE.NORWAY": "Norvège",
    "ZONE.FINLAND": "Finlande",
    "ZONE.POLAND": "Pologne",
    "ZONE.CZECHIA": "République tchèque",
    "ZONE.SLOVAKIA": "Slovaquie",
    "ZONE.HUNGARY": "Hongrie",
    "ZONE.ROMANIA": "Roumanie",
    "ZONE.BULGARIA": "Bulgarie",
    "ZONE.SERBIA": "Serbie",
    "ZONE.CROATIA": "Croatie",
    "ZONE.SLOVENIA": "Slovénie",
    "ZONE.NORTH_MACEDONIA": "Macédoine du Nord",
    "ZONE.ALBANIA": "Albanie",
    "ZONE.KOSOVO": "Kosovo",
    "ZONE.MONTENEGRO": "Monténégro",
    "ZONE.MOLDOVA": "Moldavie",
    "ZONE.BELARUS": "Biélorussie",
    "ZONE.UKRAINE": "Ukraine",
    "ZONE.ESTONIA": "Estonie",
    "ZONE.LATVIA": "Lettonie",
    "ZONE.LITHUANIA": "Lituanie",
    "ZONE.ICELAND": "Islande",
    "ZONE.IRELAND": "Irlande",
    "ZONE.MALTA": "Malte",
    "ZONE.CYPRUS": "Chypre",
    "ZONE.MONACO": "Monaco",
    "ZONE.SAN_MARINO": "Saint-Marin",
    "ZONE.VATICAN_CITY": "Vatican",
    "ZONE.ANDORRA": "Andorre",
    "ZONE.LIECHTENSTEIN": "Liechtenstein",
    "ZONE.UNITED_KINGDOM": "Grande-Bretagne",
    "ZONE.BELGIUM": "Belgique",
    "ZONE.OTHER": "Autres",
  };

  private readonly sectorMappings = {
    "SECTOR.HEALTH": "Santé",
    "SECTOR.RETAIL": "Commerces",
    "SECTOR.HOTELS": "Hôtels",
    "SECTOR.OFFICES": "Bureaux",
    "SECTOR.LOGISTICS": "Logistique",
    "SECTOR.RESIDENTIAL": "Résidentiel",
    "SECTOR.ACTIVITY_LOCALS": "Locaux d'activité",
    "SECTOR.TRANSPORT": "Transport",
    "SECTOR.OTHER": "Autres",
  };

  loadInvestmentZonesAndSectors(): Observable<{ zones: { label: string; value: string }[], sectors: { label: string; value: string }[] }> {
    const zoneKeys = Object.keys(this.zoneMappings);
    const sectorKeys = Object.keys(this.sectorMappings);

    return forkJoin({
      zones: this.translate.get(zoneKeys),
      sectors: this.translate.get(sectorKeys),
    }).pipe(
      map(({ zones, sectors }) => ({
        zones: zoneKeys.map(key => ({
          label: zones[key as keyof typeof zones],
          value: this.zoneMappings[key as keyof typeof this.zoneMappings],
        })),
        sectors: sectorKeys.map(key => ({
          label: sectors[key as keyof typeof sectors],
          value: this.sectorMappings[key as keyof typeof this.sectorMappings],
        })),
      }))
    );
  }
}
