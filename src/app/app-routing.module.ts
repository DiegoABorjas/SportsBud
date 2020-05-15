import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginComponent } from "./authentication/login/login.component";
import { TeamsCreateComponent } from './teams/teams-create/teams-create.component';
import { TeamsListComponent } from './teams/teams-list/teams-list.component';
import { AuthGuard } from './authentication/auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list', component: TeamsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: TeamsCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:teamId', component: TeamsCreateComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
