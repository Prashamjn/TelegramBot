const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');
const app = express();
require('dotenv').config();

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const welcomeMessage = `
Welcome to the bot! Type /help for available commands.
Here's a nice welcome image for you `;
const welcomeImage = 'https://www.shutterstock.com/image-vector/welcome-calligraphic-inscription-smooth-lines-260nw-1721907820.jpg';

// Event listener for incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const command = msg.text;
    const currentTime = new Date().toLocaleTimeString();
    const text = msg.text.split(' ').slice(1).join(' ');

  // Process the received command
  switch (command) {
    case '/start':
      bot.sendPhoto(chatId, welcomeImage, { caption: welcomeMessage });
      break;
    case '/help':
      bot.sendMessage(
        chatId,
        `Available commands:
/start - Start the bot
/help - Show available commands
/info - Get information
/status - Check status
/custom - Custom command from my side
/time - See the current time
/remind <time> <message> - Set a reminder
/translate <language> <text> - Translate text to the specified language
/convert <amount> <from> <to> - Convert currency
/weather - check weather`
      );
      break;
    case '/info':
      bot.sendMessage(chatId, 'This is a Prasham bot. It can reply to commands.');
      break;
    case '/status':
      bot.sendMessage(chatId, 'Bot is running smoothly.');
      break;
    case '/custom':
      bot.sendMessage(chatId, 'This is a custom command from my side.');
      break;
    case '/time':
      bot.sendMessage(chatId, `Current time is: ${currentTime}`);
      break;
      case '/remind':
      if (!text) {
        bot.sendMessage(chatId, 'Please provide a reminder message. Usage: /remind <time> <message>');
        return;
      }

      // Extract time and message from the command
      const [time, reminderMessage] = text.split(' ');

      // Set a timeout to send the reminder after the specified time
      setTimeout(() => {
        bot.sendMessage(chatId, `⏰ Reminder: ${reminderMessage}`);
      }, time * 1000);

      bot.sendMessage(chatId, `⏰ Reminder set for ${time} seconds.`);
      break;
    case '/translate':
      if (!text) {
        bot.sendMessage(chatId, 'Please provide a translation request. Usage: /translate <language> <text>');
        return;
      }

      // Extract language and text from the command
      const [language, translateText] = text.split(' ');

      try {
        const translation = await translateTextToLanguage(translateText, language);
        bot.sendMessage(chatId, `Translated text: ${translation}`);
      } catch (error) {
        bot.sendMessage(chatId, 'Failed to translate text. Please try again later.');
      }
      break;
      case '/convert':
        if (!text) {
          bot.sendMessage(chatId, 'Please provide a conversion request. Usage: /convert <amount> <from> <to>');
          return;
        }
        case '/weather':
      if (!text) {
        bot.sendMessage(chatId, 'Please provide a location. Usage: /weather <location>');
        return;
      }

      try {
        const weatherData = await getWeatherData(text);
        const { name, main, weather } = weatherData;
        const temperature = main.temp;
        const description = weather[0].description;
        const message = `Weather in ${name}: ${description}, Temperature: ${temperature}°C`;
        bot.sendMessage(chatId, message);
      } catch (error) {
        bot.sendMessage(chatId, 'Failed to fetch weather data. Please try again later.');
      }
      break;
    default:
      bot.sendMessage(chatId, 'Unknown command. Type /help for available commands.');
      break;
  }
});

// Start the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bot has been started!');
});

async function getWeatherData(location) {
    const apiKey = process.env.WEATHER-API;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const response = await axios.get(apiUrl);
    return response.data;
  }