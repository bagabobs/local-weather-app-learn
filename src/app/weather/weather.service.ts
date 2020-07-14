import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { BehaviorSubject, Observable} from 'rxjs';
import {ICurrentWeather} from '../interfaces';
import {count, map, switchMap} from 'rxjs/operators';
import { PostalcodeService } from '../postalcode/postalcode.service';

interface ICurrentWeatherData {
  weather: [{
    description: string,
    icon: string
  }];
  main: {
    temp: number
  };
  sys: {
    country: string
  };
  dt: number;
  name: string;
}

export interface IWeatherService {
  readonly currentWeather$: BehaviorSubject<ICurrentWeather>;
  getCurrentWeather(search: string, country?: string): Observable<ICurrentWeather>;
  getCurrentWeatherByCoords(coords: Coordinates): Observable<ICurrentWeather>;
  updateCurrentWeather(search: string, country?: string): void;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements IWeatherService{
  readonly currentWeather$ = new BehaviorSubject<ICurrentWeather>({
    city: '--',
    country: '--',
    date: Date.now(),
    image: '',
    temperatur: 0,
    description: '',
  });
  constructor(private httpClient: HttpClient,
              private postalCodeService: PostalcodeService
  ) { }

  // getCurrentWeather(search: string, country?: string): Observable<ICurrentWeather> {
  //   let uriParams = new HttpParams();
  //   if (typeof search === 'string') {
  //     uriParams = uriParams.set('q',
  //       country ? `${search},${country}` : search
  //       );
  //
  //   } else {
  //     uriParams = uriParams.set('zip', 'search');
  //   }
  //
  //   return this.getCurrentWeatherHelper(uriParams);
  // }

  getCurrentWeather(search: string, country?: string): Observable<ICurrentWeather> {
    return this.postalCodeService.resolvePostalCode(search)
      .pipe(
        switchMap((postalCode) => {
          if (postalCode) {
            return this.getCurrentWeatherByCoords({
              latitude: postalCode.lat,
              longitude: postalCode.lng,
            } as Coordinates);
          } else {
            const uriParams = new HttpParams()
              .set('q', country ? `${search},${country}` : search);
            return this.getCurrentWeatherHelper(uriParams);
          }
        })
      );
  }

  private getCurrentWeatherHelper(uriParams: HttpParams): Observable<ICurrentWeather> {
    uriParams = uriParams.set('appid', environment.appId);
    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`, {params: uriParams}
      )
      .pipe(map(data => this.transformToICurrentWeather(data)));
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperatur: this.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description
    };
  }

  private convertKelvinToFahrenheit(temp: number) {
    return temp * 9 / 5 - 459.67;
  }

  getCurrentWeatherByCoords(coords: Coordinates): Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
      .set('lat', coords.latitude.toString())
      .set('lon', coords.longitude.toString());
    return this.getCurrentWeatherHelper(uriParams);
  }

  updateCurrentWeather(search: string, country?: string): void {
    this.getCurrentWeather(search, country)
      .subscribe(weather => this.currentWeather$.next(weather));
  }
}
