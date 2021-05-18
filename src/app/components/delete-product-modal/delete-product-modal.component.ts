import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css']
})
export class DeleteProductModalComponent implements OnInit {

  constructor() { }

  @Input() product : Product ;
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();

  ngOnInit(): void {
  }


  cancelDelete() {
    this.cancel.emit();

  }

  confirmDelete() {
    this.confirm.emit();

  }

}
