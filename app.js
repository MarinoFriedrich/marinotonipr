const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else 
        console.log("Error occurred, server can't start", error);
});

let airports = null;
fs.readFile('mockData/airports.json', 'utf-8', (err, data) => {
    if (err) throw err;
    airports = JSON.parse(data);
});

let destinations = null;
fs.readFile('mockData/destinations.json', 'utf-8', (err, data) => {
    if (err) throw err;
    destinations = JSON.parse(data);
});

let offers = [];
let offersReference = 0;
let bookings = [];
let bookingsReference = 0;

const generateRandomDateTime = () => {
    const now = new Date();
    const departure = new Date(now.getTime() + Math.random() * (7 * 24 * 60 * 60 * 1000));
    const arrival = new Date(departure.getTime() + Math.random() * (12 * 60 * 60 * 1000));
    return { departure, arrival };
};

const generateRandomPrice = () => {
    return (50 + Math.random() * 450).toFixed(2);
};

app.get('/api/airports', (req, res) => {
    res.send(airports);
});

app.get('/api/airports/:code/destinations', (req, res) => {
    const airportCode = req.params.code;
    const airportDestinations = destinations[airportCode];
    
    if (airportDestinations) {
        res.send(airportDestinations);
    } else {
        res.status(404).send({ error: "Airport code not found" });
    }
});

app.post('/api/flights', (req, res) => {
    const fromCode = req.query.from;
    const toCode = req.query.to;

    if (!fromCode) {
        return res.status(400).send({ error: "Missing query parameter: fromCode." });
    }
    if (!toCode) {
        return res.status(400).send({ error: "Missing query parameter: toCode." });
    }
    if (typeof fromCode !== "string") {
        return res.status(400).send({ error: "Illegal type: fromCode has to be of type string." });
    }
    if (typeof toCode !== "string") {
        return res.status(400).send({ error: "Illegal type: toCode has to be of type string." });
    }

    const fromDestinations = destinations[fromCode];

    if (!fromDestinations) {
        return res.status(404).send({ error: `Departure airport code ${fromCode} not found` });
    }

    const toAirport = fromDestinations.find(destination => destination.code === toCode);

    if (!toAirport) {
        return res.status(404).send({ error: `No direct flights found from ${fromCode} to ${toCode}` });
    }

    const numFlights = Math.floor(Math.random() * 5) + 1;
    const flightOptions = [];

    for (let i = 0; i < numFlights; i++) {
        const { departure, arrival } = generateRandomDateTime();
        const price = generateRandomPrice();
        const airlineCode = Math.random() < 0.5 ? "RYR" : "WZZ";
        
        offersReference += 1;
        const flight = {
            id: airlineCode + (offersReference),
            departureAirport: fromCode,
            arrivalAirport: toCode,
            departureTime: departure.toISOString(),
            arrivalTime: arrival.toISOString(),
            price: price,
            currency: "EUR"
        };

        flightOptions.push(flight);
        offers.push(flight);
    }

    res.send(flightOptions);
});

app.post('/api/bookings', (req, res) => {
    const { userInfo, cardInfo, offerId } = req.body;

    if (!userInfo || !cardInfo || !offerId) {
        return res.status(400).send({ error: "Missing required booking information." });
    }

    if (!userInfo.email || !userInfo.phoneNumber || !userInfo.fullName) {
        return res.status(400).send({ error: "[user] object missing one or more attributes. Required attributes: email, phoneNumber, fullName." });
    }

    if (!cardInfo.cardNumber || !cardInfo.expirationDate || !cardInfo.cvv) {
        return res.status(400).send({ error: "[cardInfo] object missing one or more attributes. Required attributes: cardNumber, expirationDate, cvc." });
    }

    const offer = offers.find(offer => offer.id === offerId);

    if (!offer) {
        return res.status(404).send({ error: `Offer with id ${offerId} not found.` });
    }

    bookingsReference += 1;

    const booking = {
        id: "BOOK" + bookingsReference,
        userInfo,
        cardInfo,
        offer,
        bookingDate: new Date().toISOString()
    };

    bookings.push(booking);

    res.send(booking);
});

app.get('/api/bookings/:email', (req, res) => {
    const email = req.params.email;
    const foundBookings = bookings.filter(booking => booking.userInfo.email === email);
    
    if (foundBookings.length === 0) {
        return res.status(404).send({ error: `No bookings for user with email=${email} found.` });
    }

    res.status(200).send(foundBookings);
});

app.get('/api/bookings', (req, res) => {
    res.send(bookings);
});

app.delete('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    const bookingIndex = bookings.findIndex(booking => booking.id === id);

    if (bookingIndex === -1) {
        return res.status(404).send({ error: `No booking with id=${id} found.` });
    }

    bookings.splice(bookingIndex, 1);

    res.sendStatus(204);
});
