import { CommonModule } from '@angular/common'
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { StorageService } from '../services/storage.service'
import { Subscription, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { FontService } from '../services/font.service'

@Component({
  selector: 'app-event-count-down',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-count-down.component.html',
  styleUrl: './event-count-down.component.scss',
})

export class EventCountDownComponent implements OnInit, OnDestroy, AfterViewInit {
  public eventDate: string = '2024-06-21'
  public title: string = 'Midsummer Eve'
  public remainingTime: string | null = null
  private countdownInterval?: ReturnType<typeof setInterval>

  @ViewChild('titleContainer') titleContainer!: ElementRef
  @ViewChild('titleElement') titleElement!: ElementRef

  private resizeSubject = new Subject<void>()
  private resizeSubscription?: Subscription

  constructor(
    private storageService: StorageService,
    private FontService: FontService,
  ) {}

  ngOnInit(): void {
    this.loadData()
    this.countDown()
    this.countdownInterval = setInterval(() => {
      this.countDown()
    }, 1000)

    this.resizeSubscription = this.resizeSubject.pipe(debounceTime(50)).subscribe(() => {
      this.adjustFont()
    })
  }

  ngAfterViewInit(): void {
    this.titleElement.nativeElement.style.fontWeight = '800' // max font
    this.resizeSubject.next()
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe()
    }
  }

  @HostListener('window:resize') onWindowResize() {
    this.resizeSubject.next()
  }

  onTitleChange(): void {
    this.storageService.setItem('title', this.title)
    this.resizeSubject.next()
  }

  onEventDateChange(): void {
    this.storageService.setItem('eventDate', this.eventDate)
    this.resizeSubject.next()
  }

  private countDown(): void {
    if (!this.eventDate) {
      this.remainingTime = '-'
      return
    }

    const now = new Date().getTime()
    const target = new Date(this.eventDate).getTime()
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
    const timeDifference = target + timezoneOffset - now

    if (timeDifference <= 0) {
      this.remainingTime = "Event Already Started!"
      return
    }
    this.remainingTime = this.getRemainingTime(timeDifference)
  }

  private getRemainingTime(timeDifference: number): string {
    const msInDay = 24 * 60 * 60 * 1000
    const msInHour = 60 * 60 * 1000
    const msInMinute = 60 * 1000

    const days = Math.floor(timeDifference / msInDay)
    const hours = Math.floor((timeDifference % msInDay) / msInHour)
    const minutes = Math.floor(((timeDifference % msInDay) % msInHour) / msInMinute)
    const seconds = Math.floor((((timeDifference % msInDay) % msInHour) % msInMinute) / 1000)

    return `${days} days, ${hours} h, ${minutes}m, ${seconds}s`
  }

  private loadData(): void {
    const title = this.storageService.getItem<string>('title');
    if (title) {
      this.title = title;
    }

    const eventDate = this.storageService.getItem<string>('eventDate');
    if (eventDate) {
      this.eventDate = eventDate;
    }
  }

  private adjustFont(): void {
    this.FontService.adjustFont(this.titleContainer, this.titleElement)
  }
}
