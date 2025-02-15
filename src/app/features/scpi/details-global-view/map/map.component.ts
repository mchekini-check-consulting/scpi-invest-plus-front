import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Location } from '../../../../models/Location';

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

  constructor() { }

  ngOnInit() { ; }

  ngAfterViewInit() {
    this.initMap();
    this.loadGeoJson()
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
        console.log(JSON.stringify({ ...data, features: [data.features[0]] }));
        const countryNames = this.countries.map((country) => country.id.country);
        const filterdData = {
          type: data.type,
          features: data.features.filter((feature) =>
            countryNames.includes(feature.properties.name)
          ),
        };

        L.geoJSON(filterdData, {
          style: (feature) => {
            
            const countryName = feature?.properties?.name;
            const country = this.countries.find(
              (country) => country.id.country === countryName
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

            const country = this.countries.find(
              (country) => country.id.country === countryName
            );

            if (!country) return;
            layer.bindTooltip(
              `${country.id.country} - ${country.countryPercentage}%`,
              {
                permanent: false,
                direction: 'center',
              }
            );
          },
        }).addTo(this.map);
      })
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }
}
