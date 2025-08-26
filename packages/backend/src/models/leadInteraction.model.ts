import type{ DateISO, ID, InteractionType, LeadInteraction } from "shared-types";

export class LeadInteractionModel implements LeadInteraction {

  id?: ID; // PK
  leadId: ID; // FK
  type: InteractionType;
  date: DateISO;
  notes: string;
  userId: ID; 
  userEmail: string;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(params:{
    id: ID,
    leadId: ID,
    type: InteractionType,
    date: DateISO,
    notes: string,
    userId: ID,
    userEmail: string,
    createdAt: DateISO,
    updatedAt: DateISO
  }) {
    this.id = params.id;
    this.leadId = params.leadId;
    this.type = params.type;
    this.date = params.date;
    this.notes = params.notes;
    this.userId = params.userId;
    this.userEmail = params.userEmail;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toDatabaseFormat() {
    return {
      // lead_id: this.leadId,
      type: this.type,
      date: this.date,
      notes: this.notes,
      user_id: this.userId,
      user_email: this.userEmail,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  
  }


    static fromDatabaseFormat(dbData: any): LeadInteractionModel {{
    return new LeadInteractionModel({
id: dbData.id, // אם יש id
      leadId:  dbData.lead_id,
       type: dbData.type,
        date:dbData.date,
       notes: dbData.notes,
        userId:dbData.user_id,
        userEmail: dbData.user_email,
        createdAt: dbData.created_at,
        updatedAt: dbData.updated_at
    }
        
    );
}}

    static fromDatabaseFormatArray(dbDataArray: any[] ): LeadInteractionModel[] {
        return dbDataArray.map(dbData => LeadInteractionModel.fromDatabaseFormat(dbData));
    }
}
