import { Request, Response } from "express";
import {
  createPricingTier,
  createPricingTierWithHistory,
  getPricingHistory,
  getCurrentPricingTier,
  updatePricingTier,
  bulkUpdatePricingTiers,
  deletePricingTier,
  createMeetingRoomPricing,
  createMeetingRoomPricingWithHistory, // Adding this import, was missing but used below
  getMeetingRoomPricingHistory,
  getCurrentMeetingRoomPricing,
  updateMeetingRoomPricing,
  deleteMeetingRoomPricing,
  createLoungePricing,
  createLoungePricingWithHistory, // Adding this import, was missing but used below
  getLoungePricingHistory,
  getCurrentLoungePricing,
  updateLoungePricing,
  deleteLoungePricing
} from "../services/pricing.service";
import {
    PricingTierModel,
    MeetingRoomPricingModel,
    LoungePricingModel
} from '../models/pricing.model'; // ייבוא המודלים


// ========================
// סביבת עבודה
// ========================

/*"Create a new pricing tier"*/
export const createPricingTierController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const newTier = new PricingTierModel(req.body);
    
    
    const tier = await createPricingTier(newTier); 
    res.status(201).json(tier);
    console.log("pricing.routes loaded");

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** יצירת שכבת תמחור חדשה עם היסטוריה */
export const createPricingTierWithHistoryController = async (req: Request, res: Response) => {
  try {
    const newTier = new PricingTierModel(req.body); // יצירת מופע מודל מ-req.body
    const tier = await createPricingTierWithHistory(newTier); // העברת המודל
    res.status(201).json(tier);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** שליפת היסטוריית שכבות תמחור */
export const getPricingHistoryController = async (req: Request, res: Response) => {
  try {
    const history = await getPricingHistory(req.params.workspaceType as any);
    res.json(history);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** שליפת שכבת התמחור הפעילה */
export const getCurrentPricingTierController = async (req: Request, res: Response) => {
  try {
    const tier = await getCurrentPricingTier(req.params.workspaceType as any);
    res.json(tier);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** עדכון שכבת תמחור לפי מזהה */
export const updatePricingTierController = async (req: Request, res: Response) => {
  try {
    // ממשיך לשלוח את req.body ישירות, כיוון שפונקציית השירות מצפה ל-Partial
    const updated = await updatePricingTier(req.params.id as any, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** עדכון קבוצתי של שכבות תמחור */
export const bulkUpdatePricingTiersController = async (req: Request, res: Response) => {
  try {
    // req.body עבור bulkUpdatePricingTiers הוא מערך של Partial<UpdatePricingTierRequest>
    // ולכן לא נדרש ליצור מודל עבור כל איבר כאן.
    const updated = await bulkUpdatePricingTiers(req.body, "system" as any);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** ביטול שכבת תמחור */
export const deletePricingTierController = async (req: Request, res: Response) => {
  try {
    const result = await deletePricingTier(req.params.id as any);
    res.json({ success: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ========================
// חדרי ישיבות
// ========================

/** יצירת תמחור חדר ישיבות */
export const createMeetingRoomPricingController = async (req: Request, res: Response) => {
  try {
    const newPricing = new MeetingRoomPricingModel(req.body); // יצירת מופע מודל מ-req.body
    const pricing = await createMeetingRoomPricing(newPricing); // העברת המודל
    res.status(201).json(pricing);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** יצירת תמחור חדר ישיבות עם היסטוריה */
export const createMeetingRoomPricingWithHistoryController = async (req: Request, res: Response) => {
  try {
    const newPricing = new MeetingRoomPricingModel(req.body); // יצירת מופע מודל מ-req.body
    const pricing = await createMeetingRoomPricingWithHistory(newPricing); // העברת המודל
    res.status(201).json(pricing);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** היסטוריית תמחור חדרי ישיבות */
export const getMeetingRoomPricingHistoryController = async (req: Request, res: Response) => {
  try {
    const history = await getMeetingRoomPricingHistory();
    res.json(history);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** תמחור פעיל לחדרי ישיבות */
export const getCurrentMeetingRoomPricingController = async (req: Request, res: Response) => {
  try {
    const pricing = await getCurrentMeetingRoomPricing();
    res.json(pricing);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** עדכון תמחור חדר ישיבות */
export const updateMeetingRoomPricingController = async (req: Request, res: Response) => {
  try {
    // ממשיך לשלוח את req.body ישירות, כיוון שפונקציית השירות מצפה ל-Partial
    const updated = await updateMeetingRoomPricing(req.params.id as any, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** ביטול תמחור חדר ישיבות */
export const deleteMeetingRoomPricingController = async (req: Request, res: Response) => {
  try {
    const result = await deleteMeetingRoomPricing(req.params.id as any);
    res.json({ success: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ========================
// לונג' (טרקלין)
// ========================

/** יצירת תמחור לונג' */
export const createLoungePricingController = async (req: Request, res: Response) => {
  try {
    const newPricing = new LoungePricingModel(req.body); // יצירת מופע מודל מ-req.body
    const pricing = await createLoungePricing(newPricing); // העברת המודל
    res.status(201).json(pricing);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** יצירת תמחור לונג' עם היסטוריה */
export const createLoungePricingWithHistoryController = async (req: Request, res: Response) => {
  try {
    const newPricing = new LoungePricingModel(req.body); // יצירת מופע מודל מ-req.body
    const pricing = await createLoungePricingWithHistory(newPricing); // העברת המודל
    res.status(201).json(pricing);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** היסטוריית תמחור לונג' */
export const getLoungePricingHistoryController = async (req: Request, res: Response) => {
  try {
    const history = await getLoungePricingHistory();
    res.json(history);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** תמחור פעיל ללונג' */
export const getCurrentLoungePricingController = async (req: Request, res: Response) => {
  try {
    const pricing = await getCurrentLoungePricing();
    res.json(pricing);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** עדכון תמחור לונג' */
export const updateLoungePricingController = async (req: Request, res: Response) => {
  try {
    // ממשיך לשלוח את req.body ישירות, כיוון שפונקציית השירות מצפה ל-Partial
    const updated = await updateLoungePricing(req.params.id as any, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** ביטול תמחור לונג' */
export const deleteLoungePricingController = async (req: Request, res: Response) => {
  try {
    const result = await deleteLoungePricing(req.params.id as any);
    res.json({ success: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};