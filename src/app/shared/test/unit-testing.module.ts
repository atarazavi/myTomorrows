import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '#shared/shared.module';


const MODULE_IMPORTS = [
    CommonModule,
    NoopAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterTestingModule,
];

const MODULE_EXPORTS = [
    SharedModule,
];
const MODULE_PROVIDERS = [
    { provide: APP_BASE_HREF, useValue: '/' },
];

@NgModule({
    imports: [
        ...MODULE_IMPORTS,
    ],
    exports: MODULE_EXPORTS,
    providers: MODULE_PROVIDERS,
})

@NgModule({
    imports: MODULE_IMPORTS,
    exports: MODULE_EXPORTS,
    providers: MODULE_PROVIDERS,
})
export class UnitTestingModule { }
