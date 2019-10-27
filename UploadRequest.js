var async = require('async');
var fs = require('fs');
var pg = require('pg');

let submission = "Show me cute animal videos"

// Connect to the "bank" database.
var config = {
    user: 'melodyding',
    host: 'gcp-us-west1.tryme-calhacks2019.crdb.io',
    database: 'defaultdb',
    port: 26257,
    ssl: {
        ca: fs.readFileSync('tryme-calhacks2019-ca')
            .toString(),
        key: fs.readFileSync('certs/client.maxroach.key')
            .toString(),
        cert: fs.readFileSync('certs/client.maxroach.crt')
            .toString()
    }
};

// Create a pool.
var pool = new pg.Pool(config);

pool.connect(function (err, client, done) {

    // Close communication with the database and exit.
    var finish = function () {
        done();
        process.exit();
    };

    if (err) {
        console.error('could not connect to cockroachdb', err);
        finish();
    }
    async.waterfall([
            function (next) {
                // Create the 'accounts' table.
                client.query('CREATE TABLE IF NOT EXISTS requests (id INT PRIMARY KEY, request varchar(280));', next);
            },
            function (results, next) {
                // Insert two rows into the 'accounts' table.
                client.query('INSERT INTO requests (id, request) VALUES (1, submission);', next);
            },
        ],
        function (err, results) {
            if (err) {
                console.error('Error inserting into and selecting from accounts: ', err);
                finish();
            }

            console.log('Initial balances:');
            results.rows.forEach(function (row) {
                console.log(row);
            });

            finish();
        });
});