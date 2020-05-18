import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { TeamsService } from '../teams.service';
import { Teams } from '../teams.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  templateUrl: './teams-create.component.html',
  styleUrls: ['./teams-create.component.css']
})
export class TeamsCreateComponent implements OnInit, OnDestroy {
  enteredName = '';
  enteredDescription = '';
  team: Teams;
  isLoading = false;
  private mode = 'create';
  private teamId: string;
  private authStatusSub: Subscription


  constructor(public teamsService: TeamsService, public route: ActivatedRoute, private authService: AuthService) {}

  latitude: Number = 0
  longitude: Number = 0
  geometry: any

  ngOnInit() {
    this.teamsService.getPosition().then(pos=>
      {
         console.log(`Position: ${pos.lng} ${pos.lat}`);
         this.latitude = pos.lat
         this.longitude = pos.lng
         this.geometry = {
           type: "Point",
           coords: [pos.lng, pos.lat],
           index: "2dsphere"
         }
      });
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    }
    );
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('teamId')) {
        this.mode = 'edit';
        this.teamId = paramMap.get('teamId');
        this.isLoading = true;
        this.teamsService.getTeam(this.teamId).subscribe(teamData => {
          this.isLoading = false;
          this.team = {
            id: teamData._id,
            name: teamData.name,
            description: teamData.description,
            sport: teamData.sport,
            location: teamData.location,
            latitude: teamData.latitude,
            longitude: teamData.longitude,
            geometry: teamData.geometry,
            creator: teamData.creator
          };
        });
      } else {
        this.mode = 'create';
        this.teamId = null;
      }
    });
  }

  onSaveTeams(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.teamsService.addTeams(form.value.name, form.value.description, form.value.sport,
        form.value.location, this.latitude, this.longitude, this.geometry);
    } else {
      this.teamsService.updateTeams(
        this.teamId,
        form.value.name,
        form.value.description,
        form.value.sport,
        form.value.location,
        this.latitude,
        this.longitude,
        this.geometry
      );
    }
    form.resetForm();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
