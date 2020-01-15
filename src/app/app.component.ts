import { Component, OnInit, Output } from '@angular/core';

import { ProjectsService } from './projects/projects.service';
import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CI-test';
  constructor(private _projectsService: ProjectsService) {}



// Manipulations with input's placeholder
  public placeholderForInput = '';

  clearField() {
    this.placeholderForInput = '';
  }

// Number of projects to show
  public projectsCount: number = 2;

//Width and Margin for menu
  public menuWidth: string = '60px';
  public mainMargin: string = '60px';
  public headerMargin: string = '60px';

//Visibility for ngIf directory
  public menuVis: boolean = false;
  public projectsVis: boolean = false;
  public resultsVis:boolean = false;

// Object for User's Projects

  
  public projects;

  ngOnInit() {

  }

// Time manipulations

public averageTime;
public timeForShownProj: number;
public projWithoutTime: number;

timeAverage() {
  let result:number = 0;
  let NanCounter:number = 0;
  for (let i = 0; i < this.projectsCount; i++) {
    if (!this.projects[i].hours_spent) {
      NanCounter += 1;
      continue;
    }
    result += this.projects[i].hours_spent;
  }
  this.timeForShownProj = result;
  this.projWithoutTime = NanCounter;
}

timeCalculation(time) {
  if (time === 'Не указано') {
    return 0;
  }
  let timeArr = time.split('');
  for (let i = 0; i < timeArr.length; i += 1) {
    switch(timeArr[i]) {
      case 'd': 
      timeArr.splice(i, 1);
      let days = timeArr[i - 1];
      timeArr.splice(i - 1, 1, days * 8);
      break;

      case 'h':
      timeArr.splice(i, 1);
      break;

      case 'm': 
      timeArr.splice(i, 1);
      timeArr.splice(i - 2, 2)
      break;

      case ' ':
      timeArr.splice(i, 1);
    }
  }
  
  
  let count:number = 0;

  timeArr.forEach((value) =>  {
    if (value != ' ') {
      count += parseFloat(value);
    }
  })

  return count;
}

timeToRus = (time) => {
  let timeArr = time.split('');
  for (let i = 0; i < timeArr.length; i += 1) {
    switch(timeArr[i]) {
      case 'd': 
      timeArr.splice(i, 1, ' д');
      break;

      case 'h':
      timeArr.splice(i, 1, ' ч');
      break;

      case 'm': 
      timeArr.splice(i, 1, ' мин');
      break;
    }
  }
  return timeArr.join('');
}

// Application Start
 async appStart() {
    const usernameField = <HTMLInputElement>document.querySelector('.gitlab-login__input');
    if (usernameField.value === '') {
      this.placeholderForInput = 'Введите имя пользователя!';
      return;
    }
    this._projectsService.username = usernameField.value;

    const usernameName = document.querySelector('.name');
    const usernameAvatar = <HTMLImageElement>document.querySelector('.user__avatar')
    
    let userInfo = await this._projectsService.getUserInfo();

    if(userInfo[0] === undefined) {
      usernameField.value = '';
      usernameField.placeholder = 'Неверное имя пользователя!'
      return false;
    }

    this.resultsVis = false;

    usernameAvatar.src = userInfo[0].avatar_url;
    usernameName.textContent =  userInfo[0].name;
    let userId = userInfo[0].id;

    let projects = await this._projectsService.getProjects();
    this.projects = projects;

    let counter = 0;


    for (let project of await this.projects) {

      let projectId = project.id;

      let projectIssues = await this._projectsService.getProjectInfo(projectId);

      let projectTime;

      if(projectIssues[0] === undefined) {
        projectTime = 'Не указано';
      } else {
        let issueIid = projectIssues[0].iid;

        let issueInfo = await this._projectsService.getTimeStats(projectId, issueIid);

        if(issueInfo === undefined) {
          projectTime = 'Не указано';
        } else {
          projectTime = issueInfo['human_total_time_spent'];
        }
      }

      let rusTime = this.timeToRus(projectTime);
      this.projects[counter].time = rusTime;
      this.projects[counter].hours_spent = this.timeCalculation(projectTime);

      counter += 1;
    }


  }

// Toggling Menu
  toggleMenu() {
    if (this.menuWidth === '15%') {
      this.menuWidth = "60px";
      this.menuVis = false;
      this.mainMargin='60px'
      this.headerMargin = '60px'

    } else {
      this.menuWidth = '15%';
      this.menuVis = true;
      this.mainMargin = '15%';
      this.headerMargin = '15%'
    }
  }
// Showing Projects
  show() {
    if (this.projects === undefined) {
      return false;
    }
    this.resultsVis = false;
    let counter = <HTMLInputElement>document.querySelector('.projects-count');
    this.projectsCount = <number><unknown>counter.value;
    if (this.projectsCount < 2) {
      return false;
    }
    this.projectsVis = true;
  }


// Showing results
  showResults() {
    this.resultsVis = true;
  }

}