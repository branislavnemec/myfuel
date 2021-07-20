import { FormArray, FormControl, ValidatorFn } from '@angular/forms';

export class ObjectValidator {

    static mustBeObject(formControl: FormControl) {
        if (formControl.value && formControl.value !== '' && typeof formControl.value !== 'object') {
            return { mustBeObject: true };
        }
        return null;
    }

}

export class FormArrayValidator {

    static atLeastOneIsTrue(formArray: FormArray) {
        let atLeastOneIsTrue = false;
        formArray.controls.find((control: FormControl) => {
            if (control.value === true) {
                atLeastOneIsTrue = true;
                return null;
            }
        });
        if (atLeastOneIsTrue) {
            return null;
        } else {
            return { atLeastOneIsTrue: true };
        }
    }

}
