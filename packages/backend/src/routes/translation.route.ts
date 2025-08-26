import express from 'express';
import { translationController } from '../controllers/translation.controller';


const translationRouter = express.Router();


// translationRouter.get('/', translationController.getAll);
// translationRouter.get('/:id', translationController.getById);
// translationRouter.get('/lang/:lang', translationController.getByLang);
// translationRouter.get('/key/:key', translationController.getByKey);
translationRouter.get('/locales/:lng/:ns.json', translationController.getTranslationFile);
translationRouter.post('/', translationController.create);
// translationRouter.post('/', translationController.createTranslation);
// translationRouter.patch('/:id', translationController.update);
// translationRouter.delete('/:id', translationController.remove);

export default translationRouter;
