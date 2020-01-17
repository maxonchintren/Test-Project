import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  public username;
  public projectsList;
  
   constructor( private _http: HttpClient) { }

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


// Methods for Application start

public async userInfoFill() {
  // Getting user info and checking it's presence
  const usernameField = <HTMLInputElement>document.querySelector('.gitlab-login__input');
  if (usernameField.value === '') {
    usernameField.placeholder = 'Введите имя пользователя!';
  }

  this.username = usernameField.value;

  let userInfo = await this.getUserInfo();

  if(userInfo[0] === undefined) {
    usernameField.value = '';
    usernameField.placeholder = 'Неверное имя пользователя!'
    return false;
  }

  document.querySelector('form').reset()
  usernameField.placeholder = '';

  // Getting user photo and name
  const usernameName = document.querySelector('.name');
  const usernameAvatar = <HTMLImageElement>document.querySelector('.user__avatar')
  usernameAvatar.src = userInfo[0].avatar_url;
  usernameName.textContent =  userInfo[0].name;
}


public async projectsInfoFill() {
  let projects =  await this.getProjects();
  this.projectsList = projects;
}
  
 
}
