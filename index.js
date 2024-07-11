document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'http://localhost:3000/api';

    fetch(`${apiURL}/airports`)
    .then(response => response.json())
    .then(airports => {
        const airportSelect = document.getElementById('airportSelect');
        airports.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport.code;
            option.text = airport.city;
            airportSelect.add(option);
        });
    });

    document.getElementById('airportSelect').addEventListener('change', event => {
        const selectedAirportCode = event.target.value;

        fetch(`${apiURL}/airports/${selectedAirportCode}/destinations`)
        .then(response => response.json())
        .then(destinations => {
            const destinationSelect = document.getElementById('destinationSelect');
            destinationSelect.innerHTML = '';
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

        fetch(`${apiURL}/flights?from=${fromAirportCode}&to=${toAirportCode}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(flights => {
            const flightsContainer = document.getElementById('flightsContainer');
            flightsContainer.innerHTML = '';
            flights.forEach(flight => {
                const departureTime = new Date(flight.departureTime).toLocaleString();
                const arrivalTime = new Date(flight.arrivalTime).toLocaleString();

                const flightElement = document.createElement('div');
                flightElement.className = 'flight';
                flightElement.innerHTML = `
                    <p>ID Leta: ${flight.id}</p>
                    <p>Polijetanje: ${departureTime}</p>
                    <p>Sljetanje: ${arrivalTime}</p>
                    <p>Cijena: ${flight.price} ${flight.currency}</p>
                    <div class="button-container">
                        <button class="bookFlightButton">Rezerviraj let</button>
                    </div>
                    <div class="slider" style="display: none;">
                        <label for="fullName">Ime i prezime:</label>
                        <input type="text" id="fullName" required>
                        <label for="email">Email:</label>
                        <input type="email" id="email" required>
                        <label for="phoneNumber">Broj telefona:</label>
                        <input type="tel" id="phoneNumber" required>
                        <label for="cardNumber">Broj kartice:</label>
                        <input type="text" id="cardNumber" required>
                        <label for="expiryDate">Datum isticanja:</label>
                        <input type="text" id="expiryDate" required>
                        <label for="cvv">CVV:</label>
                        <input type="text" id="cvv" required>
                        <button class="confirmBookingButton">Potvrdi rezervaciju</button>
                    </div>
                `;

                const bookFlightButton = flightElement.querySelector('.bookFlightButton');
                bookFlightButton.addEventListener('click', () => {
                    const slider = flightElement.querySelector('.slider');
                    slider.style.display = (slider.style.display === 'none' || slider.style.display === '') ? 'block' : 'none';
                });

                const confirmBookingButton = flightElement.querySelector('.confirmBookingButton');
                confirmBookingButton.addEventListener('click', () => {
                    const fullName = flightElement.querySelector('#fullName').value;
                    const email = flightElement.querySelector('#email').value;
                    const phoneNumber = flightElement.querySelector('#phoneNumber').value;
                    const cardNumber = flightElement.querySelector('#cardNumber').value;
                    const expiryDate = flightElement.querySelector('#expiryDate').value;
                    const cvv = flightElement.querySelector('#cvv').value;

                    
                    if (!fullName || !email || !phoneNumber || !cardNumber || !expiryDate || !cvv) {
                        alert('Molimo ispunite sva polja.');
                        return;
                    }

                    const bookingData = {
                        userInfo: {
                            fullName,
                            email,
                            phoneNumber
                        },
                        cardInfo: {
                            cardNumber,
                            expirationDate: expiryDate,
                            cvv
                        },
                        offerId: flight.id 
                    };

                    fetch(`${apiURL}/bookings`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(bookingData)
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log('Booking response:', result);
                        alert('Rezervacija potvrđena!');
                    })
                    .catch(error => {
                        console.error('Error booking flight:', error);
                        alert('Dogodila se greška prilikom rezervacije leta. Molimo pokušajte ponovo kasnije.');
                    });
                });

                flightsContainer.appendChild(flightElement);
            });
        })
        .catch(error => {
            console.error('Error finding flights:', error);
            alert('Dogodila se greška prilikom pretrage letova. Molimo pokušajte ponovo kasnije.');
        });
    });
});

const apiURL = 'http://localhost:3000/api/bookings/'; 

document.addEventListener('DOMContentLoaded', () => {
   
    const emailForm = document.getElementById('email-form');
    emailForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const email = document.getElementById('email').value; 
        fetchBookingsByEmail(email);
    });
});

function fetchBookingsByEmail(email) {
    fetch(`${apiURL}${encodeURIComponent(email)}`)
        .then(response => response.json()) 
        .then(bookings => {
            displayBookings(bookings); 
        })
        .catch(error => {
            console.error('Error fetching bookings:', error); 
            alert('Dogodila se greška prilikom dohvaćanja rezervacija.'); 
        });
}

function displayBookings(bookings) {
    const bookingList = document.getElementById('booking-list'); 
    bookingList.innerHTML = ''; 

    if (bookings.length === 0) {
        bookingList.innerHTML = '<p>Nema rezervacija za ovaj email.</p>'; 
        return;
    }

    const ul = document.createElement('ul'); 
    bookings.forEach(booking => {
        const li = document.createElement('li'); 
        li.textContent = `Let ID: ${booking.id}, Ime: ${booking.userInfo.fullName}, Telefon: ${booking.userInfo.phoneNumber}, Vrijeme polaska: ${booking.offer.departureTime}, Vrijeme dolaska: ${booking.offer.arrivalTime}`; 
        ul.appendChild(li); 
    });

    bookingList.appendChild(ul); 
}
document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'http://localhost:3000/api';


    const fetchBookingsByEmail = (email) => {
        fetch(`${apiURL}/bookings/${encodeURIComponent(email)}`)
            .then(response => response.json())
            .then(bookings => {
                displayBookings(bookings);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                alert('Dogodila se greška prilikom dohvaćanja rezervacija.');
            });
    };

    
    const displayBookings = (bookings) => {
        const bookingList = document.getElementById('booking-list');
        bookingList.innerHTML = '';

        if (bookings.length === 0) {
            bookingList.innerHTML = '<p>Nema rezervacija za ovaj email.</p>';
            return;
        }

        const ul = document.createElement('ul');
        bookings.forEach(booking => {
            const li = document.createElement('li');
            li.textContent = `Let ID: ${booking.id}, Ime: ${booking.userInfo.fullName}, Telefon: ${booking.userInfo.phoneNumber}, Vrijeme polaska: ${booking.offer.departureTime}, Vrijeme dolaska: ${booking.offer.arrivalTime}`; 
       
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Obriši';
            deleteButton.addEventListener('click', () => {
                deleteBooking(booking.id);
            });
            
            li.appendChild(deleteButton); 
            ul.appendChild(li);
        });

        bookingList.appendChild(ul);
    };

    
    const deleteBooking = (bookingId) => {
        fetch(`${apiURL}/bookings/${bookingId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Rezervacija uspješno obrisana.');
                
                const email = document.getElementById('email').value;
                fetchBookingsByEmail(email);
            } else {
                throw new Error('Neuspješan zahtjev za brisanje.');
            }
        })
        .catch(error => {
            console.error('Error deleting booking:', error);
            alert('Dogodila se greška prilikom brisanja rezervacije.');
        });
    };

    const emailForm = document.getElementById('email-form');
    emailForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        fetchBookingsByEmail(email);
    });
});
