import { Component, OnInit, Input } from '@angular/core';
import { ProjectsService } from '../projects/projects.service';

interface ExportData {
  name: string;
  average_hours_spent: string | number;
  efficiency?: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})


export class ResultsComponent implements OnInit {

  @Input() projects;
  @Input() projectsCount;
  @Input() timeForShownProj;
  @Input() projWithoutTime;

  public overallTime:number;
  

  // Posting data (is never used and exists here only for example)
  createExportData(): ExportData  {
    return  {
      name: this._projectsService.username,
      average_hours_spent: this.averageTime(),
      efficiency: this.isEfficient()
    }
  }

  exportUserData() {
    let userExportData:object = this.createExportData();
    this._projectsService.postData(userExportData);
  }

  constructor(private _projectsService : ProjectsService) {
    
   }

   //Calculating some time
   averageTime() {
     let divisor = this.projectsCount - this.projWithoutTime;
     if(divisor <= 0) {
      return 'Кажется вы не вводили затраченное время. Используйте команду "/spend <time>" на Gitlab и попробуйте снова!'
    }
     return Math.round(this.timeForShownProj / divisor);
   }

   isEfficient():string {
     let averageTime = this.averageTime();
     if (typeof averageTime === 'string') {
       return '';
     }

     if(averageTime <= 10) {
       return ('Вы эталон эффетивности в разработке!')
     } else if (averageTime > 10 && averageTime <= 15) {
       return 'А вы довольно неплохи!'
     } else if (averageTime > 15 && averageTime <= 20) {
       return 'Результаты не утешают, но зато вам есть еще куда расти!'
     } else {
       return 'Боюсь вас огорчить, но результаты совсем уж далеки от идеала. Вам стоит уделить больше времени собственному развитию!'
     }
   }

// Getting overall time
   ngOnInit():void {
    let result:number = 0;
    for (let project of this.projects) {
      if (!project.hours_spent) {
        continue;
      }
      result += project.hours_spent;
    }
    this.overallTime = result; 
  }

  

}
