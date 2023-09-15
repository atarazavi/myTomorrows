import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsAllowStubDirective, NgxPermissionsModule, NgxPermissionsRestrictStubDirective } from 'ngx-permissions';
import { of } from 'rxjs';

import { SnackModule } from '#shared/components/snack/snack.module';
import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { ComponentPage } from '#shared/test/component-page';
import { Role } from '#features/roles/models/role.model';
import { RolesStore } from '#features/roles/store/roles.store';
import { UsersStore } from '#features/users/store/users.store';
import { EditUsersComponent } from './favorites.component';
import { DialogService } from '#shared/services/dialog/dialog.service';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { PermissionsLoaderService } from '#shared/services/permissions-loader/permissions-loader.service';

class EditUsersComponentPage extends ComponentPage<EditUsersComponent> {
  CancelButton() {
    return this.querySelector<HTMLButtonElement>('#cancel-user-form-button');
  }
  SubmitButton() {
    return this.querySelector<HTMLButtonElement>('#submit-user-form-button');
  }
  ClearButton() {
    return this.querySelector<HTMLButtonElement>('#clear-user-form-button');
  }
  UsernameInput() {
    return this.querySelector<HTMLInputElement>('#UserName');
  }
  FirstNameInput() {
    return this.querySelector<HTMLInputElement>('#FirstName');
  }
  LastNameInput() {
    return this.querySelector<HTMLInputElement>('#LastName');
  }
  EmailInput() {
    return this.querySelector<HTMLInputElement>('#Email');
  }
  UsernameInputErrorMessage() {
    return this.querySelector<HTMLElement>('#error-message-username');
  }
  UsernameADHint() {
    return this.querySelector<HTMLElement>('#hintActiveDirectoryEnabled');
  }
  FirstNameInputErrorMessage() {
    return this.querySelector<HTMLElement>('#error-message-firstname');
  }
  LastNameInputErrorMessage() {
    return this.querySelector<HTMLElement>('#error-message-lastname');
  }
  EmailInputErrorMessage() {
    return this.querySelector<HTMLElement>('#error-message-email');
  }
  ResetPasswordButton() {
    return this.querySelector<HTMLButtonElement>('#reset-user-password-button');
  }
  NotAccessibleRolesChips() {
    return this.querySelector<HTMLButtonElement>('.notAccessibleRolesChips .ids_chips .mat-mdc-chip-action-label');
  }
}

const fakeUser_EditMode = {
  id: 'valid-id',
  username: 'valid-username',
  firstname: 'valid-firstname',
  lastname: 'valid-lastname',
  email: 'email@email.com',
  roles: ['role-name-1'],
};
const fakeUser_ValidInput = {
  username: 'valid-username',
  firstname: 'valid-firstname',
  lastname: 'valid-lastname',
  email: 'email@email.com',
};
const fakeUser_InvalidUsername = {
  username: '1',
  firstname: fakeUser_EditMode.firstname,
  lastname: fakeUser_EditMode.lastname,
  email: fakeUser_EditMode.email,
};
const fakeUser_InvalidEmail = {
  username: fakeUser_EditMode.username,
  firstname: fakeUser_EditMode.firstname,
  lastname: fakeUser_EditMode.lastname,
  email: 'Invalid email',
};
const sampleRolesList: Role[] = [{
  id: 'role-id-1',
  name: 'role-name-1',
  claims: ['claim1'],
  scopes: ['scope1'],
  parentRoleId: 'rootId',
  hasAccess: true,
}, {
  id: 'role-id-2',
  name: 'role-name-2',
  claims: ['claim2'],
  scopes: ['scope2'],
  parentRoleId: 'role-id-1',
  hasAccess: false,
},
];

