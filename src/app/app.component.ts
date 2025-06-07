import { Component } from '@angular/core';
import { MetadataListComponent } from './metadata/metadata-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MetadataListComponent],
  template: `<app-metadata-list></app-metadata-list>`
})
export class AppComponent {}
