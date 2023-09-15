import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { TrialsStore } from './store/trials.store';
import { TrialsModule } from './trials.module';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FavoritesComponent,
      ],
      providers: [
        TrialsStore,
      ],
      imports: [
        HttpClientTestingModule,
        TrialsModule,
        BrowserAnimationsModule
      ]
    });
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
