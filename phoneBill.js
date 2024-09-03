import express from 'express';

const router = express.Router();

export default (db) => {
    // POST to calculate the phone bill
    router.post('/', async (req, res) => {
        const { price_plan, actions } = req.body;

        try {
            const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);

            if (!plan) {
                return res.status(400).json({ error: 'Price plan not found' });
            }

            const actionsArray = actions.split(',').map(action => action.trim());
            let total = 0;

            actionsArray.forEach(action => {
                if (action === 'call') {
                    total += plan.call_price;
                } else if (action === 'sms') {
                    total += plan.sms_price;
                }
            });

            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: 'Failed to calculate the total phone bill' });
        }
    });

    return router;
};
