import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

export type SortOption = 'newest' | 'oldest' | 'name' | 'value-desc' | 'value-asc';

export interface ConfirmAlertButton {
  text: string;
  role: 'cancel' | 'destructive';
  handler?: () => void;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    FormsModule,
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);

  readonly searchTerm = signal('');
  readonly sortOption = signal<SortOption>('newest');

  readonly totalValue = computed(() =>
    this.counterService.counters().reduce((sum, counter) => sum + counter.value, 0),
  );

  readonly valueStats = computed(() => {
    const stats = { positive: 0, negative: 0, zero: 0 };

    for (const counter of this.counterService.counters()) {
      if (counter.value > 0) {
        stats.positive++;
      } else if (counter.value < 0) {
        stats.negative++;
      } else {
        stats.zero++;
      }
    }

    return stats;
  });

  readonly visibleCounters = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase('cs');
    const filtered = this.counterService
      .counters()
      .filter((counter) => counter.name.toLocaleLowerCase('cs').includes(term));

    return [...filtered].sort(this.comparator(this.sortOption()));
  });

  readonly isClearAlertOpen = signal(false);
  readonly toastMessage = signal<string | null>(null);

  readonly clearAlertButtons: ConfirmAlertButton[] = [
    {
      text: 'Zrušit',
      role: 'cancel',
    },
    {
      text: 'Vymazat',
      role: 'destructive',
      handler: () => {
        void this.clear();
      },
    },
  ];

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    this.toastMessage.set('Záznam byl odstraněn.');
  }

  confirmClear(): void {
    this.isClearAlertOpen.set(true);
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
    this.toastMessage.set('Historie byla vymazána.');
  }

  private comparator(option: SortOption): (a: SavedCounter, b: SavedCounter) => number {
    switch (option) {
      case 'oldest':
        return (a, b) => a.createdAt.localeCompare(b.createdAt);
      case 'name':
        return (a, b) => a.name.localeCompare(b.name, 'cs');
      case 'value-desc':
        return (a, b) => b.value - a.value;
      case 'value-asc':
        return (a, b) => a.value - b.value;
      case 'newest':
      default:
        return (a, b) => b.createdAt.localeCompare(a.createdAt);
    }
  }
}
