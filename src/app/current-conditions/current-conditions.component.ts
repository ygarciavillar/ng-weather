import {Component, computed, effect, inject, Signal} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { CurrentConditionComponent } from './current-condition.component';
import { NgFor, NgIf } from '@angular/common';
import { TabPanelComponent } from 'app/tabs/tab-panel.component';
import { TabItemComponent } from 'app/tabs/tab-item.component';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  imports: [TabPanelComponent, TabItemComponent,  CurrentConditionComponent, NgIf, NgFor],
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
   
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.conditionsAndZip;

  
  /* signal to update the select tab index */
  zipCodeToSelectIndex = computed( () => {
    const locationNotification = this.locationService.getSelectedZipCode();
    const {zipcode} = locationNotification(); 
     const result = this.currentConditionsByZip().findIndex( resp => resp.zip === zipcode);
    /* if the current conditions are already loaded for that zip code 
     * then the corresponding tab should be selected;
    */
    return result !== -1 ? result : 0;
  })

  removeLocation(zipcode: string){
    this.locationService.removeLocation(zipcode);
  }

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }


  getWeatherIcon(id: any){
    this.weatherService.getWeatherIcon(id);
  }
 
}
