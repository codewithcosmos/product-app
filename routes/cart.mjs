import { Router } from 'express';
const router = Router();
import { getCart, addToCart } from '../controllers/cartController';

router.get('/', getCart);
router.post('/add/:productId', addToCart);

export default router;
