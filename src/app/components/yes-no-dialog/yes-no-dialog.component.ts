import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { tap, first } from 'rxjs/operators';
import { BackButtonService } from 'src/app/utils/back-button.service';

@Component({
    selector: 'app-yes-no-dialog',
    templateUrl: './yes-no-dialog.component.html',
    styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent implements OnInit, OnDestroy {

    text = '';

    constructor(
        private backButtonService: BackButtonService,
        private dialogRef: MatDialogRef<YesNoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.text = data.text;
        dialogRef.afterClosed()
            .pipe(
                first(),
                tap(() => this.backButtonService.resetDefaultHandler())
            ).subscribe();
        this.backButtonService.setCustomHandler(() => {
            dialogRef.close();
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    close() {
        this.dialogRef.close('no');
    }

    submit() {
        this.dialogRef.close('yes');
    }

}
