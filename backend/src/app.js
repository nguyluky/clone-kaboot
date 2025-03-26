require('dotenv').config()

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

// Initialize app
const app = express();
const DEFAULT_PORT = 3030;
const PORT = process.env.PORT || DEFAULT_PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Only start the server if this file is run directly (not imported as a module)
if (require.main === module) {
    // Function to find an available port
    const findAvailablePort = (port) => {
        return new Promise((resolve, reject) => {
            const server = require('http').createServer();

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy, trying ${port + 1}...`);
                    resolve(findAvailablePort(port + 1));
                } else {
                    reject(err);
                }
            });

            server.on('listening', () => {
                server.close();
                resolve(port);
            });

            server.listen(port);
        });
    };

    // Start server on available port
    findAvailablePort(PORT)
        .then(availablePort => {
            app.listen(availablePort, () => {
                console.log(`Server running on port ${availablePort}`);
            });
        })
        .catch(err => {
            console.error('Failed to find an available port:', err);
            process.exit(1);
        });
} else {
    // Export app for testing
    module.exports = app;
}
