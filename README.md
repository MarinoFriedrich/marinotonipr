# Flight Service

Flight Service is used to fetch and book flights to a limited number of destinations.

## Info

This service is provided by OG Consultancy Services to allow students to learn Frontend development.

The data presented is not real data but mock data for development purposes.

## What Do I need to install?

- Node.js

## How to run the service?

- Enter this directory/folder in terminal
- Use the following command to install the dependant packages:

```sh
npm install
```

- To start the service use the following command:

```sh
node app.js
```

## How to try the endpoints without writing code?

- Install [Bruno](https://www.usebruno.com/)
- Open Bruno and press **Open Collection**
- Select the whole Flight folder
- Try out the endpoints


## Available Endpoints - API Documentation

### Fetch All airports

GET /api/airports

Example response:
```json
[
  {
    "code": "LAX",
    "city": "Los Angeles",
    "country": "USA"
  },
  {
    "code": "JFK",
    "city": "New York",
    "country": "USA"
  },
  {
    "code": "OSI",
    "city": "Osijek",
    "country": "Croatia"
  },
  {
    "code": "ZAG",
    "city": "Zagreb",
    "country": "Croatia"
  },
  {
    "code": "NAP",
    "city": "Naples",
    "country": "Italy"
  }
]
```

### Fetch Available Destinations By Deprature Airport

GET /api/airports/:airportCode/destinations

Example:

To fetch all possible destinations from Los Angeles Airport (LAX):

*/api/airports/LAX/destinations*

Example response:

```json
[
  {
    "code": "JFK",
    "city": "New York",
    "country": "USA"
  },
  {
    "code": "OSI",
    "city": "Osijek",
    "country": "Croatia"
  },
  {
    "code": "ZAG",
    "city": "Zagreb",
    "country": "Croatia"
  }
]
```

### Create Flight offer

POST /api/flights?from=:airportCode&to=:airportCode

Example:

To get flight offers from Naples to Zagreb:

*/api/flights?from=NAP&to=ZAG*

Example Response:

```json
[
  {
    "id": "RYR1",
    "departureAirport": "NAP",
    "arrivalAirport": "ZAG",
    "departureTime": "2024-07-10T13:44:32.047Z",
    "arrivalTime": "2024-07-10T22:42:27.453Z",
    "price": "484.12",
    "currency": "EUR"
  },
  {
    "id": "WZZ2",
    "departureAirport": "NAP",
    "arrivalAirport": "ZAG",
    "departureTime": "2024-07-09T12:09:10.820Z",
    "arrivalTime": "2024-07-09T22:23:22.925Z",
    "price": "392.16",
    "currency": "EUR"
  }
]
```

### Book a flight

POST /api/bookings

Body:

```json
{
  "userInfo": {
    "email": "ime.prezime@email.com",
    "phoneNumber": "+385123456789",
    "fullName": "Ime Prezime"
  },
  "cardInfo": {
    "cardNumber": "1234 1234 1234 1234",
    "expirationDate": "08/28",
    "cvv": "123"
  },
  "offerId": "RYR1"
}
```

NOTE: **offerId has to match the offerId retrieved from Flight offer request**

Example response:

```json
{
  "id": "BOOK2",
  "userInfo": {
    "email": "ime.prezime@email.com",
    "phoneNumber": "+385123456789",
    "fullName": "Ime Prezime"
  },
  "cardInfo": {
    "cardNumber": "1234 1234 1234 1234",
    "expirationDate": "08/28",
    "cvv": "123"
  },
  "offer": {
    "id": "RYR1",
    "departureAirport": "NAP",
    "arrivalAirport": "ZAG",
    "departureTime": "2024-07-10T13:44:32.047Z",
    "arrivalTime": "2024-07-10T22:42:27.453Z",
    "price": "484.12",
    "currency": "EUR"
  },
  "bookingDate": "2024-07-04T16:00:21.608Z"
}
```

### Retrieve Bookings by email

GET /api/bookings/:email

Example:
*/api/bookings/ime.prezime@email.com*

Example response:

```json
[
  {
    "id": "BOOK1",
    "userInfo": {
      "email": "ime.prezime@email.com",
      "phoneNumber": "+385123456789",
      "fullName": "Ime Prezime"
    },
    "cardInfo": {
      "cardNumber": "1234 1234 1234 1234",
      "expirationDate": "08/28",
      "cvv": "123"
    },
    "offer": {
      "id": "WZZ2",
      "departureAirport": "NAP",
      "arrivalAirport": "ZAG",
      "departureTime": "2024-07-09T12:09:10.820Z",
      "arrivalTime": "2024-07-09T22:23:22.925Z",
      "price": "392.16",
      "currency": "EUR"
    },
    "bookingDate": "2024-07-04T16:00:17.051Z"
  }
]
```

### Get All Bookings

GET /api/bookings

### Refund a Booking (Delete)

DELETE /api/bookings/:bookingId

NOTE: **bookingId has to match the bookingId returned in response when creating or retrieving a booking.**