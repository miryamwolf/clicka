import { CustomerPeriodModel } from "../models/customerPeriod.model";
import { baseService } from "./baseService";

export class customerPeriodService extends baseService<CustomerPeriodModel> {
    constructor() {
        super("customer_period"); // שם הטבלה ב-DB
    }
}

export const serviceCustomerPeriod = new customerPeriodService();