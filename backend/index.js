require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5050;
const M_API_KEY = process.env.MARTA_API_KEY;
const W_API_KEY = process.env.WEATHER_API_KEY;
app.use(cors());
app.use(express.json());

const fetchMarta = async (weather) => {
    try {
        const response = await axios.get(`https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${M_API_KEY}`);
        const posts = response.data;
        const arrival = "MIDTOWN STATION";
        const trainArrivalData = [];

        for (let i = 0; i < posts.length; i++) {

            if (posts[i].WAITING_TIME == "Arriving") {
                continue
            }
            const spaceIndex = posts[i].WAITING_TIME.indexOf(" ");
            const waitingInteger = Number(posts[i].WAITING_TIME.substring(0, spaceIndex));

            if ((posts[i].STATION == arrival) && (waitingInteger > 5) && (posts[i].DESTINATION == "Doraville")) {
                trainArrivalData.push(posts[i]);
            }
        }

        printString = "🚆 Midtown Station arrivals: ";
        for (let i = 0; i < trainArrivalData.length; i++) {
            let nextArrival = trainArrivalData[i].NEXT_ARR.substring(0, 5);

            if (trainArrivalData[i].NEXT_ARR.charAt(0) == "0") {
                nextArrival = trainArrivalData[i].NEXT_ARR.substring(1, 5);
            }

            if (i < trainArrivalData.length - 1) {

                printString += trainArrivalData[i].WAITING_TIME + " (" 
                + nextArrival + "PM), ";
            } else {
                printString += "and " + trainArrivalData[i].WAITING_TIME + " (" 
                + nextArrival+ "PM).";
            }
        }
        printString += " The weather will be " + weather + " today."

        return printString;

    } catch (err) {
      console.error('Error fetching posts:', err.message);
    }
};

fetchWeather = async () => {
    try {

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${W_API_KEY}&q=33.781738,-84.383018`);
        posts = response.data;


        weather = posts.current.condition.text;

        return weather;

    } catch (err) {
        console.error('Error fetching weather:', err.message);
    }
}

app.get('/api/traininfo', async (req, res) => {
    try {
        const weather = await fetchWeather();
        const message = await fetchMarta(weather);
        res.json({ message });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.get('/api/martainfo', async (req, res) => {
    try {
        const response = await axios.get(`https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${M_API_KEY}`);
        const posts = response.data;
        res.json({ posts });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/api/martainfo/line/:lineName', async (req, res) => {
    try {
        const lineName = req.params.lineName.toLowerCase();
        const response = await axios.get(`https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${M_API_KEY}`);
        const posts = response.data;
        const trains = [];
        const trainIds = [];
        const error = "Error: Not a valid line.";
        for (let i = 0; i < posts.length; i++) {

            if (!trainIds.includes(posts[i].TRAIN_ID)) {
                if (lineName == "gold") {
                    if ((posts[i].LINE == "GOLD")) {
                        trains.push(posts[i]);
                        trainIds.push(posts[i].TRAIN_ID);
                    }
                } else if (lineName == "red") {
                    if ((posts[i].LINE == "RED")) {
                        trains.push(posts[i]);
                        trainIds.push(posts[i].TRAIN_ID);
                    }
                } else if (lineName == "blue") {
                    if ((posts[i].LINE == "BLUE")) {
                        trains.push(posts[i]);
                        trainIds.push(posts[i].TRAIN_ID);
                    }
                } else if (lineName == "green") {
                    if ((posts[i].LINE == "GREEN")) {
                        trains.push(posts[i]);
                        trainIds.push(posts[i].TRAIN_ID);
                    }
                }
            }
        }

        if (trains.length == 0) {
            res.json({ error });
        } else {
            res.json({ trains });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/api/martainfo/destination/:destionationName', async (req, res) => {
    try {
        const destinationName = req.params.destionationName.toLowerCase();
        const response = await axios.get(`https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${M_API_KEY}`);
        const posts = response.data;
        const destinations = [];
        const error = "Error: Not a valid destination.";
        console.log(destinationName);
        for (let i = 0; i < posts.length; i++) {

            if (destinationName == "north_springs") {
                if (posts[i].DESTINATION == "North Springs") {
                    destinations.push(posts[i]);
                }
            } else if (destinationName == "hamilton_e_holmes") {
                if (posts[i].DESTINATION == "Hamilton E. Holmes") {
                    destinations.push(posts[i]);
                }
            } else if (destinationName == "doraville") {
                if (posts[i].DESTINATION == "Doraville") {
                    destinations.push(posts[i]);
                }
            } else if (destinationName == "airport") {
                if (posts[i].DESTINATION == "Airport") {
                    destinations.push(posts[i]);
                }
            } else if (destinationName == "king_memorial") {
                if (posts[i].DESTINATION == "King Memorial") {
                    destinations.push(posts[i]);
                }
            } else if (destinationName == "indian_creek") {
                if (posts[i].DESTINATION == "Indian Creek") {
                    destinations.push(posts[i]);
                }
            } else if (destinationName == "bankhead") {
                if (posts[i].DESTINATION == "Bankhead") {
                    destinations.push(posts[i]);
                }
            } else if (destinationName == "lindbergh_center") {
                if (posts[i].DESTINATION == "Lindbergh Center") {
                    destinations.push(posts[i]);
                }
            }
        }

        if (destinations.length == 0) {
            res.json({ error });
        } else {
            res.json({ destinations });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));