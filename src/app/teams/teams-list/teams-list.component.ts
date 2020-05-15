import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { Teams } from "../teams.model";
import { TeamsService } from "../teams.service";
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.css']
})

export class TeamsListComponent implements OnInit, OnDestroy {

  isLoading = false;
  teams: Teams[] = [];
  userIsAuthenticated = false;
  userId: string;
  private teamsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public teamsService: TeamsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.teamsService.getTeams();
    this.userId = this.authService.getUserId();
    this.teamsSub = this.teamsService.getTeamsUpdateListener()
    .subscribe((teams: Teams[]) => {
      this.isLoading = false;
      this.teams = teams;
    });
  this.userIsAuthenticated = this.authService.getIsAuth();
  this.authStatusSub = this.authService
  .getAuthStatusListener()
  .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(teamsId: string) {
    this.teamsService.deleteTeams(teamsId);
  }

  ngOnDestroy() {
    this.teamsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
