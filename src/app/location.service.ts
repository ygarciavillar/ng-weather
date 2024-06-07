import { Injectable, Signal, signal, effect, inject } from '@angular/core';
import { CacheService } from './cache.service';


export const LOCATIONS : string = "locations";

export type actionType = 'added' | 'deleted' | 'forecast' ;

export interface LocationNotification {
  zipcode?: string
  action?: actionType,
}

@Injectable()
export class LocationService {

  
  private readonly cacheService = inject(CacheService);

  /* load the locations[] from the cache in the first page load */
  private cachedLocations = this.cacheService.getCacheData(LOCATIONS);

  /* Init the location[] list */
  readonly locations = signal<string[]>(this.cachedLocations || [] );

  /* produce the last zipcode added selected to keep track of it. */
  private selectZipCode = signal<LocationNotification>({zipcode: ''});

  readonly locationsChange = signal<LocationNotification>({});

   
  addLocation(zipcode : string) {
    /*No add duplicate location zip code*/
    if(this.locations().findIndex( code => code === zipcode) !== -1){
      this.selectZipCode.set({zipcode, action: 'added'});
      return;
    }
    this.locations.update( (locations) => [...locations, zipcode]);
    this.cacheService.setCacheData(LOCATIONS, this.locations());
    this.selectZipCode.set({zipcode, action: 'added'});
  }

  removeLocation(zipcode : string) {
    this.locations.update( (locations) => 
      locations.filter( loc => loc !==  zipcode));
    this.selectZipCode.set({zipcode: '', action: 'deleted'});

    /* clean the zipcode caache if the list is empty */
    this.locations().length 
    ? this.cacheService.setCacheData(LOCATIONS, this.locations())
    : this.cacheService.clearCachedItem(LOCATIONS);
  }

  /* return the location[] signal as readonly for all the receptors */
  getLocations(): Signal<string[]>{
    return this.locations.asReadonly()
  }

  setSelectZipCode(zipcode: string, action?: actionType){
    this.selectZipCode.set({zipcode, action});
  }

  getSelectedZipCode() {
    return this.selectZipCode.asReadonly()
  }

}
