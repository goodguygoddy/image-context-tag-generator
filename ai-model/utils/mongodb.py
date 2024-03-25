from pymongo import MongoClient

def get_mongodb_collection(mongo_db_url, mongo_db_name, mongo_db_collection):
    client = MongoClient(mongo_db_url)
    db = client[mongo_db_name]
    collection = db[mongo_db_collection]
    return collection
