import { ElementRef, Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})

export class FontService {
  adjustFont(container: ElementRef<HTMLDivElement>, textElement: ElementRef<HTMLHeadingElement>, minFontSize: number = 2, maxFontSize: number = 800) {
    const getElementWidth = (element: ElementRef) =>
      element.nativeElement.getBoundingClientRect().width;
    const containerWidth = getElementWidth(container);

    let fontSize = parseInt(getComputedStyle(textElement.nativeElement).fontSize);
    let lowerBound = minFontSize;
    let upperBound = maxFontSize;

    while (lowerBound <= upperBound) {
      fontSize = Math.floor((lowerBound + upperBound) / 2);
      textElement.nativeElement.style.fontSize = `${fontSize}px`;

      const textWidth = getElementWidth(textElement);
      if (textWidth > containerWidth) {
        upperBound = fontSize - 1;
      } else if (textWidth < containerWidth) {
        lowerBound = fontSize + 1;
      } else {
        break;
      }
    }

    // Ensure the text doesn't exceed the container width
    if (getElementWidth(textElement) > containerWidth) {
      textElement.nativeElement.style.fontSize = `${fontSize - 1}px`;
    }
  }
}
