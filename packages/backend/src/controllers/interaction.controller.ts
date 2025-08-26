import { Request, Response } from 'express';
import { interactionService } from "../services/interaction.service";
import { LeadInteractionModel } from '../models/leadInteraction.model';


const serviceInteraction = new interactionService();

export const deleteInteraction = async (req: Request, res: Response) => {
    const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
    try {
        await serviceInteraction.delete(id);
        res.status(200).json({ message: 'Interaction deleted successfully' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error deleting interaction', error });
    }
}


export const getAllInteractions = async (req: Request, res: Response) => { 
    try {
        const interactions = await serviceInteraction.getAll();
        res.status(200).json(interactions);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching interactions', error });
    }
};

// הוספת אינטרקציה לליד קיים
export const postInteractionToLead = async (req: Request, res: Response) => {
    const {interactionData } = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await serviceInteraction.post(interactionData);
        res.status(200).json({ message: 'Interaction added to lead' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error adding interaction', error });
    }
}

// עדכון אינטרקציה
export const patchInteractions = async (req: Request, res: Response) => {
    const data: LeadInteractionModel = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
    const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
    try {
        await serviceInteraction.patch(data , id);
        res.status(200).json({ message: 'Interactions updated from CSV' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error updating interactions', error });
    }
}

export const patchInteraction = async (req: Request, res: Response) => {
    const data: LeadInteractionModel = req.body; 
    const { id } = req.params; 
    try {
        await serviceInteraction.patch(data , id);
        res.status(200).json({ message: 'Interactions updated' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error updating interactions', error });
    }
}