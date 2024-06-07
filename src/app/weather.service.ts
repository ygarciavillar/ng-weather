import {Injectable, inject} from '@angular/core';
import {toSignal, toObservable} from '@angular/core/rxjs-interop'
import {Observable, from, of, throwError} from 'rxjs';

import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import { catchError, concatMap, filter, map, switchMap, tap, toArray } from 'rxjs/operators';
import { LocationService } from './location.service';



@Injectable()
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  
  private http: HttpClient = inject(HttpClient);
  private locationService = inject(LocationService);


  /* To react everytime the location array is changed */
  private readonly locations = this.locationService.getLocations();

  private readonly selectZipCode = this.locationService.getSelectedZipCode();

  /* Reacting to changes in the location[] to refresh the conditionsAndZip values */
  private readonly conditionsAndZip$ = toObservable(this.locations).pipe(
    switchMap( locations => {
      let currentZipcode = '';
            return from(locations).pipe(
            tap( zipcode => currentZipcode = zipcode),
            concatMap( zipcode => this.addCurrentConditions(zipcode)),
            toArray(),
            catchError( error => {
              this.locationService.removeLocation(currentZipcode);
              return of( [] as ConditionsAndZip [])
            }),
          )
        }),
   );
  
   readonly conditionsAndZip = toSignal(this.conditionsAndZip$, {initialValue: []});

   
   addCurrentConditions(zipcode: string): Observable<ConditionsAndZip> {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
          .pipe( map(data => ({zip: zipcode, data} as ConditionsAndZip)))
  }

  /* Reacting to changes in the selected zipcode with forecast action 
  * to reactivily fetch the forecast data.
   */
  private readonly forecast$ = toObservable(this.selectZipCode).pipe(
    filter( notification => notification.action === 'forecast'),
    switchMap( ({zipcode} )=> this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`))
  )

  forecast = toSignal(this.forecast$);

  
  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

  /* to formatter the errors and and rethrow it */
  private formattError(err: HttpErrorResponse, zipcode: string): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.error.message}`;
    }

    const errorResponse = { zipcode, errorMessage};
   
    return throwError( () => errorResponse);
  }

}
