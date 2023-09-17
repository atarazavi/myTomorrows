import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SnackModule } from '#shared/components/snack/snack.module';
import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { FavoritesComponent } from './favorites.component';
import { TrialsStore } from '../../store/trials.store';


describe('FavoriteComponent : AddMode', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FavoritesComponent,
      ],
      providers: [
        TrialsStore,
      ],
      imports: [
        SnackModule,
        RouterTestingModule,
        HttpClientTestingModule,
        UnitTestingModule,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});