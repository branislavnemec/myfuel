import { FormControl } from '@angular/forms';

export class ObjectValidator {

    static mustBeObject(formControl: FormControl) {
        if (formControl.value && formControl.value !== '' && typeof formControl.value !== 'object') {
            return { mustBeObject: true };
        }
        return null;
    }

}
