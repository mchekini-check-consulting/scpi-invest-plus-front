import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scpi-header',
  imports: [TranslateModule],
  templateUrl: './scpi-header.component.html',
  styleUrl: './scpi-header.component.css',
})
export class ScpiHeaderComponent {
  title: string = 'LIST-SCPI.TITLE';
}
