import { MongoClient } from 'mongodb';

const url = process.env.MONGO_DB_URI;
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
            {
                context: "A person standing on a rock near a body of water",
                tags: ["person", "rock", "standing", "water"],
                source: "https://plus.unsplash.com/premium_photo-1709311451432-47842abbf124?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
            {
                context: "A cup of coffee siting on top of a cloth",
                tags: ["cup", "coffee", "cloth"],
                source: "https://images.unsplash.com/photo-1710403690356-e651c9730491?q=80&w=2892&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
            {
                context: "A serene lakeside view at dawn with a solitary boat",
                tags: ["lake", "boat", "dawn"],
                source: "https://images.unsplash.com/photo-1592677298363-c2586b8cafde?q=80&w=3872&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              },
              {
                context: "A bustling city street at night illuminated by neon lights",
                tags: ["city", "night", "neon"],
                source: "https://plus.unsplash.com/premium_photo-1675148247638-fb5c8db249a2?q=80&w=3808&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              },
              {
                context: "A cozy reading nook by a window with raindrops, including a stack of books and a warm blanket",
                tags: ["reading nook", "books", "rain"],
                source: "https://plus.unsplash.com/premium_photo-1663089015079-614a5e49618b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVhZGluZyUyMHJhaW5kcm9wcyUyMGJvb2tzfGVufDB8fDB8fHww"
              }
        ];

        const insertResult = await collection.insertMany(images);
        console.log('Inserted documents:', insertResult.insertedCount);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
