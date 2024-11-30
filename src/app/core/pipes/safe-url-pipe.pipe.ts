import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(buffer: { type: string, data: number[] }): SafeUrl {
    const byteArray = new Uint8Array(buffer.data);
    const blob = new Blob([byteArray], { type: 'image/png' }); // Cambia el tipo de imagen si es necesario
    const url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
