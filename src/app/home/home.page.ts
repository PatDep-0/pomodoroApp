import { Component } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications'; // Import Local Notifications directly

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  workTime: number = 25 * 60; // 25 minutes in seconds
  breakTime: number = 5 * 60; // 5 minutes in seconds
  timeLeft: number = this.workTime;
  isWorkSession: boolean = true;
  isRunning: boolean = false;
  timerInterval: any;

  constructor() {}

  async sendNotification(title: string, body: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: new Date().getTime(),
          title: title,
          body: body,
          schedule: { at: new Date(new Date().getTime() + 1000) }, // Trigger immediately
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        // Notify user when the timer hits 00:00
        if (this.isWorkSession) {
          this.sendNotification(
            'Pomodoro Timer',
            'Work session is over! It is time for a 5 minute break!'
          );
        } else {
          this.sendNotification(
            'Pomodoro Timer',
            'Break time is over! It is time to work on your duties!'
          );
        }

        // Switch session and reset the timer
        this.isWorkSession = !this.isWorkSession;
        this.timeLeft = this.isWorkSession ? this.workTime : this.breakTime;
      }
    }, 1000);
  }

  stopTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    this.stopTimer();
    this.isWorkSession = true;
    this.timeLeft = this.workTime;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
