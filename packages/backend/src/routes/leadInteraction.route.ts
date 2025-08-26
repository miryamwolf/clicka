import express from 'express';
import * as controllerInteraction from '../controllers/interaction.controller'; 

const routerInteraction = express.Router();

routerInteraction.get('/', controllerInteraction.getAllInteractions);

routerInteraction.post('/', controllerInteraction.postInteractionToLead);

routerInteraction.patch('/:id', controllerInteraction.patchInteraction);

routerInteraction.delete('/:id', controllerInteraction.deleteInteraction);

export default routerInteraction;