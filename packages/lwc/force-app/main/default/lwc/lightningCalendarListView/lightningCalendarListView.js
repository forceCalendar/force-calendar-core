import { LightningElement, api } from 'lwc';

export default class LightningCalendarListView extends LightningElement {
    @api viewData;

    get days() {
        return this.viewData?.days || [];
    }
}
