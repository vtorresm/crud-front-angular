import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GameService } from 'src/app/services/game.service';
import { Game } from '../../interfaces/Game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  error: string = '';
  subscriptions: Subscription[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.getGames();
  }

  getGames(): void {
    const sub = this.gameService
      .getGames()
      .subscribe({
        next: (res) => (this.games = res),
        error: (err) => (this.error = 'Error loading games'),
      });
    this.subscriptions.push(sub);
  }

  deleteGame(id: number): void {
    const sub = this.gameService.deleteGame(id).subscribe({
      next: (res) => {
        console.log(res);
        this.games = this.games.filter((game) => game.id !== id);
      },
      error: (err) => (this.error = 'Error deleting game'),
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}