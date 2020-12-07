import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import Overlay, {Options, PanIntoViewOptions} from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import {MapComponent} from './map.component';
import {Coordinate} from './models';

@Component({
  selector: 'ol-map > ol-overlay',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnChanges, OnDestroy {
  protected overlay: Overlay;
  public element: HTMLElement;

  @Input() id: number | string;
  @Input() className: string;
  @Input() offset: number[];
  @Input() position: Coordinate;
  @Input() positioning: OverlayPositioning | string;
  @Input() stopEvent: boolean;
  @Input() insertFirst: boolean;
  @Input() autoPan: PanIntoViewOptions;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected elementRef: ElementRef,
    protected mapComponent: MapComponent
  ) {
    this.changeDetectorRef.detach();
  }

  ngOnInit() {
    if (this.elementRef.nativeElement) {
      this.element = this.elementRef.nativeElement;
      this.overlay = new Overlay(this as Options);
      this.mapComponent.getMap().addOverlay(this.overlay);
    }
  }

  ngOnDestroy() {
    if (this.overlay) {
      this.mapComponent.getMap().removeOverlay(this.overlay);
      this.overlay = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.overlay) {
      const properties: { [index: string]: any } = {};

      for (const key in changes) {
        properties[key] = changes[key].currentValue;
      }

      this.overlay.setProperties(properties, false);
    }
  }
}
