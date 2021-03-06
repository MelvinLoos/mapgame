import { extend } from "vee-validate";
import { required, min, email } from "vee-validate/dist/rules";

extend('required', required);

extend('min', min);

extend('email', email);

extend('password', {
    params: ['target'],
    validate(value, { target }) {
        return value === target;
    },
    message: 'Password confirmation does not match'
});

extend('startingLocation', {
    validate(value) {
        return (value => value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90);
    },
    message: 'Value must be a valid location'
});