import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [MatIconModule]
})
export class SvgCustomIconsModule {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.registerIcons();
  }

  private registerIcons(): void {
    const icons: { [key: string]: string } = {
      angular: 'img/angular.svg',
      javascript: 'img/javascript.svg',
      typescript: 'img/typescript.svg',
      dotnet: 'img/dotnet.svg',
      css: 'img/css.svg',
      git: 'img/git.svg',
      html: 'img/html.svg',
      swagger: 'img/swagger.svg',
      sass: 'img/sass.svg',
      github: 'img/github.svg',
      instagram: 'img/instagram.svg',
      whatsapp: 'img/whatsapp.svg',
      twitter: 'img/x.svg'
    };

    for (const [name, path] of Object.entries(icons)) {
      this.iconRegistry.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(path)
      );
    }
  }
}
