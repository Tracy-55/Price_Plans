import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import pricePlanRoutes from './pricePlan.js';
import phoneBillRoutes from './phoneBill.js';

const app = express();
const PORT = process.env.PORT || 4011;

// Middleware
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));

// Initialize SQLite database
let db;
(async () => {
    db = await sqlite.open({
        filename: './data_plan.db',
        driver: sqlite3.Database
    });

    await db.migrate(); // Ensure the database is migrated
})();

// Use routes
app.use('/api/price_plans', pricePlanRoutes(db));
app.use('/api/phonebill', phoneBillRoutes(db));

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
