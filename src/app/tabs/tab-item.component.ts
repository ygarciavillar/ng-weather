import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, TemplateRef, Output} from '@angular/core';

@Component({
  selector: 'app-tab-item',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet,],
  template: `
    <div *ngIf="isActive">
      <ng-content></ng-content>
      <ng-container *ngIf="tabContent">
        <ng-container [ngTemplateOutlet]="tabContent" [ngTemplateOutletContext]="{ data: dataContext }"></ng-container>
      </ng-container>
    </div>
   `
})
export class TabItemComponent<T>{
 @Input() label: string = '';
 @Input() isCloseable: boolean = true;
 @Input() dataContext: T;
 @Input() tabContent: TemplateRef<any>;

 @Output() onCloseTab = new EventEmitter<void>()


 isActive = false;
 isDeleted: boolean = false;

 hide(){
  this.isActive = false;
 }

 show(){
  this.isActive = true;
 }

 closeTab(){
  this.onCloseTab.emit();
  this.hide();
  this.isDeleted = true;
 }
}
