// npm install leaflet
// npm install @types/leaflet

import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map!: any;
  private marker!: any;

  @Input() latitude: number = 0;
  @Input() longitude: number = 0;

  // Output pour notifier la nouvelle position
  @Output() locationChanged = new EventEmitter<{lat: number, lng: number}>();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && this.map && (changes['latitude'] || changes['longitude'])) {
      this.updateMarker();
    }
  }

  private addMarker(L: any): void {
    if (this.map && this.latitude && this.longitude) {
      this.marker = L.marker([this.latitude, this.longitude], {draggable: true}).addTo(this.map);

      // Écouter le déplacement du marqueur
      this.marker.on('dragend', () => {
        const pos = this.marker.getLatLng();
        this.locationChanged.emit({lat: pos.lat, lng: pos.lng});
        this.map.setView(pos);
      });
    }
  }

  private updateMarker(): void {
    if (this.marker) {
      this.marker.setLatLng([this.latitude, this.longitude]);
      this.map.setView([this.latitude, this.longitude], 13);
    }
  }

  private initMap(): void {
    import('leaflet').then(LModule => {
      const L = LModule.default;

      this.map = L.map('map', {
        center: [this.latitude || 39.8282, this.longitude || -98.5795],
        zoom: this.latitude && this.longitude ? 13 : 3
      });

      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      tiles.addTo(this.map);

      this.addMarker(L);

      // Permettre à l'utilisateur de cliquer sur la carte pour déplacer le marqueur
      this.map.on('click', (e: any) => {
        const latlng = e.latlng;
        if (this.marker) {
          this.marker.setLatLng(latlng);
        } else {
          this.marker = L.marker(latlng, {draggable: true}).addTo(this.map);
          this.marker.on('dragend', () => {
            const pos = this.marker.getLatLng();
            this.locationChanged.emit({lat: pos.lat, lng: pos.lng});
            this.map.setView(pos);
          });
        }
        this.locationChanged.emit({lat: latlng.lat, lng: latlng.lng});
      });
    });
  }
}
