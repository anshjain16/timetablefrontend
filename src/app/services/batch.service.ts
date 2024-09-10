import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Batch } from '../models/batch.model';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  private batches: Batch[] = [];
  private batchesSubject = new BehaviorSubject<Batch[]>(this.batches);

  getBatches(): Observable<Batch[]> {
    return this.batchesSubject.asObservable();
  }

  addBatch(newBatch: Batch): void {
    this.batches.push(newBatch);
    this.batchesSubject.next(this.batches);
  }

  updateBatch(updatedBatch: Batch): void {
    const index = this.batches.findIndex((btch) => btch.id === updatedBatch.id);
    if (index !== -1) {
      this.batches[index] = updatedBatch;
      this.batchesSubject.next(this.batches);
    }
  }

  deleteBatch(batchId: number): void {
    this.batches = this.batches.filter((btch) => btch.id !== batchId);
    this.batchesSubject.next(this.batches);
  }
}