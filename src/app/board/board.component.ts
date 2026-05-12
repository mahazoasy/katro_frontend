import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { Game, Pit } from '../models/game.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  game$: Observable<Game | null>;
  selectedPit: Pit | null = null;
  errorMessage: string | null = null;
  debug = true; // Mettre à false pour désactiver l'affichage debug

  constructor(private gameService: GameService) {
    this.game$ = this.gameService.game$;
  }

  getRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.errorMessage = null;
    this.selectedPit = null;
    this.gameService.reset();
    this.gameService.createGame().subscribe({
      next: () => {
        console.log('Partie créée avec succès');
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer une partie. Vérifiez le serveur.';
      }
    });
  }

  // Getters pour les rangées (optionnels, non utilisés dans le template actuel)
  getPlayer1Outer(game: Game): Pit[] {
    return game.pits?.filter(p => p.owner === 1 && p.row === 'outer')
      .sort((a, b) => a.position - b.position) || [];
  }

  getPlayer1Inner(game: Game): Pit[] {
    return game.pits?.filter(p => p.owner === 1 && p.row === 'inner')
      .sort((a, b) => a.position - b.position) || [];
  }

  getPlayer2Inner(game: Game): Pit[] {
    return game.pits?.filter(p => p.owner === 2 && p.row === 'inner')
      .sort((a, b) => a.position - b.position) || [];
  }

  getPlayer2Outer(game: Game): Pit[] {
    return game.pits?.filter(p => p.owner === 2 && p.row === 'outer')
      .sort((a, b) => a.position - b.position) || [];
  }

  getMandatoryId(game: Game): string | null {
    if (!game) return null;
    const player = game.currentPlayer;
    const id = player === 1 ? game.lastPitId1 : game.lastPitId2;
    return id ? String(id) : null;
  }

  isMandatoryPit(pit: Pit, game: Game): boolean {
    if (!game || !pit) return false;
    const id = this.getMandatoryId(game);
    return id !== null && String(pit.id) === id;
  }

  isLastPit(pit: Pit, game: Game): boolean {
    if (!game || !pit) return false;
    const id1 = game.lastPitId1 ? String(game.lastPitId1) : null;
    const id2 = game.lastPitId2 ? String(game.lastPitId2) : null;
    return String(pit.id) === id1 || String(pit.id) === id2;
  }

  // ⚠️ MODIFICATION : Vérifier que le trou bleu a bien des graines > 0
  hasMandatoryPit(game: Game): boolean {
    const id = this.getMandatoryId(game);
    if (!id) return false;
    const pit = game.pits.find(p => String(p.id) === id);
    return pit ? pit.seeds > 0 : false;
  }

  // ⚠️ MODIFICATION : Ne contraindre que si le trou bleu existe et a des graines
  selectPit(pit: Pit, game: Game) {
    if (!game || game.status === 'finished') return;
    if (Number(game.currentPlayer) !== Number(pit.owner)) return;
    if (pit.seeds === 0) return;

    let mandatoryId = this.getMandatoryId(game);
    if (mandatoryId !== null) {
      const mandatoryPit = game.pits.find(p => String(p.id) === mandatoryId);
      if (!mandatoryPit || mandatoryPit.seeds === 0) {
        mandatoryId = null; // ignorer la contrainte
      }
    }

    if (mandatoryId !== null && String(pit.id) !== mandatoryId) {
      this.errorMessage = '⚠️ Vous devez jouer le trou bleu (il contient encore des graines) !';
      this.selectedPit = null;
      return;
    }
    this.errorMessage = null;
    this.selectedPit = pit;
  }

  play(game: Game) {
    if (!this.selectedPit) return;
    this.gameService.playTurn(game.id, this.selectedPit.id, 'right').subscribe({
      error: (err) => {
        this.errorMessage = err.message || 'Erreur';
        this.selectedPit = null;
      }
    });
  }
}