import express from 'express';
import sqlite3 from 'sqlite3';

const router = express.Router();

export default (db) => {
    // GET all price plans
    router.get('/', async (req, res) => {
        try {
            const pricePlans = await db.all('SELECT * FROM price_plan');
            res.json(pricePlans);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve price plans' });
        }
    });

    // POST to create a new price plan
    router.post('/create', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;

        try {
            await db.run(
                'INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES (?, ?, ?)',
                [name, sms_cost, call_cost]
            );

            res.status(201).json({ message: 'Price plan created successfully' });
        } catch (error) {
            console.error('Error creating price plan:', error);
            res.status(500).json({ error: 'Failed to create price plan' });
        }
    });

    // POST to update a price plan
    router.post('/update', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;

        try {
            const result = await db.run(
                'UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?',
                [call_cost, sms_cost, name]
            );

            if (result.changes === 0) {
                return res.status(400).json({ error: 'Price plan not found or no changes made' });
            }

            res.json({ message: 'Price plan updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update price plan' });
        }
    });

    // POST to delete a price plan
    router.post('/delete', async (req, res) => {
        const { id } = req.body;

        try {
            const result = await db.run('DELETE FROM price_plan WHERE id = ?', [id]);

            if (result.changes === 0) {
                return res.status(400).json({ error: 'Price plan not found' });
            }

            res.json({ message: 'Price plan deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete price plan' });
        }
    });

    return router;
};
