import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URL) {
  throw new Error('Missing env. variable: "MONGODB_URL"')
}

const url = process.env.MONGODB_URL
const options = {}

const client = new MongoClient(url, options)
const clientPromise = client.connect()


export default clientPromise
