import {Component, OnDestroy, OnInit} from '@angular/core';
import { ICurrentWeather} from '../interfaces';
import {WeatherService} from '../weather/weather.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  current$: Observable<ICurrentWeather>;
  constructor(private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.current$ = this.weatherService.currentWeather$;
  }

  getOrdinal(date: number) {
    const n = new Date(date).getDate();
    return n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '';
  }

  ngOnDestroy(): void {
  }

}
