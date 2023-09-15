import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { UsersStore } from './trials.store';
import { UsersService } from '../services/trials.service';
import { AddUserService } from '../services/add-user.service';
import { NewUser } from '../models/newUser.model';
import { SnackModule } from '#shared/components/snack/snack.module';
import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { SnackService } from '#shared/components/snack/snack.service';
import { User } from '../models/trial.model';

describe('Users Store API Call', () => {
  let backendService: Spy<UsersService>;
  let addUserService: Spy<AddUserService>;
  let testStore: UsersStore;
  let snackServiceMock: Spy<SnackService>;
  const mockRouter = createSpyFromClass(Router);
  const sampleUsersResponse: User[] = [
    {
      id: 'id-1',
      username: 'username-1',
      firstname: 'firstname-1',
      lastname: 'lastname-1',
      email: 'test@test.com',
      telephone: '+4367764060286',
      roles: ['role-1'],
    },
    {
      id: 'id-2',
      username: 'username-2',
      firstname: 'firstname-2',
      lastname: 'lastname-2',
      email: 'test@test.com',
      telephone: '+4367764060286',
      roles: ['role-2'],
    },
  ];
  const toBeAddedUserSample: NewUser = {
    username: 'username-1',
    firstname: 'firstname-1',
    lastname: 'lastname-1',
    email: 'test@test.com',
    telephone: '+4367764060286',
    roles: ['role-1'],
  }
  beforeEach(() => {
    snackServiceMock = createSpyFromClass(SnackService);
    backendService = createSpyFromClass(UsersService, ['get']);
    addUserService = createSpyFromClass(AddUserService, ['post']);
    TestBed.configureTestingModule({
      imports: [SnackModule, HttpClientTestingModule, UnitTestingModule],
      providers: [
        UsersStore,
        { provide: UsersService, useValue: backendService },
        { provide: AddUserService, useValue: addUserService },
        { provide: SnackService, useValue: snackServiceMock },
        { provide: Router, useValue: mockRouter },
      ],
    });
    testStore = TestBed.inject(UsersStore);
  });

  //  - GET
  it('should update users$ by backend successful response value when service calling is successful with 200 status', () => {
    backendService.get.and.returnValue(observableOf(sampleUsersResponse));
    testStore.loadUsers$();

    const observerSpyUsers = subscribeSpyTo(testStore.users$);
    const observerSpyUsersError = subscribeSpyTo(testStore.usersError$);

    expect(observerSpyUsers.getLastValue()?.length).toBe(2);
    expect(observerSpyUsersError.getLastValue()).toBeNull();
  });

  it('should update the usersError$ with HttpError', () => {
    backendService.get.and.throwWith(observableOf(ErrorEvent));
    testStore.loadUsers$();

    const observerSpyUsersError = subscribeSpyTo(testStore.usersError$);

    expect(observerSpyUsersError.getLastValue()).not.toBeNull();
  });

  //  - DELETE
  it('should delete the user if API works and update the usersList', () => {
    backendService.get.and.returnValue(observableOf(sampleUsersResponse));
    testStore.loadUsers$();

    backendService.delete.and.returnValue(observableOf(''));
    testStore.deleteUser$(sampleUsersResponse[0]);
    const observerSpyUsers = subscribeSpyTo(testStore.users$);

    expect(observerSpyUsers.getLastValue()?.length).toBe(1);
    expect(
      observerSpyUsers
        .getLastValue()
        ?.find((eachUser) => eachUser.id === 'id-2')
    ).toBeTruthy();
    expect(snackServiceMock.showSnackBar).toHaveBeenCalled();
  });

  it('should Error in snackbar when there are problem and HttpError', () => {
    backendService.delete.and.throwWith(observableOf(ErrorEvent));
    testStore.deleteUser$(sampleUsersResponse[0]);
    expect(snackServiceMock.showErrorSnackBar).toHaveBeenCalled();
  });

  //  - EDIT
  it('should edit the user if API works(200) and redirect to listing page', () => {
    backendService.put.and.returnValue(observableOf(''));
    const editedSampleUser = {
      ...sampleUsersResponse[0],
      username: 'name-1-edited',
    };
    testStore.editUser$(editedSampleUser);

    expect(snackServiceMock.showSnackBar).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['users/list']);
  });

  it('should update userEditError with HttpError in case of Error in API call & show error also in snack bar', () => {
    backendService.put.and.throwWith(observableOf(ErrorEvent));
    const editedSampleUser = {
      ...sampleUsersResponse[0],
      name: 'name-1-edited',
    };
    testStore.editUser$(editedSampleUser);

    const observerSpyUserEditError = subscribeSpyTo(testStore.userEditError$);

    expect(observerSpyUserEditError.getLastValue()).not.toBeNull();
    expect(snackServiceMock.showErrorSnackBar).toHaveBeenCalled();
  });

  //  - ADD
  it('should add the user if API works(200) and redirect to listing page', () => {
    addUserService.postWithoutId.and.returnValue(observableOf(''));
    testStore.addUser$(toBeAddedUserSample);
    expect(snackServiceMock.showSnackBar).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['users/list']);
  });

  it('should update userAddError with HttpError in case of Error in API call & show error also in snack bar', () => {
    addUserService.postWithoutId.and.throwWith(observableOf(ErrorEvent));
    testStore.addUser$(toBeAddedUserSample);

    const observerSpyUserAddError = subscribeSpyTo(testStore.userAddError$);
    expect(observerSpyUserAddError.getLastValue()).not.toBeNull();
    expect(snackServiceMock.showErrorSnackBar).toHaveBeenCalled();
  });
});
