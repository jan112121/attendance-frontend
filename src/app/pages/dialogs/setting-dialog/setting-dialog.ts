import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface SettingItem {
  title: string;
  description: string;
  enabled: boolean;
  key: string;
}

@Component({
  selector: 'app-setting-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './setting-dialog.html',
  styleUrl: './setting-dialog.scss',
})
export class SettingDialog implements OnInit {
  settingItems: SettingItem[] = [
    {
      title: 'Dark Mode',
      description: 'Switch between light and dark themes.',
      enabled: false,
      key: 'darkMode',
    },
    {
      title: 'Notifications',
      description: 'Get alerts for attendance and updates.',
      enabled: true,
      key: 'notifications',
    },
    {
      title: 'Auto Sync',
      description: 'Automatically refresh attendance data.',
      enabled: true,
      key: 'autoSync',
    },
    {
      title: 'Sound Effects',
      description: 'Play a sound when attendance is marked.',
      enabled: false,
      key: 'soundEffects',
    },
  ];

  ngOnInit() {
    // 🔄 Load saved settings
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.settingItems.forEach(item => {
        if (parsed[item.key] !== undefined) item.enabled = parsed[item.key];
      });
      this.applyDarkMode(parsed['darkMode']);
    }
  }

  toggle(item: SettingItem) {
    item.enabled = !item.enabled;

    // 👇 Apply immediately if it's dark mode
    if (item.key === 'darkMode') {
      this.applyDarkMode(item.enabled);
    }
  }

  saveSettings() {
    const result = this.settingItems.reduce(
      (acc, item) => {
        acc[item.key] = item.enabled;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    localStorage.setItem('appSettings', JSON.stringify(result));
    console.log('Saved settings:', result);
  }

  private applyDarkMode(enabled: boolean) {
    const body = document.body;
    if (enabled) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}
