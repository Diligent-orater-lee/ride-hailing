import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {
  mapLoaded = false;
  map!: mapboxgl.Map;
  userMarker!: mapboxgl.Marker;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 9.99825550514942;
  lng = 76.30617451263245;

  constructor() { }
  ngOnInit() {
    this.initializeMap();
    this.markUserLocation();
    setTimeout(() => {
      this.moveMarker(9.998339086114546, 76.30577015966391)
    }, 5000)
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 16,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('render', () => {
      if (!this.mapLoaded) {
        this.map.resize()
      }
    });
  }

  markUserLocation() {
    this.userMarker = new mapboxgl.Marker({
      draggable: true
    }).setLngLat([this.lng, this.lat]).addTo(this.map);
  }

  moveMarker(toLatitude: number, toLongitude: number) {
    const updatePosition = (lng: number, lat: number) => {
      this.userMarker.setLngLat([lng, lat]);
      this.userMarker.addTo(this.map);
    }

    const duration = 8000; // 5 seconds
    let startTime: any = null;

    const animateMarker = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const current = this.userMarker.getLngLat();
      const fromLongitude = current.lng;
      const fromLatitude = current.lat;

      const currentLatitude = fromLatitude + (toLatitude - fromLatitude) * progress;
      const currentLongitude = fromLongitude + (toLongitude - fromLongitude) * progress;
      updatePosition(currentLongitude, currentLatitude);
      console.log("Position updated");

      if (progress < 1) {
        requestAnimationFrame(animateMarker);
      }
    }

    // Start the animation.
    requestAnimationFrame(animateMarker);
  }

}
