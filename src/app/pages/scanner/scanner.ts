import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { AttendanceService } from '../../services/attendance.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './scanner.html',
  styleUrls: ['./scanner.scss'],
})
export class ScannerComponent implements OnInit, OnDestroy {
  private codeReader = new BrowserMultiFormatReader();
  private currentStream: MediaStream | null = null;

  resultText = '';
  message = '';
  scannedUser: any = null;
  isScanning = false;
  isProcessing = false;
  isSuccess: boolean | null = null; // ✅ For success/failure visual feedback

  constructor(private attendanceService: AttendanceService) {}

  async ngOnInit() {
    console.log('📸 Scanner loaded — starting camera...');
    await this.startScanner();
  }

  async startScanner() {
    if (this.isScanning) return;
    this.isScanning = true;
    this.message = 'Initializing camera...';
    this.isSuccess = null;
    this.scannedUser = null;

    try {
      const videoElement = document.getElementById('video') as HTMLVideoElement;
      if (!videoElement) {
        console.error('❌ No video element found');
        this.message = 'Camera element not found.';
        return;
      }

      this.currentStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoElement.srcObject = this.currentStream;
      await videoElement.play();

      // 🎥 Start scanning continuously
      this.codeReader.decodeFromVideoDevice(undefined, 'video', async (result, _err) => {
        if (result && !this.isProcessing) {
          const code = result.getText();
          this.isProcessing = true;
          this.resultText = code;
          this.message = 'Verifying attendance...';
          this.isSuccess = null;

          try {
            // 📸 Capture frame from video as Base64
            const base64Image = this.captureBase64Image(videoElement);

            // ✅ Send to backend
            const res: any = await this.attendanceService
              .verifyAttendance({ aztecData: code, aztecImage: base64Image })
              .toPromise();
            
            if (res?.success) {
              this.isSuccess = true;
              this.message = '✅ Attendance recorded successfully!';
              this.scannedUser = res.user || null; // backend should send user info

              console.log(this.scannedUser);
            } else {
              this.isSuccess = false;
              this.message = res?.message || '❌ Attendance verification failed.';
              this.scannedUser = null;
            }
          } catch (error: any) {
            this.isSuccess = false;
            this.message = error?.error?.message || '⚠️ Server error during verification.';
          } finally {
            // Wait 3 seconds, then restart camera for next scan
            setTimeout(() => {
              this.stopCamera();
              this.isProcessing = false;
              this.isScanning = false;
              this.startScanner(); // restart scanning again automatically
            }, 3000);
          }
        }
      });
    } catch (error) {
      console.error('❌ Camera error:', error);
      this.message = 'Unable to access camera. Please allow permission.';
      this.isScanning = false;
    }
  }

  /** Capture video frame to Base64 */
  captureBase64Image(video: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    }
    return '';
  }

  stopCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
    this.isScanning = false;
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
