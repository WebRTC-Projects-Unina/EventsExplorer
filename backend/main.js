import app from './server.js';

const port = 3000;


// Start the server
app.listen(port, () => {
    console.log(`Event API server running at http://localhost:${port}`);
});