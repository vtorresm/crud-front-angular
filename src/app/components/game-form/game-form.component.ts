import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { Game } from 'src/app/interfaces/Game';
import { GameService } from 'src/app/services/game.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css'],
})
export class GameFormComponent implements OnInit, OnDestroy {
  game: any;
  gameForm: FormGroup;
  edit: boolean = false;
  error: string = '';

  constructor(
    private gameService: GameService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.gameForm = new FormGroup({
      id: new FormControl(null),
      gameName: new FormControl('', Validators.required),
      gamingPlatform: new FormControl('', Validators.required),
      characterUsed: new FormControl('', Validators.required),
      developerStudio: new FormControl('', Validators.required),
      highScore: new FormControl(0.0, Validators.required),
      //releaseDate: new FormControl(new Date(), Validators.required),
      price: new FormControl(0.0, Validators.required),
      genre: new FormControl('', Validators.required),
    });
  }

  async ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      try {
        const game = await this.gameService
          .getGame(params['id'])
          .pipe(first())
          .toPromise();
        if (game) {
          this.gameForm.setValue(game);
          this.edit = true;
        } else {
          throw new Error('Game not found');
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          this.error = err.message || 'Error loading game';
        }
      }
    }
  }

  async submitGame() {
    try {
      const res = await this.gameService
        .createGame(this.gameForm.value)
        .toPromise();
      console.log(res);
      this.router.navigate(['/']);
    } catch (err) {
      console.error(err);
      this.error = 'Saved Game Error';
    }
  }

async updateGame(id: string) {
  try {
    const res = await this.gameService
      .updateGame(id, this.gameForm.value)
      .toPromise();
    console.log(res);
    this.router.navigate(['/game']);
  } catch (err) {
    console.error(err);
    this.error = 'Update Game Error';
  }
}

  ngOnDestroy() {}
}
