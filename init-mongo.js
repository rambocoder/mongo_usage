// init-mongo.js

// Switch to the admin database to create the user
db = db.getSiblingDB('admin');

db.createUser({
  user: 'myuser',
  pwd: 'mypassword',
  roles: [
    {
      role: 'readWrite',
      db: 'mydatabase', // Grant readWrite access to 'mydatabase'
    },
  ],
});

// Switch to 'mydatabase' (this will create it if it doesn't exist)
db = db.getSiblingDB('mydatabase');

// Create the 'users' collection
db.createCollection('users');

// Optional: Insert a sample document
db.users.insertOne({
  name: 'Test User',
  email: 'test@example.com',
  created_time: new Date(),
});

printjson('Database and user initialized successfully.');