import { Component, OnInit,Input } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-primaryheader',
  templateUrl: './primaryheader.component.html',
  styleUrls: ['./primaryheader.component.scss'],
})
export class PrimaryheaderComponent implements OnInit {
  @Input() headerTitle : string;
  @Input() showheaderTitle = true;
  @Input() showMainMenu = false;
  @Input() showcustomheaderTitle = false;
  constructor(public utils:UtilsService,
  private route : Router) {}
  
  ngOnInit() {
    console.log("header title",this.headerTitle);
  }

  ///*** Log Out Btn Action ***///
  logoutbtnAction() {
    this.utils.showconfirmationalert('Confirmation','Are you sure! You want to logout','Logout','Cancel').then(response => {
      if(response) {
        console.log("Ok button clicked");
        this.route.navigate(['login']);
      } else {
        console.log("Cancel button clicked");
      }
    });
  }

  
  backbtnAction() {
    this.route.navigate(['botslist']);
  }
  
}
