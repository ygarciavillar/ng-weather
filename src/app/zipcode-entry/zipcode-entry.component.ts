import { Component, inject } from '@angular/core';
import {LocationService} from "../location.service";
import { WeatherService } from 'app/weather.service';
import { CacheService } from 'app/cache.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  locationService = inject(LocationService)
  
  addLocation(zipcode : string){
    if(!zipcode) return;
    this.locationService.addLocation(zipcode);
  }

}
