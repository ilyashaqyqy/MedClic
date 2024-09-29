import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-appointment-success-popup',
    templateUrl: './appointment-success-popup.component.html',
    styleUrls: ['./appointment-success-popup.component.css']
})
export class AppointmentSuccessPopupComponent {
    @Input() message: string = '';
    visible: boolean = false;

    show() {
        this.visible = true;
        setTimeout(() => {
            this.visible = false;
        }, 3000); // Automatically hide after 3 seconds
    }
}
