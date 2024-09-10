import { Component, OnInit } from '@angular/core';
import { BatchService } from '../../services/batch.service';
import { Batch } from '../../models/batch.model';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css'],
})
export class BatchComponent implements OnInit {
  batches: Batch[] = [];

  constructor(private batchService: BatchService) {}

  ngOnInit(): void {
    this.batchService.getBatches().subscribe((batches) => (this.batches = batches));
  }

  addBatch(): void {
    const newBatch: Batch = {
      id: this.batches.length + 1,
      name: `Batch ${this.batches.length + 1}`,
      classId: 1, // Example classId
    };
    this.batchService.addBatch(newBatch);
  }

  deleteBatch(batchId: number): void {
    this.batchService.deleteBatch(batchId);
  }
}