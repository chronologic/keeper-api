import { Router } from 'express';
import { depositController, userController } from './controllers';

const router = Router();

router.post('/users', userController.getOrCreate);
router.patch('/users/:address', userController.edit);

router.get('/deposits', depositController.list);

export default router;
