import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Location } from '../model/Location';
import { Observable } from 'rxjs';
export type GeoJSONType = {
  type:
  | 'Point'
  | 'MultiPoint'
  | 'LineString'
  | 'MultiLineString'
  | 'Polygon'
  | 'MultiPolygon'
  | 'GeometryCollection'
  | 'Feature'
  | 'FeatureCollection';
  features: Feature[];
};

export type Feature = {
  type: string;
  id: string;
  properties: Properties;
  geometry: Geometry;
};

export type Geometry = {
  type: string;
  coordinates: Array<Array<number[]>>;
};

export type Properties = {
  name: string;
};

@Injectable({
  providedIn: 'root'
})
export class GeoJsonServiceService {
  http = inject(HttpClient)

  private countryNamesMap: { [key: string]: string } = {
    Spain: 'Espagne',
    France: 'France',
    Italy: 'Italie',
    Germany: 'Allemagne',
    Portugal: 'Portugal',
    Netherlands: 'Pays-Bas',
    Luxembourg: 'Luxembourg',
    Austria: 'Autriche',
    Switzerland: 'Suisse',
    Denmark: 'Danemark',
    Sweden: 'Suède',
    Norway: 'Norvège',
    Finland: 'Finlande',
    Poland: 'Pologne',
    Czechia: 'République tchèque',
    Slovakia: 'Slovaquie',
    Hungary: 'Hongrie',
    Romania: 'Roumanie',
    Bulgaria: 'Bulgarie',
    Serbia: 'Serbie',
    Croatia: 'Croatie',
    Slovenia: 'Slovénie',
    'North Macedonia': 'Macédoine du Nord',
    Albania: 'Albanie',
    Kosovo: 'Kosovo',
    Montenegro: 'Monténégro',
    Moldova: 'Moldavie',
    Belarus: 'Biélorussie',
    Ukraine: 'Ukraine',
    Estonia: 'Estonie',
    Latvia: 'Lettonie',
    Lithuania: 'Lituanie',
    Iceland: 'Islande',
    Ireland: 'Irlande',
    Malta: 'Malte',
    Cyprus: 'Chypre',
    Monaco: 'Monaco',
    'San Marino': 'Saint-Marin',
    'Vatican City': 'Vatican',
    Andorra: 'Andorre',
    Liechtenstein: 'Liechtenstein',
    'United Kingdom': 'Gde Bretagne',
    Belgium: 'Belgique'
  };

  getGeoJson(): Observable<GeoJSONType> {
    return new Observable<GeoJSONType>((observer) => {
      fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erreur lors du chargement des données: ${response.status}`);
          }
          return response.json();
        })
        .then((data: GeoJSONType) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }


  filterCountries(data: GeoJSONType, countries: Location[]): GeoJSONType {
    const countryNames = countries.map((country) => country.id.country);
    const filteredFeatures = data.features.filter((feature) =>countryNames.includes(this.countryNamesMap[feature.properties.name] || '')
    );

    return {
      type: data.type,
      features: filteredFeatures,
    };
  }

  getCountryName(country: string): string {
    return this.countryNamesMap[country] || country;
  }

}
