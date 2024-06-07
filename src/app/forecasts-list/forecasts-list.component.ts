import { Component, Input, OnInit, inject } from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import { LocationService } from 'app/location.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnInit{
  @Input() zipcode!: string
  
  protected weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);

  readonly forecast = this.weatherService.forecast;
  
  ngOnInit(): void {
    this.locationService.setSelectZipCode(this.zipcode, 'forecast')
  }
}
