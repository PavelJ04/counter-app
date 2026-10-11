import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  // Stránka čte signály služby, proto náhrada služby obsahuje vlastní signály.
  const countersState = signal<SavedCounter[]>([]);
  const counterServiceMock = {
    counters: countersState.asReadonly(),
    initialized: signal(true).asReadonly(),
    initialize: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    countersState.set([]);
    counterServiceMock.initialize.mockResolvedValue(undefined);
    counterServiceMock.remove.mockResolvedValue(undefined);
    counterServiceMock.clear.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: CounterService, useValue: counterServiceMock }],
    });

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize the service', () => {
    expect(component).toBeTruthy();
    expect(counterServiceMock.initialize).toHaveBeenCalledTimes(1);
  });

  it('should remove one record through the service', async () => {
    await component.remove('first');

    expect(counterServiceMock.remove).toHaveBeenCalledWith('first');
  });
});
