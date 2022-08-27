// var email = require('emailjs');

// var server = email.server.connect({
//     host: '192.168.2.99',
//     ssl: false
// });

// server.send({
//     text: 'Hey howdy',
//     from: 'NodeJS<Smart@smart.org.in>',
//     to: 'Wilson <CP@smart.org.in>',
//     cc: '',
//     subject: 'Greetings to all'
// }, function (err, message) {
//     console.log(err || message);
// });

// ------------------
// These lines make "require" available
// index.js
// import express from "express";

// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { SMTPClient } from 'emailjs';
//import fs from 'fs';
//fs = require('fs')
// xml2js = require('xml2js');
// parser = new xml2js.Parser();
//temp = fs.readFileSync('./configuration.xml', "utf8");
const client = new SMTPClient({

    host: '192.168.2.99',
    ssl: false,
});

// send the message and get a callback with an error or details of the message that was sent
client.send(
    {
        text: 'i hope this works',
        from: 'you <tes@smart.org.in>',
        to: 'CP <cp@smart.org.in>, another <cp@eswachh.world>',
        //cc: 'else <else@your-email.com>',
        subject: 'testing emailjs',
    },
    (err, message) => {
        console.log(err || message);
    }
);


//const data = require("./data.json");

// const app = express();
// app.use(express.json());
// app.get("/", (req, res) => {
//     res.status(200).send(data);
// });

// app.listen(3000, (error) => {
//     if (error) {
//         throw new Error(error);
//     }

//     console.log("Backend is running");
// });