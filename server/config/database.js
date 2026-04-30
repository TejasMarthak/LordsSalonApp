import mongoose from "mongoose";

const connectDB = async (retryCount = 0) => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log(`[MongoDB] Attempting connection (attempt ${retryCount + 1})...`);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log(`✅ [MongoDB] Successfully connected to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection failed: ${error.message}`);
    
    if (error.message.includes("querySrv") || error.message.includes("ECONNREFUSED")) {
      console.error(`\n⚠️  DNS/Network Issue - MongoDB Atlas cannot be reached`);
      console.error(`\n   Possible causes:`);
      console.error(`   • No internet connection`);
      console.error(`   • DNS cannot resolve mongodb.net domain`);
      console.error(`   • Firewall/VPN blocking the connection`);
      console.error(`   • MongoDB Atlas cluster is down`);
    }
    
    if (retryCount < 5) {
      console.log(`[MongoDB] Retrying in 15 seconds... (attempt ${retryCount + 1}/5)`);
      setTimeout(() => connectDB(retryCount + 1), 15000);
    } else {
      console.error(`\n❌ [MongoDB] Failed after 5 attempts - giving up`);
      process.exit(1);
    }
  }
};

export default connectDB;
