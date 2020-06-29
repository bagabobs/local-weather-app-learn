import { ICurrentWeather } from '../interfaces';
import { IWeatherService } from './weather.service';
import { Observable, of } from 'rxjs';

export const fakeWeather: ICurrentWeather = {
  city: 'bandung',
  country: 'ID',
  date: 1485789600,
  image: '',
  temperatur: 280.32,
  description: 'Panas'
}

export class WeatherServiceFake implements IWeatherService {
  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather> {
    return of(fakeWeather);
  }

}
