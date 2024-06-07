import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, DoCheck, Input, OnChanges, OnDestroy, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewContainerRef, inject, numberAttribute } from '@angular/core';
import { TabItemComponent } from './tab-item.component';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Observable} from 'rxjs';
import {delay, map, startWith, tap} from 'rxjs/operators'



@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [NgFor,NgIf, AsyncPipe, NgTemplateOutlet, TabItemComponent],
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.css']
})
export class TabPanelComponent<T> implements AfterContentInit, AfterContentChecked{

  @ContentChildren(TabItemComponent, ) tabItems: QueryList<TabItemComponent<T>>;
  @ViewChild('tabsContainer', {read: ViewContainerRef}) viewTabsContainer: ViewContainerRef;

  tabItems$: Observable<TabItemComponent<T>[]>;

  
  /** The index of the active tab. */
  @Input({transform: numberAttribute})
  get indexToSelect(): number | null {
    return this._indexToSelect;
  }
  set indexToSelect(value: number) {
    this._indexToSelect = isNaN(value) ? null : value;
  }
  private _indexToSelect: number | null = null;
  private _selectedIndex: number | null = null;


  private set activeTab(tabDirect: TabItemComponent<T>){
    this._activeTab = tabDirect;
  }
  get activeTab(){
    return this._activeTab
  }
  private _activeTab: TabItemComponent<T>;

   ngAfterContentInit() {  
    /* start to listen changes  of the tabItems query children
    * for tabs added dynamically
    */
    this.tabItems$ = this.tabItems.changes
    .pipe(
      startWith(""),
      delay(0),
      map(() => this.tabItems.toArray()),
      tap( _ => this.selectTab(this.indexToSelect || 0)));
 }

 ngAfterContentChecked(){
  // If there is dynamically changes on the index to change the selected tab
   if(this.indexToSelect !== this._selectedIndex){
    this.selectTab(this.indexToSelect);
   }

}


  selectTab(index: number){
    this._indexToSelect = index < this.tabItems.length ? index : 0;
    const tabToSelect = this.tabItems.get(this._indexToSelect);
    if(tabToSelect && !tabToSelect.isDeleted){
      this.indexToSelect = index;
      this._selectedIndex = index;
      this.activeTab = tabToSelect;
      /* Schedule a change detection run to avoid error after changed*/
      Promise.resolve().then( () => {
        this.tabItems.forEach( tab => (tab.isActive = false));
        this.activeTab.show()
      });
    }
  };



  closeTab(event: MouseEvent, indexToClose: number): void{
    event.stopPropagation();
    const tabToDelete = this.tabItems.get(indexToClose);
    if(tabToDelete){ 
       tabToDelete.closeTab();
       this.indexToSelect = indexToClose === 0 ? indexToClose + 1 : 0
       this.selectTab(this.indexToSelect);
        
    }
  }
}
