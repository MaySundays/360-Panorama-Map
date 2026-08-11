import mysql from 'mysql2';

// Configure the connection parameters based on WampServer settings
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Default WampServer user
  password: '',      // Default WampServer password is empty
  database: 'panorama', // Change to your phpMyAdmin database name
  port: 3306         // Double check if your WampServer MySQL is on 3306 or 3308
});

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to WampServer MySQL:', err.message);
    return;
  }
  console.log('Successfully connected to WampServer MySQL database!');
  
  // Optional: Run a test query
  connection.query('SELECT 1 + 1 AS solution', (queryErr, results) => {
    if (queryErr) throw queryErr;
    console.log('Test query solution is: ', results[0].solution);
    
    // Close connection when done
    connection.end();
  });
});
