import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/services/request.service';
import { CharInfo } from './charInfo'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  init = true;
  deaths = 0;
  playersDeath = this.requestService.playersDeath;
  world: string = "Antica";
  playersOn: any = [];


  constructor(
    private requestService: RequestService,
  ) { }

  stop() {    
    this.init = false;
  }

  getSelected(value:string) {
       this.world = value;       
   }

  async infiniteLoop() {
    await this.scanLastDeathPlayers();
  }

  async scanLastDeathPlayers() {
    this.init = true;
    await fetch(`https://api.tibiadata.com/v3/world/${this.world}`)
      .then(response => response.text())
      .then(async result => {
        this.playersOn.push(await this.requestService.fillArrayPlayersOnline(JSON.parse(result)));        
        console.log("Analizados " + this.playersOn.length + " jugadores.");
        this.init === true ? this.infiniteLoop() : this.init = false;
      })
      .catch(error => console.log('error', error));
  }
  
}

