import {Component, inject, Input, OnInit, SimpleChanges} from '@angular/core';
import * as L from 'leaflet';
import {Location} from '../../../core/model/Location';
import {GeoJsonServiceService} from '@/core/service/geo-json-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  @Input() countries: Location[] = [];

  geoJsonService = inject(GeoJsonServiceService)

  ngOnInit() {
  }

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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  private loadGeoJson() {
    this.geoJsonService.getGeoJson().subscribe(
      (data) => {
        const filteredData = this.geoJsonService.filterCountries(data, this.countries);

        L.geoJSON(filteredData, {
          style: (feature) => this.getStyle(feature),
          onEachFeature: (feature, layer) => this.addToolTip(feature, layer),
        }).addTo(this.map);
      },
      (error) => {
        console.error('Erreur lors du chargment du Json:', error);
      }
    );
  }

  private getStyle(feature: any) {
    const countryName = feature?.properties?.name;
    const country = this.countries.find(
      (c) => c.id.country.toLowerCase() === this.geoJsonService.getCountryName(countryName).toLowerCase()
    );
    if (!country) return {};

    return {
      color: '#0066ff',
      weight: 1,
      fillOpacity: country.countryPercentage / 100,
    };
  }

  private addToolTip(feature: any, layer: any) {
    const countryName = feature?.properties?.name;
    const country = this.countries.find(
      (c) => c.id.country.toLowerCase() === this.geoJsonService.getCountryName(countryName).toLowerCase()
    );
    if (!country) return;
    layer.bindTooltip(
      `${country.id.country} - ${country.countryPercentage}%`,
      {
        permanent: false,
        direction: 'center',
      }
    );
  }
}
