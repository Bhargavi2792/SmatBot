import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { AssignAgent } from '../Model/assignagent';


@Component({
  selector: 'app-assignagentpopup',
  templateUrl: './assignagentpopup.page.html',
  styleUrls: ['./assignagentpopup.page.scss'],
})
export class AssignagentpopupPage implements OnInit {
  public assignAgents : Array<AssignAgent> = [];
  constructor( private activepopup:PopoverController,
  public utilservice :UtilsService,private apiservice : ApiService) { 
    this.assignAgents = [];
  }
  
  async CloseActivepopup(new_user:any,type:string) {
    await this.activepopup.dismiss(new_user,type);
  }
  
  ngOnInit() {

  }


  AgentsAvailable(item){
    this.utilservice.showLoader("Please wait while we fetch your Agent Names...");
    this.apiservice.getAgentStatus().then((response)=> {
      console.log(response);
      this.utilservice.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in Agent Status",response);
        this.utilservice.showalert('Error','Something went wrong please try again after sometime','Ok');
      } else {
        console.log("Success response in Agent Status page",(response as any).data);
        this.assignAgents = response.data.full_name;
        console.log(this.assignAgents);
      }
    })
    this.CloseActivepopup('','AssignAgent');
  }
}
