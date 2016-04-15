import {Directive} from 'angular2/core';

@Directive({
    selector: '[stopPropagation]',
    host: {
        '(click)': 'onClick($event)'
    }
})
export class StopPropagationDirective {
    onClick(event:Event) {
        event.stopPropagation();
    }
}
