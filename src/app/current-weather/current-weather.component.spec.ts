import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeatherComponent } from './current-weather.component';
import { WeatherService } from '../weather/weather.service';
import { injectSpy } from 'angular-unit-test-helper';
import { of } from 'rxjs';
import { fakeWeather } from '../weather/weather.service.fake';

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;
  let weatherServiceMock: jasmine.SpyObj<WeatherService>;

  beforeEach(async(() => {
    const weatherServiceSpy = jasmine.createSpyObj(
      'WeatherService',
      ['getCurrentWeather'],
    );

    TestBed.configureTestingModule({
      declarations: [ CurrentWeatherComponent ],
      providers: [{
        provide: WeatherService, useValue: weatherServiceSpy
      }],
    })
    .compileComponents();
    weatherServiceMock = injectSpy(WeatherService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeatherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    weatherServiceMock.getCurrentWeather.and.returnValue(of());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create only one', () => {
    weatherServiceMock.getCurrentWeather.and.returnValue(of());

    fixture.detectChanges();

    expect(weatherServiceMock.getCurrentWeather).toHaveBeenCalledTimes(1);
  });

  it('should apply fake weather bandung', () => {
    weatherServiceMock.getCurrentWeather.and.returnValue(of(fakeWeather));

    fixture.detectChanges();

    expect(component.current.city).toEqual('bandung');
    expect(component.current.country).toEqual('ID');
  });

});
