document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'http://localhost:3000/api';

    // Fetch all airports on load
    fetch(`${apiURL}/airports`, {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    })
    .then(response => response.json())
    .then(airports => {
        const airportSelect = document.getElementById('airportSelect');
        airports.forEach(airport => {
            console.log(airport)
            const option = document.createElement('option');
            option.value = airport.code;
            option.text = airport.city;
            airportSelect.add(option);
        });
    });

    document.getElementById('airportSelect').addEventListener('change', event => {
        const selectedAirportCode = event.target.value;

        // Fetch destinations for selected airport
        fetch(`${apiURL}/airports/${selectedAirportCode}/destinations`, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(response => response.json())
        .then(destinations => {
            const destinationSelect = document.getElementById('destinationSelect');
            destinationSelect.innerHTML = ''; // Clear previous options
            destinations.forEach(destination => {
                const option = document.createElement('option');
                option.value = destination.code;
                option.text = destination.city;
                destinationSelect.add(option);
            });
        });
    });

    document.getElementById('findFlightsButton').addEventListener('click', () => {
        const fromAirportCode = document.getElementById('airportSelect').value;
        const toAirportCode = document.getElementById('destinationSelect').value;

        // Fetch available flights between selected airports
        fetch(`${apiURL}/flights?from=${fromAirportCode}&to=${toAirportCode}`, {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(response => response.json())
        .then(flights => {
            const flightsContainer = document.getElementById('flightsContainer');
            flightsContainer.innerHTML = ''; // Clear previous results
            flights.forEach(flight => {
                const departureTime = new Date(flight.departureTime).toLocaleString();
                const arrivalTime = new Date(flight.arrivalTime).toLocaleString();

                const flightElement = document.createElement('div');
                flightElement.className = 'flight';
                flightElement.innerHTML = `
                    <p>Flight ID: ${flight.id}</p>
                    <p>Departure: ${departureTime}</p>
                    <p>Arrival: ${arrivalTime}</p>
                    <p>Price: ${flight.price} ${flight.currency}</p>
                `;
                flightsContainer.appendChild(flightElement);
            });
        });
    });
});
