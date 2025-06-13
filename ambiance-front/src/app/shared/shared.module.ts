import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSpinnerComponent,
    TruncatePipe,
  ]
})
export class SharedModule {}
