import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnMetadata, TableMetadata } from '../../models/metadata.model';
import { TableMetadataServiceTs } from '../../services/table-metadata.service.ts';

@Component({
  selector: 'app-column-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './column-list.component.html',
  styleUrls: ['./column-list.component.css']
})
export class ColumnListComponent implements OnChanges {
  @Input() table?: TableMetadata;

  columns: ColumnMetadata[] = [];

  // ✅ Fix: table phải có kiểu { tableName: string }
  newCol: ColumnMetadata = {
    columnName: '',
    dataType: '',
    columnSize: 0,
    nullable: false,
    table: { tableName: '' }
  };

  constructor(private service: TableMetadataServiceTs) {}

  ngOnChanges(): void {
    if (this.table?.tableName) {
      this.service.getColumns(this.table.tableName).subscribe(res => this.columns = res);
    }
  }

  addColumn(): void {
    if (!this.table?.tableName || !this.newCol.columnName.trim()) return;

    // ✅ Gán đúng table reference
    this.newCol.table = { tableName: this.table.tableName };

    this.service.createColumn(this.newCol).subscribe(() => {
      this.resetNewCol();
      this.ngOnChanges(); // reload list
    });
  }

  deleteColumn(id?: number): void {
    if (!id) return;
    if (confirm('Delete this column?')) {
      this.service.deleteColumn(id).subscribe(() => this.ngOnChanges());
    }
  }

  private resetNewCol(): void {
    this.newCol = {
      columnName: '',
      dataType: '',
      columnSize: 0,
      nullable: false,
      table: { tableName: this.table?.tableName ?? '' }
    };
  }
}
