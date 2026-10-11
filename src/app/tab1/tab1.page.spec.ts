import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  const counterServiceMock = {
    add: vi.fn(),
  };

  const counter: SavedCounter = {
    id: 'first',
    name: 'První',
    value: 1,
    createdAt: '2026-09-17T08:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    counterServiceMock.add.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: CounterService, useValue: counterServiceMock }],
    });

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass the saved counter to CounterService', async () => {
    await component.onSaved(counter);

    expect(counterServiceMock.add).toHaveBeenCalledWith(counter);
  });

  it('should show a toast after a successful save', async () => {
    expect(component.toastMessage()).toBeNull();

    await component.onSaved(counter);

    expect(component.toastMessage()).toContain('První');
  });

  it('should not show a toast when saving fails', async () => {
    counterServiceMock.add.mockRejectedValue(new Error('Zápis selhal'));

    await expect(component.onSaved(counter)).rejects.toThrow('Zápis selhal');

    expect(component.toastMessage()).toBeNull();
  });
});
