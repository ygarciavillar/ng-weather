import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { CacheService } from "./cache.service";
import { tap } from "rxjs/operators";


  export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const cacheService = inject(CacheService);
    const reqUrl = req.urlWithParams;
    const cachedResponse = cacheService.getCacheData(reqUrl);
    
    if(cachedResponse){
        return of(new HttpResponse({body: cachedResponse, status: 200, statusText: 'OK'}))
    }
 
    return next(req).pipe(tap( event => {
        if(event.type === HttpEventType.Response) {
            cacheService.setCacheData(reqUrl, event.body);
        }
    }));
  }