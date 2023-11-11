import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { ApiUrls } from 'src/shared/classes/api-urls';
import { GetRealtimeValueChangeScanner } from 'src/shared/functions/common-functions';
import { MapLocation } from 'src/shared/interfaces/map-view-interfaces';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService implements OnDestroy {

  private hubConnection!: signalR.HubConnection;

  private $riderLocation = new BehaviorSubject<MapLocation>(null as any); // Null is already handled in the GetRealtimeValueChangeScanner function

  constructor() { }

  get riderLocation() {
    return this.$riderLocation.pipe(GetRealtimeValueChangeScanner<MapLocation>());
  }

  public startMapServiceConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(ApiUrls.RealtimeURLS.MapService).build();

    this.hubConnection.start().then(() => console.log('Connection started')).catch(err => console.log('Error while starting connection: ' + err));
  }

  public maptesting() {
    this.hubConnection.on('Testing', (data) => {
      this.$riderLocation.next(data);
    });
  }

  public stopConnection() {
    this.hubConnection.stop()
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}
