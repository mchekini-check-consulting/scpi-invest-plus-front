import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true
})
export class MapComponent implements OnInit {

  private map!: L.Map;
  countries=[];
  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.loadGeoJson();
  }

  private initMap() {
    this.map = L.map('map').setView([51.505, -0.09], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadGeoJson() {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: (feature:any) => {
            const countryName = feature.properties.name; // Get country name
            
            if (countryName === "France" || countryName === "Germany") {
              return {
                color: "#ff0000", // Red border
                weight: 2,
                fillColor: "#ffcccc", // Light red fill
                fillOpacity: 0.6
              };
            } else {
              return {
                color: "#0066ff", // Blue border
                weight: 1,
                fillColor: "#ffffff", // Transparent fill
                fillOpacity: 0
              };
            }
          },
          onEachFeature: (feature, layer) => {
            const countryName = feature.properties.name;
            layer.bindTooltip(countryName, { permanent: false, direction: "center" });
          }
        }).addTo(this.map);
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }

}
