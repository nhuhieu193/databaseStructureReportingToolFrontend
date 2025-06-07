import { Component } from '@angular/core';
import { MetadataListComponent } from './metadata/metadata-list.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [MetadataListComponent],
  template: `<app-metadata-list></app-metadata-list>`
})
export class AppComponent {}
