export interface Pit {
  id: string;
  owner: 1 | 2;
  row: 'outer' | 'inner';
  seeds: number;
  position: number;
  leftId: string | null;
  rightId: string | null;
  oppositeId: string | null;
}

export interface Game {
  id: string;
  pits: Pit[];
  currentPlayer: number;
  status: 'waiting' | 'in-progress' | 'finished';
  winner: number | null;
  // Trou bleu de chaque joueur (1 graine, dernier grain tombé dans trou vide)
  // Le joueur concerné DOIT commencer par ce trou à son prochain tour
  lastPitId1: string | null;
  lastPitId2: string | null;
}