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

app.get('/install', (req,res) =>{
  const shop = req.query.shop;
  if(shop){
    const state = nonce();
    const scope = 'write_products';
    const redirectUri = `${appURL}/callback`
    const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}\
                        &scope=${scope}&state=${state}&redirect_uri=${redirectUri}`

    res.cookie('state',state);
    res.redirect(installUrl);
  }else{
    return res.status(400).send('Something went wrong. Double check that you entered your shop correctly.');
  }
});
