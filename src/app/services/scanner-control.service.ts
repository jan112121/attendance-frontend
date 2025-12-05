import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerControlService {
  private scanningState = new BehaviorSubject<boolean>(false);
  scanningState$ = this.scanningState.asObservable();

  startScanner() {
    this.scanningState.next(true);
  }

  stopScanner() {
    this.scanningState.next(false);
  }
}
