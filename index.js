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
const appURL = 'https://c7abe1c0.ngrok.io';

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

app.get('/callback',(req,res)=>{
  const {shop, hmac, code, state} = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;
  if (state !== stateCookie){
    return res.status(403).send('Origin of request cannot be verified');
  }
  if (shop && hmac && code){
    const map = Object.assign({}, req.query)
    delete map['hmac'];
    delete map['signature'];

    const message = querystring.stringify(map);
    const digest = crypto.createHmac('sha256', apiSecret).update(message).digest('hex');

    if (digest !== hmac){
      return res.status(400).send('hmac not validated');
    }
    const url = `https://${shop}/admin/oauth/access_token`;
    const payload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code
    };
    
    request.post(url,{json: payload}).then((aTokenResponse)=>{
      const accessToken = aTokenResponse.access_token;

      res.status(200).send("Access token set!");
    });
  }else {
    return res.status(400).send('Missing required parameters.')
  }
});
