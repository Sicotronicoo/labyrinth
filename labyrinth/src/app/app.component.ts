import { Component, OnInit } from '@angular/core';
import { CharInfo } from './charInfo'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  init = true;
  deaths = 0;
  players = [];
  playersDeath: CharInfo[] = [];
  world: string = "Antica";

  constructor(
  ) { }

  stop() {    
    this.init = false;
  }


   getSelected(value:string) {
       this.world = value;       
   }

  async infiniteLoop() {
    await this.playersOnline();
  }

  async playersOnline() {
    this.init = true;
    let players: any = [];
    const deaths: number = 0;
    await fetch(`https://api.tibiadata.com/v3/world/${this.world}`)
      .then(response => response.text())
      .then(async result => {
        const data = JSON.parse(result);
        const playersOnline = data.worlds.world.online_players
        for (let player of playersOnline) {
          if (player.level >= 300) {
            players.unshift(player.name);
          }
        }
        //console.log(players);
        for (let player of players) {
          await this.getLastDeathPlayer(player);
        }
        console.log("Analizados " + players.length + " jugadores, muertos recientemente: " + deaths);
        this.init === true ? this.infiniteLoop() : this.init = false;
      })
      .catch(error => console.log('error', error));
  }

  async getLastDeathPlayer(player: any) {
    await fetch(`https://api.tibiadata.com/v3/character/${player}`)
      .then(response => response.text())
      .then(async result => {
        const data = JSON.parse(result);
        this.fillArryPlayersDeath(data);
      })
      .catch(error => console.log('error', error));
  }

  fillArryPlayersDeath(data: any) {
    if (data.characters.hasOwnProperty('deaths')) {
      const dateDeath = new Date(data.characters.deaths[0].time);
      const dateCheck = new Date();
      dateCheck.setMinutes(dateCheck.getMinutes() - 4)
      if (dateDeath > dateCheck) {
        const charInfo = {
          name: data.characters.character.name,
          level: data.characters.character.level,
          vocation: data.characters.character.vocation,
          residence: data.characters.character.residence,
          guild: data.characters.character.guild.name,
          assasin: data.characters.deaths[0].killers[0].name,
          hourDeath: data.characters.deaths[0].time,
        }
        for (let i = 0; i < this.playersDeath.length; i++) {
          if (this.playersDeath[i].name === data.characters.character.name && this.playersDeath[i].hourDeath === data.characters.deaths[0].time) {
            return;
          }
        }
        this.playersDeath.push(charInfo);
        return
      }
    }
  }
}

