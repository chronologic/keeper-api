import { Router } from 'express';
import { depositController, userController } from './controllers';

const router = Router();

router.post('/user', userController.getOrCreate);
router.patch('/user/:address', userController.edit);

router.get('/deposits', depositController.list);

export default router;
