import { LeadInteractionModel } from "../models/leadInteraction.model";
import { baseService } from "./baseService";

export class interactionService extends baseService<LeadInteractionModel> {
  constructor() {
    super("lead_interaction");
  }

  checkIfFullInteraction = async (leadData: LeadInteractionModel): Promise<boolean> => {

    if (leadData.id && leadData.leadId && leadData.updatedAt && leadData.userEmail && leadData.createdAt && leadData.type && leadData.userId && leadData.date)
      return true;
    else
      return false;
    
  };
  
}