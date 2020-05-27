import { Teams } from "./teams.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/Operators";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class TeamsService {
  private teams: Teams[] = [];
  private teamsUpdated = new Subject<Teams[]>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
          resolve({lng: resp.coords.longitude, lat: (resp.coords.latitude)});
        },
        err => {
          reject(err);
        });
    });
  }

  getTeams(longitude, latitude, miles) {
    const opts = { params: new HttpParams({fromString: `lng=${longitude}&lat=${latitude}&mil=${miles}`}) };
    this.http.get<{message: string, teams: any}>(
      'http://localhost:3000/api/teams', opts
    )
    .pipe(map((teamsData) => {
      return teamsData.teams.map(teams => {
        return {
          name: teams.name,
          description: teams.description,
          sport: teams.sport,
          id: teams._id,
          location: teams.location,
          contact: teams.contact,
          creator: teams.creator
        };
      });
    }))
    .subscribe(transformedTeams => {
      this.teams = transformedTeams;
      this.teamsUpdated.next([...this.teams]);
    });
  }

  getTeamsUpdateListener() {
    return this.teamsUpdated.asObservable();
  }

  getTeam(id: string) {
    return this.http.get<{ _id: string, name: string, description: string, sport: string, location: string,
      contact: string, latitude: Number, longitude: Number, geometry: any, creator:  string }>(
      "http://localhost:3000/api/teams/" + id);
  }

  addTeams(name: string, description: string, sport: string, location: string, contact: string,
    latitude: Number, longitude: Number, geometry: any) {
    const teams: Teams = { id: null, name: name, description: description, sport: sport, location: location,
    contact: contact, latitude: latitude, longitude: longitude, geometry: geometry, creator: null };
    this.http
    .post<{message: string, teamsId: string }>(
      'http://localhost:3000/api/teams',
       teams
    )
    .subscribe(responseData => {
      const id = responseData.teamsId;
      teams.id = id;
      this.teams.push(teams);
      this.teamsUpdated.next([...this.teams]);
      this.router.navigate(["/list"]);
    });
  }

  updateTeams(id: string, name: string, description: string, sport: string, location: string,
    contact: string, latitude: Number, longitude: Number, geometry: any) {
    const team: Teams = { id: id, name: name, description: description, sport: sport, location: location,
    contact: contact, latitude: latitude, longitude: longitude, geometry: geometry, creator: null };
    this.http
    .put("http://localhost:3000/api/teams/" + id, team)
    .subscribe(response => {
      const updatedTeams = [...this.teams];
      const oldTeamIndex = updatedTeams.findIndex(t => t.id === team.id);
      updatedTeams[oldTeamIndex] = team;
      this.teams = updatedTeams;
      this.teamsUpdated.next([...this.teams]);
      this.router.navigate(["/list"]);
    });
  }

  deleteTeams(teamsId: string) {
    this.http.delete("http://localhost:3000/api/teams/" + teamsId)
      .subscribe(() => {
        const updatedTeams = this.teams.filter(teams => teams.id !== teamsId);
        this.teams = updatedTeams;
        this.teamsUpdated.next([...this.teams]);
      });
  }
}
