import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phase: {
        type: String,
        required: true,
        enum: ['Phase-1', 'Phase-2'],
        trim: true
    },
    stockGrams: {
        type: Number,
        required: true,
        default: 0
    },
    minThreshold: {
        type: Number,
        default: 500 // Alert when below 500g
    }
}, {
    timestamps: true
});

// Compound index to ensure ingredient names are unique per phase
ingredientSchema.index({ name: 1, phase: 1 }, { unique: true });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
