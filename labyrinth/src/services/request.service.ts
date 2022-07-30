import { Injectable } from '@angular/core';
import { CharInfo } from 'src/app/charInfo';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  playersDeath: CharInfo[] = [];

  constructor() { }

  async fillArrayPlayersOnline(data:any){
    const playersOnline = data.worlds.world.online_players
        for (let player of playersOnline) {
          if (player.level >= 300) {
            return player;
          }
        }
        for (let player of playersOnline) {
          await this.getLastDeathPlayer(player);
        }
  }

  async getLastDeathPlayer(player: any) {
    await fetch(`https://api.tibiadata.com/v3/character/${player}`)
      .then(response => response.text())
      .then(async result => {
        this.fillArryPlayersDeath(JSON.parse(result));
      })
      .catch(error => console.log('error', error));
  }

  fillArryPlayersDeath(data: any){
    if (data.characters.hasOwnProperty('deaths')) {
      const dateDeath = new Date(data.characters.deaths[0].time);
      const dateCheck = new Date();
      dateCheck.setMinutes(dateCheck.getMinutes() - 8)
      if (dateDeath < dateCheck) {
        const charInfo: CharInfo = {
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
      }
    }
    return;
  }
}
