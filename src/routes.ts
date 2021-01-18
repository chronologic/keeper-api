import { Router } from 'express';
import { userController } from './controllers';

const router = Router();

router.post('/user', userController.getOrCreate);
router.put('/user/:id', userController.edit);

// router.put('/deposits', BookController.search);

export default router;
