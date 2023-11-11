import { environment } from "src/environments/environment";

export class ApiUrls {
  public static readonly RealtimeURLS = {
    MapService: environment.server.realTimeServer + 'map-service/',
  }
}
