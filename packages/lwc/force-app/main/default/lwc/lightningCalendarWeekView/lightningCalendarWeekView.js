import { LightningElement, api } from 'lwc';

export default class LightningCalendarWeekView extends LightningElement {
    @api viewData;

    get days() {
        return this.viewData?.days || [];
    }
}
