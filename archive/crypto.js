import crypto from "crypto";
import fs from "fs";
import xml2js from 'xml2js';

const parser = new xml2js.Parser();
const cp = fs.readFileSync("./configuration.xml", "utf-8") // read configuration file
const x = parser.parseString(cp);


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


const Securitykey = Buffer.from(KEY);

const initVector = Buffer.from(IV);









var name = "shiwangi";


var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);

let data = cipher.update(name, "utf-8", "hex") + cipher.final("hex")
data = Buffer.from(data, "hex").toString('base64')

console.log(data)