import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeService } from './employee.service';

const appRoutes: Routes = [
  { path: 'employees', component: EmployeeTableComponent },
  { path: 'employee-form', component: EmployeeFormComponent },
  { path: '', redirectTo: '/employees', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    EmployeeTableComponent,
    EmployeeFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes) // Configure the router
  ],
  providers: [
    EmployeeService,
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
