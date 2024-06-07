import { Injectable, Optional, inject } from '@angular/core';
import { CACHE_CONFIG } from './app.module';

export interface CacheData<T> {
  data: T;
  expiry: number;
}

export interface CacheConfig {
  timeExpiredInSeconds: number;
  storage: Storage;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService<T>{

  private readonly cacheConfig = inject(CACHE_CONFIG, {optional: true});
  
   defaultConfig: CacheConfig = this.cacheConfig || {timeExpiredInSeconds: 7200, storage: localStorage}

   private readonly storage = this.cacheConfig.storage;
   private readonly defaultDurationInSeconds = this.cacheConfig.timeExpiredInSeconds;
   
   getCacheData(key: string): T | null{
    const storageItem = this.storage.getItem(key);
    if(!storageItem){
      return null
    }
    
    const cacheData: CacheData<T> = JSON.parse(storageItem);
    if(this.hasExpired(cacheData.expiry)) {
      this.clearCachedItem(key);
      return null;
    }
    return cacheData.data
 
   }


   setCacheData(key: string, data: T, duration: number = this.defaultDurationInSeconds): void{
     const expiry =  new Date().getTime() + duration * 1000;
     const cacheData: CacheData<T> = { data, expiry };
     this.storage.setItem(key, JSON.stringify(cacheData));
   }

   clearCachedItem(key: string){
    this.storage.removeItem(key);
   }

   clearAllCache(){
    this.storage.clear();
   }

   hasExpired(timeInMilisencond: number){
     return new Date().getTime() > timeInMilisencond ;
   }
}
