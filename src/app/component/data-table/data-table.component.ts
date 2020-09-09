import { Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { DataTableService } from './data-table.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent} from './dialog/dialog.component'

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent {
  title: String = '';
  teamStats = new Map;
  items = new MatTableDataSource<Match>();
  displayedColumns: string[] = ['date', 'teams', 'score'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private tableService: DataTableService, public dialog: MatDialog) {
    tableService.getData()
    .subscribe(data => {
      this.title = data.name;
      data.rounds.map((week) => {
        week.matches.map(matches => {
          this.items.data.push(matches)
        })
      });
      this.items.data.map((item) => {
        let teamOne = this.teamStats.get(item.team1)
        let teamTwo = this.teamStats.get(item.team2)
        let team1 = null;
        let team2 = null;

        if( teamOne === undefined && teamTwo === undefined ) {
          team1 = new Stat();
          team2 = new Stat();
        } else if (teamOne === undefined && teamTwo !== undefined ) {
          team1 = new Stat();
          team2 = teamTwo;
        } else if (teamTwo === undefined && teamOne !== undefined ) {
          team1 = teamOne;
          team2 =  new Stat();
        } else {
          team1 = teamOne;
          team2 = teamTwo;
        }

        this.updateTeam(team1, team2, item);

      })
      this.items.paginator = this.paginator;
      },
      error => {
          console.log('Log the error here: ', error);
      });
  }
   
   updateTeam(team1, team2, item) {
    team1.teamPlayed()
    team2.teamPlayed()

    if(item.score.ft[0] > item.score.ft[1]) {
      team1.teamWon()
      team2.teamLost()
    } else if(item.score.ft[0] < item.score.ft[1]) {
      team2.teamWon()
      team1.teamLost()
    } else if (item.score.ft[0] == item.score.ft[1]) {
      team1.teamDrew()
      team2.teamDrew()
    }

    this.teamStats.set(item.team1, team1)
    this.teamStats.set(item.team2, team2)
   }

   showTeamStats(team) {
    const value = this.teamStats.get(team);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { value, team }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
   }

}

interface Match {
  date: string;
  team1: string;
  team2: string;
  score: object;
}


class Stat {
  private played: number = 0;
  private win: number = 0;
  private lose: number = 0;
  private draw: number = 0;
  teamPlayed() {
    this.played++;
  }
  teamWon(){
    this.win++;
  }
  teamLost(){
    this.lose++
  }
  teamDrew() {
    this.draw++
  }
  getStat() {
    return this.played, this.win, this.lose, this.draw
  }
}

