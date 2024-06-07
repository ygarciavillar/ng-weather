import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import {LocationService} from "./location.service";
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import {WeatherService} from "./weather.service";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {routing} from "./app.routing";
import {HttpClientModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TabPanelComponent } from './tabs/tab-panel.component';
import { TabItemComponent } from './tabs/tab-item.component';
import { CacheConfig, CacheService } from './cache.service';
import { cachingInterceptor } from './cache.interceptor';


export const CACHE_CONFIG = new InjectionToken<CacheConfig>('CACHE_CONFIG', {
  providedIn: 'root',
  factory:  () => ({ timeExpiredInSeconds: 180,  storage: localStorage} as CacheConfig)
});

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    MainPageComponent,
  ],
  imports: [
    TabPanelComponent,
    TabItemComponent,
    CurrentConditionsComponent,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [LocationService, WeatherService, CacheService, provideHttpClient(withInterceptors([cachingInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
