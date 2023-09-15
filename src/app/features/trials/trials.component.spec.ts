import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { TrialsComponent } from './trials.component';
import { SnackService } from '#shared/components/snack/snack.service';
import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { ComponentPage } from '#shared/test/component-page';
import { CreateKeyboardEvent } from '#shared/test/keyboard-event-stub';
import { TrialsStore } from './store/trials.store';
import { Study } from './models/trial.model';
import { TrialsModule } from './trials.module';

class TrialsComponentPage extends ComponentPage<TrialsComponent> {
  FilterInput() {
    return this.querySelector<HTMLElement>('#filterUsersTableInput');
  }
  FirstUserTableRow() {
    return this.querySelector<HTMLElement>('tr:first-of-type td');
  }
}

describe('TrialsComponent', () => {
  let component: TrialsComponent;
  let fixture: ComponentFixture<TrialsComponent>;
  let snackServiceMock: Spy<SnackService>;
  let page: TrialsComponentPage;
  let testStore: TrialsStore;
  const mockRouter = createSpyFromClass(Router);
  let SampleUsersData: Study[] = [{
    id: 'id-test-1',
    username: 'username-test-1',
    firstname: 'firstname-test-1',
    email: 'test@test.com',
    lastname: 'lastname-test-1',
    telephone: '+4367764060286',
    roles: ['role'],
    canDelete: false,
  }, {
    id: 'id-test-2',
    username: 'username-test-2',
    firstname: 'firstname-test-2',
    lastname: 'lastname-test-2',
    email: 'test@test.com',
    telephone: '+4367764060286',
    roles: ['role-test-2'],
    canDelete: true,
  }];
  const mockKeyboardEvent: KeyboardEvent = CreateKeyboardEvent('test-2');
  beforeEach(async () => {

    snackServiceMock = createSpyFromClass(SnackService);
    await TestBed.configureTestingModule({
      declarations: [
        TrialsComponent,
      ],
      providers: [
        TrialsStore,
        { provide: SnackService, useValue: snackServiceMock },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        HttpClientTestingModule,
        UnitTestingModule,
        TrialsModule,
        NoopAnimationsModule,
        UnitTestingModule,
      ],
    })
      .compileComponents();

    testStore = TestBed.inject(TrialsStore);
    testStore.trialsList = SampleUsersData;
    fixture = TestBed.createComponent(TrialsComponent);
    component = fixture.componentInstance;
    page = new TrialsComponentPage(fixture);
    component.trials$ = of(SampleUsersData);
    fixture.detectChanges();
  });

  it('should create', () => {
    testStore.loadTrials$();
    expect(component).toBeTruthy();
    component.loadData();
    const observerSpyUsers = subscribeSpyTo(component.trials$);
    const observerSpyUsersResponse = observerSpyUsers.getLastValue();

    if (observerSpyUsersResponse) {
      expect(component.dataSource.filteredData).toBe(observerSpyUsersResponse);
    }
  });

  it('should filter data when something is written in filter input', () => {
    expect(component.dataSource.filteredData.length).toBe(2);

    component.applyFilter(mockKeyboardEvent);
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(1);
  });

  it('should redirect to user/add page on redirectToAddUserPage call', () => {
    component.redirectToAddUserPage();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['users/add']);
  });

  it('should call applyFilter when something is written in filter input', () => {
    spyOn(component, 'applyFilter');
    page.FilterInput().dispatchEvent(new Event('keyup'));
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should have been sorted by default, by username, ascending', () => {
    expect(page.FirstUserTableRow().textContent).toContain('username-test-1');
  })

});