describe('EditUsersComponent : AddMode', () => {
  let component: EditUsersComponent;
  let fixture: ComponentFixture<EditUsersComponent>;
  let page: EditUsersComponentPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditUsersComponent,
        NgxPermissionsAllowStubDirective,
      ],
      imports: [
        SnackModule,
        RouterTestingModule,
        HttpClientTestingModule,
        UnitTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
      ],
      providers: [
        RolesStore,
        UsersStore,
        PermissionsLoaderService,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditUsersComponent);
    page = new EditUsersComponentPage(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT change the isEditMode when the history.state is NOT there!', () => {
    expect(component.isEditMode).toBeFalse();
  });

  it('should keep the FormControl value empty', () => {
    expect(component.form.value.username).toBeFalsy();
    expect(component.form.value.firstname).toBeFalsy();
    expect(component.form.value.lastname).toBeFalsy();
    expect(component.form.value.email).toBeFalsy();
  });

  it('inputs should be empty as its NOT in editMode', () => {
    expect(page.UsernameInput().value).toBe('');
    expect(page.FirstNameInput().value).toBe('');
    expect(page.LastNameInput().value).toBe('');
    expect(page.EmailInput().value).toBe('');
  });

  it('should call onCancel on Cancel-Button click', () => {
    spyOn(component, 'onCancel');
    page.CancelButton().click();
    expect(component.onCancel).toHaveBeenCalled();
  });

  it('should navigate to users list page on Cancel', () => {
    spyOn(component.router, 'navigate');
    component.onCancel();
    expect(component.router.navigate).toHaveBeenCalledWith(['users/list']);
  });

  it('should check validity of form inputs', () => {
    spyOn(component.router, 'navigate');
    component.onCancel();
    expect(component.router.navigate).toHaveBeenCalledWith(['users/list']);
  });

  it('should validate and IF the data is valid, change the form status as VALID data', () => {
    component.form.setValue(fakeUser_ValidInput);
    component.onSubmit();
    fixture.detectChanges();
    expect(component.form.status).toBe('VALID');
  });

  it('should validate and IF the username is NOT valid, change the form status as NOT VALID data', () => {
    component.form.setValue(fakeUser_InvalidUsername);
    component.onSubmit();
    fixture.detectChanges();
    expect(component.form.status).not.toBe('VALID');
  });

  it('should validate and IF the email is NOT valid, change the form status as NOT VALID data', () => {
    component.form.setValue(fakeUser_InvalidEmail);
    component.onSubmit();
    fixture.detectChanges();
    expect(component.form.status).not.toBe("VALID");
  });

  it('should load active directory enabled hint if *activeDirectoryEnabled* is true', () => {
    component.activeDirectoryEnabled = true;
    fixture.detectChanges();
    expect(page.UsernameADHint()).toBeTruthy();
  });

  it('should not load active directory enabled hint if *activeDirectoryEnabled* is false', () => {
    component.activeDirectoryEnabled = false;
    fixture.detectChanges();
    expect(page.UsernameADHint()).not.toBeTruthy();
  });
  //when the form elements and validations were defined by backend, other elements should be checked too!

});

