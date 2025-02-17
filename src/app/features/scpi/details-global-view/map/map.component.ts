import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Location } from '../../../../core/model/Location';

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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  @Input() countries: Location[] = [];

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
    Belgium:'Belgique'
  };

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['countries'] && !changes['countries'].firstChange) {
      this.loadGeoJson();
    }
  }

  private initMap() {
    this.map = L.map('global-view').setView([46.505, 10], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );
  }

  private loadGeoJson() {
    fetch(
      'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
    )
      .then((response) => response.json())
      .then((data: GeoJSONType) => {
        const countryNames = this.countries.map(
          (country) => country.id.country
        );

        const filterdData = {
          type: data.type,
          features: data.features.filter((feature) =>
            countryNames.includes(
              this.countryNamesMap[feature.properties.name] || ''
            )
          ),
        };
        L.geoJSON(filterdData, {
          style: (feature) => {
            const countryName = feature?.properties?.name;
            const country = this.countries.find(
              (country) =>
                country.id.country.toLowerCase() === this.countryNamesMap[countryName].toLowerCase() || ''
            );
            if (!country) return {};

            return {
              color: '#0066ff',
              weight: 1,
              fillOpacity: country.countryPercentage / 100,
            };
          },
          onEachFeature: (feature, layer) => {
            const countryName = feature?.properties?.name;
            const translatedName = this.countryNamesMap[countryName].toLowerCase();
            const country = this.countries.find(
              (country) => country.id.country.toLowerCase() === translatedName
            );

            if (!country) return;
            layer.bindTooltip(

              "${country.id.country} - ${country.countryPercentage}%",
              {
                permanent: false,
                direction: 'center',
              }
            );
          },
        }).addTo(this.map);
      })
      .catch((error) => console.error('Error loading GeoJSON:',error));
}
}
