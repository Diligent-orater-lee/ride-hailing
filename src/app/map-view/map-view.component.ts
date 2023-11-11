import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { ApiUrls } from 'src/shared/classes/api-urls';

type MapLocation = google.maps.LatLngLiteral;

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnDestroy {

  @ViewChild(GoogleMap) map!: GoogleMap;

  mapType = google.maps.MapTypeId.ROADMAP;
  showMapLoadError = false;
  userLocation: MapLocation = {
    lat: 9.99825550514942,
    lng: 76.30617451263245
  }
  mapCenter: MapLocation = {...this.userLocation};
  userMarker!: google.maps.Marker;

  $destroy = new Subject<void>();

  constructor() {
  }

  ngOnInit() {
  }

  mapCreated(event: any) {
  }

  createUserMarker() {
    this.userMarker = new google.maps.Marker({
      position: this.userLocation,
      map: this.map.googleMap,
      title: 'Hello World!'
    });
  }

  mapIdle() {
    if (!this.userMarker) {
      this.createUserMarker();
    }
  }

  updateUserLocation(userLocation: MapLocation) {
    this.userLocation = userLocation;
    this.moveMarker(this.userMarker);
  }

  moveMarker(marker: google.maps.Marker) {
    const updatePosition = (location: MapLocation) => {
      marker.setPosition(location);
    }

    const duration = 8000; // 5 seconds
    let startTime: any = null;

    const animateMarker = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const current = marker.getPosition();
      const fromLongitude = current?.lng() ?? 0;
      const fromLatitude = current?.lat() ?? 0;

      const currentLatitude = fromLatitude + (this.userLocation.lat - fromLatitude) * progress;
      const currentLongitude = fromLongitude + (this.userLocation.lng - fromLongitude) * progress;
      updatePosition({lat: currentLatitude, lng: currentLongitude});

      if (progress < 1) {
        requestAnimationFrame(animateMarker);
      }
    }

    // Start the animation.
    requestAnimationFrame(animateMarker);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  log(event: any) {
    console.log(event);
  }

}
