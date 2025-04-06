// Importing mongoose library along with Connection type from it
import mongoose, { Connection } from "mongoose";


let cachedConnection: Connection | null = null;

// Function to establish a connection to MongoDB
export default async function dbConnect() {

  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }
  try {

    const cnx = await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL!);

    cachedConnection = cnx.connection;

    console.log("New mongodb connection established");

    return cachedConnection;
  } catch (error) {
    // If an error occurs during connection, log the error and throw it
    console.log(error);
    throw error;
  }
}