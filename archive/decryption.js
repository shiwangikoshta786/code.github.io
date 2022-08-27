import express, { json } from "express";
import { createRequire } from "module";
const require = createRequire(
    import.meta.url);
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
import mysql from 'mysql2';
import { Buffer } from 'node:buffer';

import fs from "fs";
import xml2js from 'xml2js';
const parser = new xml2js.Parser();
const cp = fs.readFileSync("./configuration.xml", "utf-8") // read configuration file
const x = parser.parseString(cp);

import crypto from "crypto";

const app = express();


let data = cryptr.decrypt("e3e7bd7ae698a398b7453f43a1ccfbb953bf310199283b7170b7396f82ca4222")
console.log("cryptr decryption value is" + " : " + data)



parser.parseString(cp, function(err, result) {
    if (!err) {

        MySqlHost = (result.connection.mysqlhost).toString();
        MySqlUser = (result.connection.mysqluser).toString();
        MySqlPassword = (result.connection.mysqlpassword).toString();
        Portno = (result.connection.portno).toString();
        RedisConnection = (result.connection.RedisConnection).toString();
        RedisPort = (result.connection.RedisPort).toString();
        RedisPassword = (result.connection.RedisPassword).toString();
        Algorithm = (result.connection.algorithm).toString();
        KEY = (result.connection.key).toString()
        IV = (result.connection.iv).toString()
        console.log("RedisPort" + RedisPort)
        console.log("RedisConnection" + RedisConnection)
        console.log("RedisPassword" + RedisPassword)
        console.log("Port" + Portno)


        console.log(" MySqlHost " + ":" + MySqlHost);
        console.log("  MySqlUser " + ":" + MySqlUser);
        console.log("  MySqlPassword " + ":" + MySqlPassword);
        console.log(" key " + ":" + KEY)
        console.log(" password " + ":" + IV)
        console.log(" algorithm" + ":" + Algorithm)
    }
});

var MySqlHost;
var MySqlUser;
var MySqlPassword;
var KEY;
var IV;
var Algorithm;
var Portno;
var RedisConnection;
var RedisPassword;
var RedisPort;

var con = mysql.createConnection({

    connectionLimit: 10,
    host: MySqlHost,
    user: MySqlUser,
    password: MySqlPassword,
    database: "web_membership"

})

const Securitykey = Buffer.from(KEY);

const initVector = Buffer.from(IV);

//52046 //205000 //170357

for (let i = 9412; i <= 10397; i++) {

    let sql = `SELECT * FROM web_membership.membermaster where MID = ${i}`;



    con.query(sql, function(err, result) {
        if (err) throw err;
        let records = result;

        records.forEach(element => {

            console.log(element.M_EmailID)

            console.log(element.MID)

            let data = JSON.stringify(element.M_EmailID)

            var response = JSON.parse(data)
            console.log(response)


            if (response == "" || response == null) {

                console.log("empty record")


            } else {

                // OLD CRYPTR DECRYPTION KEY
                let name = cryptr.decrypt(element.M_EmailID)
                console.log("cryptr decryption value is" + " : " + name)



                const cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                let encryptedData = cipher.update(name, "utf-8", "hex");
                encryptedData += cipher.final("hex");
                encryptedData = (Buffer.from(encryptedData, "hex").toString('base64'));

                console.log("new encrypted data is " + encryptedData)


                let sql = "UPDATE web_membership.membermaster SET M_Password= '" + encryptedData + "' WHERE  MID=" + element.MID;
                con.query(sql, function(err, row) {
                    if (err) throw err;
                    console.log(row)

                })





                // function Encrypt(originalText) {
                //     const cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                //     let encryptedData = cipher.update(originalText, "utf-8", "hex");
                //     encryptedData += cipher.final("hex");
                //     return Buffer.from(encryptedData, 'hex').toString('base64');
                // }
                // console.log("the new encryption key is" + " : " + Encrypt(name));


                // function Decrypt(Text) {
                //     const cipher = crypto.createDecipheriv(Algorithm, Securitykey, initVector);
                //     let encryptedData = cipher.update(Buffer.from(Text, 'base64').toString('hex'), "hex", "utf-8");
                //     encryptedData += cipher.final("utf-8");
                //     return encryptedData;
                // }
                // console.log("using of crypto decryption key is" + " : " + Decrypt(Encrypt(name)));

                // let sql = "UPDATE web_membership.membermaster SET M_name ='" + name + "' WHERE  MID=" + element.MID;
                // con.query(sql, function(err, row) {
                //     if (err) throw err;
                //     console.log(row)

                // })







            }

        })

    })
}