import { FormControl } from '@angular/forms';

export class ObjectValidator {

    static notObject(formControl: FormControl) {
        if (formControl.value && formControl.value !== '' && typeof formControl.value !== 'object') {
            return { notObject: true };
        }
        return null;
    }

}
