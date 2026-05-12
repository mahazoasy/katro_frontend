import { Component } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent, HttpClientModule],
  template: '<app-board></app-board>',
  styles: []
})
export class AppComponent {}