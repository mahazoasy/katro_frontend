import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pit } from '../models/game.model';

@Component({
  selector: 'app-pit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pit.component.html',
  styleUrls: ['./pit.component.css']
})
export class PitComponent {
  @Input() pit!: Pit;
  @Input() selected = false;
  @Output() pitSelected = new EventEmitter<Pit>();

  onClick() {
    this.pitSelected.emit(this.pit);
  }
}
