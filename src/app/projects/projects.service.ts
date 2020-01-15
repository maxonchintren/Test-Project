import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  public username;
  public projectsList;
  
  

  //Get requests

 public async getUserInfo() {
    try {
      let userInfo =  await this._http.get(`https://gitlab.com/api/v4/users?username=${this.username}`).toPromise();
      return userInfo;
  } catch (err) {
    console.log(err)
  }
  }

  public async getProjects() {
    try {
      let projectsList = await this._http.get(`https://gitlab.com/api/v4/users/${this.username}/projects`).toPromise();
      return projectsList;
    } catch (err) {
      console.log(err)
    }
  }



  public async getProjectInfo(projectId) {
    try {
      let projectInfo = await this._http.get(`https://gitlab.com/api/v4/projects/${projectId}/issues`).toPromise()
      return projectInfo;
    } catch (err) {
      console.log(err)
    }
  }

  public async getTimeStats(projectId, issueId) {
    try {
      let projectTime = await this._http.get(`https://gitlab.com/api/v4/projects/${projectId}/issues/${issueId}/time_stats`).toPromise();
      return projectTime;
    } catch (err) {
      console.log(err)
    }
  }
// Kind of posting data to server
  public postData(obj) {
    return this._http.post(`https://gitlab.com/api/v4/users?username=${this.username}`, obj)
  }
  constructor( private _http: HttpClient) { }
}
