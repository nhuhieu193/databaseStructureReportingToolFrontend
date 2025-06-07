// src/app/metadata/metadata-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetadataService, MetadataTable, MetadataColumn } from './metadata.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColumnDialogComponent } from './column-dialog.component';
import { TableDialogComponent } from './table-dialog.component';

@Component({
  selector: 'app-metadata-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    ColumnDialogComponent,
    TableDialogComponent
  ],
  template: `
    <h2>Metadata Manager</h2>

    <button mat-raised-button color="primary" (click)="addTable()">Add Table</button>
    <button mat-raised-button color="accent" (click)="exportPdf()">Export PDF</button>

    <mat-accordion>
      <mat-expansion-panel *ngFor="let table of tables">
        <mat-expansion-panel-header>
          <mat-panel-title>{{ table.tableName }}</mat-panel-title>
          <mat-panel-description>
            <button mat-icon-button (click)="editTable(table)">✏️</button>
            <button mat-icon-button color="warn" (click)="deleteTable(table)">🗑️</button>
          </mat-panel-description>
        </mat-expansion-panel-header>

        <mat-list>
          <mat-list-item *ngFor="let col of table.columns">
            + {{ col.columnName }} ({{ col.dataType }}, {{ col.isNullable ? 'NULL' : 'NOT NULL' }})
            <button mat-icon-button (click)="editColumn(col)">✏️</button>
            <button mat-icon-button (click)="deleteColumn(col)">🗑️</button>
          </mat-list-item>
        </mat-list>
        <button mat-button (click)="addColumn(table)">Add Column</button>
      </mat-expansion-panel>
    </mat-accordion>
  `
})
export class MetadataListComponent implements OnInit {
  tables: MetadataTable[] = [];

  constructor(private metadataService: MetadataService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.metadataService.getAll().subscribe(data => this.tables = data);
  }

  addTable() {
    const dialogRef = this.dialog.open(TableDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.metadataService.createTable(result).subscribe(() => this.loadData());
    });
  }

  editTable(table: MetadataTable) {
    const dialogRef = this.dialog.open(TableDialogComponent, { data: table });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.metadataService.updateTable(table.id!, result).subscribe(() => this.loadData());
    });
  }

  deleteTable(table: MetadataTable) {
    this.metadataService.deleteTable(table.id!).subscribe(() => this.loadData());
  }

  addColumn(table: MetadataTable) {
    const dialogRef = this.dialog.open(ColumnDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.metadataService.addColumn(table.id!, result).subscribe(() => this.loadData());
    });
  }

  editColumn(col: MetadataColumn) {
    const dialogRef = this.dialog.open(ColumnDialogComponent, { data: col });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.metadataService.updateColumn(col.id!, result).subscribe(() => this.loadData());
    });
  }

  deleteColumn(col: MetadataColumn) {
    this.metadataService.deleteColumn(col.id!).subscribe(() => this.loadData());
  }

  exportPdf() {
    this.metadataService.exportPdf().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metadata-report.pdf';
      a.click();
    });
  }
}
