const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'write_products';
const appURL = 'https://ce2f91e6.ngrok.io';

app.get('/', (req,res) => {
  res.send("App working");
});

app.listen('4567',() =>{
  console.log('App listening on 4567!');
})
