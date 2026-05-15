import express from 'express';
import Ingredient from '../models/Ingredient.js';
import Order from '../models/Order.js';
import { authenticate as protect } from '../middlewares/auth.js';

const router = express.Router();

// Get all ingredients
router.get('/ingredients', protect, async (req, res) => {
    try {
        const ingredients = await Ingredient.find({}).sort({ phase: 1, name: 1 });
        res.json({ success: true, data: ingredients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update or Add stock
router.post('/ingredients/update', protect, async (req, res) => {
    try {
        const { name, phase, stockGrams, minThreshold } = req.body;

        const gramsToAdd = parseFloat(stockGrams) || 0;
        const threshold = parseFloat(minThreshold) || 500;

        const ingredient = await Ingredient.findOneAndUpdate(
            { name, phase },
            {
                $set: { minThreshold: threshold },
                $inc: { stockGrams: gramsToAdd }
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: ingredient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Reset/Set absolute stock
router.put('/ingredients/:id', protect, async (req, res) => {
    try {
        const { stockGrams, minThreshold } = req.body;
        const ingredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            { stockGrams, minThreshold },
            { new: true }
        );
        res.json({ success: true, data: ingredient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete ingredient
router.delete('/ingredients/:id', protect, async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Ingredient deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Check stock for an order
router.get('/ingredients/check-order/:orderId', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        const requiredGrams = order.totalQuantity * 30;
        const ingredients = await Ingredient.find({ phase: order.phase });

        // Simple logic: if ANY ingredient for that phase is less than requiredGrams, it's a risk
        // In a real recipe, it might be partial grams, but here we assume the phase ingredients
        // collectively need to support the 30g per laddu requirement.

        const issues = ingredients.filter(ing => ing.stockGrams < requiredGrams);

        res.json({
            success: true,
            hasStock: issues.length === 0,
            requiredGrams,
            availableIngredients: ingredients,
            issues: issues.map(i => i.name)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