describe('EditUsersComponent : EditMode', () => {
  let component: EditUsersComponent;
  let fixture: ComponentFixture<EditUsersComponent>;
  let page: EditUsersComponentPage;
  let dialogServiceSpy: Spy<DialogService>;

  beforeEach(async () => {
    dialogServiceSpy = createSpyFromClass(DialogService, ['openCustomConfirmDialog']);
    dialogServiceSpy.openConfirmDialog.and.returnValue(of(''));
    window.history.pushState(fakeUser_EditMode, '');
    await TestBed.configureTestingModule({
      declarations: [
        EditUsersComponent,
        NgxPermissionsAllowStubDirective, //as a result, it's assumed the permissions are allocated
      ],
      imports: [
        SnackModule,
        RouterTestingModule,
        HttpClientTestingModule,
        UnitTestingModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPermissionsModule.forRoot(),
      ],
      providers: [
        RolesStore,
        UsersStore,
        PermissionsLoaderService,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        { provide: DialogService, useValue: dialogServiceSpy },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditUsersComponent);
    page = new EditUsersComponentPage(fixture);
    component = fixture.componentInstance;
    component.roles$ = of(sampleRolesList);
    fixture.detectChanges();
  });

  it('should change the isEditMode when the history.state is there!', () => {
    expect(component.isEditMode).toBeTrue();
    expect(component.toBeEditedUser.id).toBe(fakeUser_EditMode.id);
  });

  it('should load data to the FormControl', () => {
    expect(component.form.value.username).toBe(fakeUser_EditMode.username);
    expect(component.form.value.firstname).toBe(fakeUser_EditMode.firstname);
    expect(component.form.value.lastname).toBe(fakeUser_EditMode.lastname);
    expect(component.form.value.email).toBe(fakeUser_EditMode.email);
  });

  it('should load data into the input values', () => {
    expect(page.UsernameInput().value).toBe(fakeUser_EditMode.username);
    expect(page.FirstNameInput().value).toBe(fakeUser_EditMode.firstname);
    expect(page.LastNameInput().value).toBe(fakeUser_EditMode.lastname);
    expect(page.EmailInput().value).toBe(fakeUser_EditMode.email);
  });

  it('should clear input values on click on Clear button', () => {
    page.ClearButton().click();
    fixture.detectChanges();
    expect(page.UsernameInput().value).toBe('');
    expect(page.FirstNameInput().value).toBe('');
    expect(page.LastNameInput().value).toBe('');
    expect(page.EmailInput().value).toBe('');
  });

  it('should fill rolesDropDownList with response data of API FILTERED based on hasAccess === true', () => {
    spyOn(component, 'loadCurrentRoles');

    const observerSpyRoles = subscribeSpyTo(component.roles$);
    const restructuredData = observerSpyRoles.getLastValue()?.map(
      (each, index) => { return { 'id': index, 'itemName': each.name } }
    );
    expect(restructuredData).not.toBeUndefined();
    if (restructuredData) {
      expect(component.rolesDropDownListAccessible[0].itemName).toEqual('role-name-1');
    }
  });

  it('should check which roles the toBeEditedRole already has and fill the selectedClaimsDropDown with the proper structure ', () => {
    expect(component.selectedRolesDropDown).toEqual([{ id: 0, itemName: 'role-name-1' }])
  });

  it('should list the roles with false hasAccess in the mat-chip-listbox.notAccessibleRolesChips', () => {
    expect(page.NotAccessibleRolesChips().innerText).toEqual('role-name-2');
  });

  it('should open dialog box on click on Reset Password Button', () => {
    page.ResetPasswordButton().click();
    fixture.detectChanges();
    expect(dialogServiceSpy.openCustomConfirmDialog).toHaveBeenCalled();
  });

  it('should call ResetPasswordUser$ if user select *Confirm and keep editing user*', () => {
    spyOn(component.usersStore, 'ResetPasswordUser$');
    dialogServiceSpy.openCustomConfirmDialog.and.returnValue(of('confirm'));

    page.ResetPasswordButton().click();
    fixture.detectChanges();

    expect(component.usersStore.ResetPasswordUser$).toHaveBeenCalledWith(fakeUser_EditMode);
  });

  it('should call ResetPasswordUser$ & route to users/list if user select *Confirm and close*', () => {
    spyOn(component.usersStore, 'ResetPasswordUser$');
    spyOn(component.router, 'navigate');
    dialogServiceSpy.openCustomConfirmDialog.and.returnValue(of('confirmAndClose'));

    page.ResetPasswordButton().click();
    fixture.detectChanges();

    expect(component.usersStore.ResetPasswordUser$).toHaveBeenCalledWith(fakeUser_EditMode);
    expect(component.router.navigate).toHaveBeenCalledWith(['users/list']);
  });

});


describe('EditUsersComponent : EditMode : If the User DOES NOT have permissions ', () => {
  let component: EditUsersComponent;
  let fixture: ComponentFixture<EditUsersComponent>;
  let page: EditUsersComponentPage;
  let dialogServiceSpy: Spy<DialogService>;

  beforeEach(async () => {
    dialogServiceSpy = createSpyFromClass(DialogService, ['openCustomConfirmDialog']);
    dialogServiceSpy.openConfirmDialog.and.returnValue(of(''));
    window.history.pushState(fakeUser_EditMode, '');
    await TestBed.configureTestingModule({
      declarations: [
        EditUsersComponent,
        NgxPermissionsRestrictStubDirective, //as a result, it's assumed the permissions are not allocated
      ],
      imports: [
        SnackModule,
        RouterTestingModule,
        HttpClientTestingModule,
        UnitTestingModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPermissionsModule.forRoot(),
      ],
      providers: [
        RolesStore,
        UsersStore,
        PermissionsLoaderService,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        { provide: DialogService, useValue: dialogServiceSpy },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditUsersComponent);
    page = new EditUsersComponentPage(fixture);
    component = fixture.componentInstance;
    component.roles$ = of(sampleRolesList);
    fixture.detectChanges();
  });


  it('should Not show reset password button ', () => {
    expect(page.ResetPasswordButton()).toBeFalsy();
  });

});