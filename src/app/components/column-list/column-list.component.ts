import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnMetadata } from '../../models/column-metadata.model';
import { TableMetadata } from '../../models/table-metadata.model';
import { ColumnMetadataService } from '../../services/column-metadata.service'; // ✅ Import đúng service

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

  newCol: ColumnMetadata = {
    columnName: '',
    dataType: '',
    columnSize: 0,
    nullable: false,
    table: { tableName: '' }
  };

  constructor(private service: ColumnMetadataService) {} // ✅ Inject đúng service

  ngOnChanges(): void {
    if (this.table?.tableName) {
      // ✅ Sử dụng method đúng tên
      this.service.getColumnsByTable(this.table.tableName).subscribe(res => this.columns = res);
    }
  }

  addColumn(): void {
    if (!this.table?.tableName || !this.newCol.columnName.trim()) return;

    this.newCol.table = { tableName: this.table.tableName };

    this.service.createColumn(this.newCol).subscribe(() => {
      this.resetNewCol();
      this.ngOnChanges();
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
