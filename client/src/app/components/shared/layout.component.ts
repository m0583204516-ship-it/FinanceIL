import { Component, signal, ChangeDetectorRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, RouterModule],
  template: `
    <div class="layout-wrapper">
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        (toggleCollapse)="sidebarCollapsed.set(!sidebarCollapsed())"
      />
      <div class="layout-content">
        <app-navbar [title]="pageTitle" (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())" />
        <main class="page-content">
          <router-outlet (activate)="onActivate($event)" />
        </main>
      </div>
    </div>
  `,
})
export class LayoutComponent {
  private cdr = inject(ChangeDetectorRef);
  sidebarCollapsed = signal(false);
  pageTitle = '';

  onActivate(component: any) {
    this.pageTitle = component?.pageTitle ?? '';
    this.cdr.detectChanges();
  }
}
