import { Component, inject, Input, OnInit, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { Location } from "../../../core/model/Location";
import { GeoJsonServiceService } from "@/core/service/geo-json-service.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
  standalone: true,
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  @Input() countries: Location[] = [];
  @Input() mapHeight: string = "";

  geoJsonService = inject(GeoJsonServiceService);

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.loadGeoJson();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["countries"]) {
      if (!changes["countries"].firstChange) {
        this.loadGeoJson();
      }
    }
  }

  private initMap() {
    this.map = L.map("global-view").setView([46.505, 10], 3);

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg",
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          "&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | " +
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
          '&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.map);
  }

  private loadGeoJson() {
    this.geoJsonService.getGeoJson().subscribe(
      (data) => {
        const filteredData = this.geoJsonService.filterCountries(
          data,
          this.countries
        );

        L.geoJSON(filteredData, {
          style: (feature) => this.getStyle(feature),
          onEachFeature: (feature, layer) => this.addToolTip(feature, layer),
        }).addTo(this.map);
      },
      (error) => {
        console.error("Erreur lors du chargment du Json:", error);
      }
    );
  }

  private getStyle(feature: any) {
    const countryName = feature?.properties?.name;
    const country = this.countries.find(
      (c) =>
        c.id.country.toLowerCase() ===
        this.geoJsonService.getCountryName(countryName).toLowerCase()
    );
    if (!country) return {};

    return {
      color: "white",
      weight: 1,
      fillOpacity: country.countryPercentage / 100,
    };
  }

  private addToolTip(feature: any, layer: any) {
    const countryName = feature?.properties?.name;
    const country = this.countries.find(
      (c) =>
        c.id.country.toLowerCase() ===
        this.geoJsonService.getCountryName(countryName).toLowerCase()
    );
    if (!country) return;
    layer.bindTooltip(`${country.id.country} - ${country.countryPercentage}%`, {
      permanent: false,
      direction: "center",
      className: "tooltip",
      offset: [0, 0],
      opacity: 0.8,
      sticky: true,
    });
  }
}
