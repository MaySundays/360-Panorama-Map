import cors from 'cors';
import express from 'express';
const app = express();

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500']
}));

app.get('/', (req, res) => {
    res.send('Hi it is absolutely working!')
})

app.get('/about', (req, res) => {
    res.send('This is about page!')
});

app.get('/test', (req, res) => {
    res.json([
        { id: 1, name: 'Narzisse' },
        { id: 2, name: 'Lilie' }
    ])
});

app.get('/test/:id', (req, res) => {
    const id  = Number(req.params.id);

    const name = [
        { id: 1, name: 'Narzisse' },
        { id: 2, name: 'Lilie' }
    ];

    const requestedName = name.find((name) => name.id === id);
    res.json(requestedName);
});

app.get('/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.listen(3000, () => {
    console.log('Server is running now!');
});