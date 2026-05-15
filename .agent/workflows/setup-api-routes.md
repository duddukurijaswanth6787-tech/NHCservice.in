---
description: How to add new API routes to the Cycle Harmony project
---

Follow these steps to add a new set of API routes (e.g., reviews, blog posts, etc.) to the project.

### 1. Create a Mongoose Model
Create a new model in `server/models/[ModelName].js`.
Use `Product.js` or `Customer.js` as a template.

### 2. Create the Route Handler
Create a new route file in `server/routes/[modelName]Routes.js`.

Template:
```javascript
import express from 'express';
import [ModelName] from '../models/[ModelName].js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route example
router.get('/[plural-name]', async (req, res) => {
    try {
        const items = await [ModelName].find();
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Protected route example
router.post('/[plural-name]', protect, async (req, res) => {
    // Logic here
});

export default router;
```

### 3. Register the Route
Open `server/server.js` and add:

```javascript
import [modelName]Routes from './routes/[modelName]Routes.js';
...
app.use('/api', [modelName]Routes);
```

### 4. Verify
// turbo
1. Restart the server with `npm run dev` in the `server` directory.
2. Test the endpoint using `curl` or the `browser_subagent`.
