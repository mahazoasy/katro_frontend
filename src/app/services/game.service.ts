import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Game, Pit } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  private apiUrl = 'http://localhost:3000/games';
  private gameSubject = new BehaviorSubject<Game | null>(null);
  public game$ = this.gameSubject.asObservable();

  constructor(private http: HttpClient) {}

  private mapGame(data: any): Game {
    return {
      id: data.id,
      currentPlayer: Number(data.currentPlayer),
      status: data.status,
      winner: data.winner ?? null,
      lastPitId1: data.lastPitId1 ?? null,
      lastPitId2: data.lastPitId2 ?? null,
      pits: (data.pits as any[]).map((p: any): Pit => ({
        id: p.id,
        owner: p.owner,
        row: p.row,
        position: p.position,
        seeds: p.seeds,
        leftId: p.leftId ?? null,
        rightId: p.rightId ?? null,
        oppositeId: p.oppositeId ?? null,
      })),
    };
  }

  createGame(): Observable<Game> {
    return this.http.post<any>(this.apiUrl, {}).pipe(
      map(data => this.mapGame(data)),
      tap(game => this.gameSubject.next(game)),
      catchError(err => throwError(() => err))
    );
  }

  playTurn(gameId: string, pitId: string, direction: 'left' | 'right'): Observable<Game> {
    return this.http.post<any>(`${this.apiUrl}/${gameId}/play`, { pitId, direction }).pipe(
      map(data => this.mapGame(data)),
      tap(game => this.gameSubject.next(game)),
      catchError(err => throwError(() => err))
    );
  }

  reset() {
    this.gameSubject.next(null);
  }
}