const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/convert-mp3', async (req, res) => {
  const videoURL = req.body.videoURL;

  if (videoURL === undefined || videoURL === '' || videoURL === null) {
    return res.render('index', {
      success: false,
      message: 'Please enter a vaild URL',
    });
  } else {
    const url = `https://youtube-mp315.p.rapidapi.com/?url=${videoURL}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': process.env.API_HOST,
      },
    };

    try {
      const response = await fetch(url, options);
      const fetchResponse = await response.json();

      if (fetchResponse.result[0].status === 'true') {
        return res.render('index', {
          success: true,
          song_title: fetchResponse.result[0].title,
          song_link: fetchResponse.result[0].url,
        });
      } else {
        return res.render('index', {
          success: false,
          message: fetchResponse.msg,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
