import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const url = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        await db.dropDatabase();

        const collection = db.collection('images');

        // Seed Data
        const images = [
            { context: "A person standing on a rock near a body of water", tags: ["person", "rock", "standing", "water"], source: "https://plus.unsplash.com/premium_photo-1709311451432-47842abbf124?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { context: "A cup of coffee siting on top of a cloth", tags: ["cup", "coffee", "cloth"], source: "https://images.unsplash.com/photo-1710403690356-e651c9730491?q=80&w=2892&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        ];

        const insertResult = await collection.insertMany(images);
        console.log('Inserted documents:', insertResult.insertedCount);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
