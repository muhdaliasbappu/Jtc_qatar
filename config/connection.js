const { MongoClient } = require("mongodb");

const state = {
    db: null,
};

// Function to establish MongoDB connection
const connect = async (subdomain, cb) => {
    // Define your database configurations based on subdomains
    const databaseConfigs = {
        jtcqatar: {
            host: "127.0.0.1",
            port: 27017,
            dbName: "Jtcqatars",
        },
        ifx: {
            host: "127.0.0.1",
            port: 27017,
            dbName: "demo",
        },
        // Add more configurations as needed
    };

    // Get the database configuration based on the subdomain
    const dbConfig = databaseConfigs[subdomain];

    // If no matching configuration found, throw an error
    if (!dbConfig) {
        const error = new Error(`No database configuration found for subdomain: ${subdomain}`);
        return cb(error);
    }

    // Create a new MongoDB client object
    const client = new MongoClient(`mongodb://${dbConfig.host}:${dbConfig.port}`, { useNewUrlParser: true });

    try {
        // Connecting to MongoDB
        await client.connect();
        // Setting up database name to the connected client
        const db = client.db(dbConfig.dbName);
        // Setting up database name to the state
        state.db = db;
        // Callback after connected
        return cb();
    } catch (err) {
        // Callback when an error occurs
        return cb(err);
    }
};

// Function to get the database instance
const get = () => state.db;

// Exporting functions
module.exports = {
    connect,
    get,
};

