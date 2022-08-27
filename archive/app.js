// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(
    import.meta.url);
// import { promisify } from 'util';
import { createClient } from 'redis';
import { SMTPClient } from 'emailjs';
import { Console } from "console";
import { url } from "inspector";
const mqtt = require('mqtt');
const fs = require('fs')
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const temp = fs.readFileSync('./configuration.xml', "utf8"); // Reading Configuration file
console.log(temp)
const x = parser.parseString(temp);
const mysql = require('mysql2');
const date = require('date-and-time')
const redis = require('redis');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

import crypto from "crypto";
//emailjs = require('emailjs');
const request = require('request')




var serverurl;
var username;
var password;
var clientid;
var topic;
var MySqlHost;
var MySqlUser;
var MySqlPassword;
var Portno;
var RedisConnection;
var RedisPassword;
var RedisPort;
var smtphost;
var smtpport;
var KEY;
var IV;
var Algorithm;




console.log("----------------------------------------------------------------------------------------------");
// var test = cryptr.decrypt("7ef721949fb817856afea9de6a139f282139c82b78c67435e02e081ffb1fb0c8");
console.log("\n------------------------------------START----------------------------------------------------\n");


var client = mqtt.connect(serverurl, {
    clientId: clientid,
    protocolVersion: 4,
    username: username,
    password: password,
    encoding: 'binary',
});
// app.use(express.static(path.join(__dirname, '/public')));
console.log("Starting Now" + temp);
parser.parseString(temp, function(err, result) {
    if (!err) {
        serverurl = (result.connection.mqttserverurl).toString();
        username = (result.connection.mqttusername).toString();
        password = (result.connection.mqttpassword).toString();
        clientid = (result.connection.mqtttclientid).toString();
        topic = (result.connection.mqttsubtopic).toString();
        MySqlHost = (result.connection.mysqlhost).toString();
        MySqlUser = (result.connection.mysqluser).toString();
        MySqlPassword = (result.connection.mysqlpassword).toString();
        Portno = (result.connection.portno).toString();
        RedisConnection = (result.connection.RedisConnection).toString();
        RedisPassword = (result.connection.RedisPassword).toString();
        RedisPort = (result.connection.RedisPort).toString();
        smtphost = (result.connection.smtphost).toString();
        smtpport = (result.connection.smtpport).toString();
        Algorithm = (result.connection.algorithm).toString();
        KEY = (result.connection.key).toString()
        IV = (result.connection.iv).toString()
        console.log("Algorithm" + ":" + Algorithm)
        console.log("key" + ":" + KEY)
        console.log("IV" + ":" + IV)
        console.log("Redis port 1" + ":" + RedisPort);
    }
});
console.log("Redis port " + RedisPort);
console.log("SMTP Setting:  " + smtpport + "   " + smtphost);
/**********************************_Redis Connection************************************ */
// const RedisClient = redis.createClient(RedisPort, RedisConnection);

// RedisClient.auth(RedisPassword);
// var RedisClient = createClient({
//     url: "redis://192.168.2.98:6379",
// });
// await RedisClient.connect()
import RedisClient from "./redis.js";
import { hGetAll, hSet, Select, expire, hGet, sMembers, get, set, del, hDel, sAdd, sRem, keys, incr, lRange, rPush, hIncrBy, ttl } from "./redis.js";
import { toNamespacedPath } from "path";


const Securitykey = Buffer.from(KEY);

const initVector = Buffer.from(IV);

var enEmail = "Santosh Singh";

var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
var Email = cipher.update(enEmail, "utf-8", "hex") + cipher.final("hex");
Email = (Buffer.from(Email, "hex").toString('base64'));

console.log(Email)

/**************************************************************************************** */
var con;

function handleDisconnect() {
    console.log("connecting MYSQL again");
    con = mysql.createConnection({
        connectionLimit: 1000,
        host: MySqlHost,
        user: MySqlUser,
        password: MySqlPassword,
        database: 'web_membership'

    })
    con.connect(function(err) {
        if (err) {
            console.log('error when connecting MYSQL to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    con.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST to MYSQL') {
            handleDisconnect();
        } else {
            console.log("MYSQL --Other Error in connecting with ERROR CODE " + err.code);
            handleDisconnect();
            throw err;
        }
    });

}
handleDisconnect();




function handleMqttDisconnect() {
    console.log("mqtthost->" + serverurl)
    client = mqtt.connect(serverurl, {
        clientId: clientid,
        protocolVersion: 4,
        username: username,
        password: password,
        encoding: 'binary',
    });
    console.log("MQTT Connected.......");
    client.subscribe(topic);
}
handleMqttDisconnect();



client.on("message", function(topic, payload) {

    console.log("Topic " + topic);
    console.log("Payload " + payload);

    console.log("hyy this is me")

})




client.on("message", function(topic, payload) {
    console.log("Topic " + topic);
    console.log("Payload " + payload);


    var split = topic.split("/");
    switch (split[10]) {
        case "Login": //Login data
            var sendTopic = 'HR/IN/Login/' + split[3] + '/MOB/' + split[5] + '/Suno/' + split[7] + '/' + split[8] + '/panduji/Login';
            if (payload != '') {
                var obj = JSON.parse(payload);
                console.log(" obj=====>" + payload)
                    // enEmail = cryptr.encrypt(obj.msg.UserName);
                console.log("obj.msg.UserName====>" + obj.msg.UserName)
                    // enPasswd = cryptr.encrypt(obj.msg.Password);

                console.log("obj.msg.Password========>" + obj.msg.Password)
                var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                enEmail = cipher.update(obj.msg.UserName, "utf-8", "hex") + cipher.final("hex");
                enEmail = (Buffer.from(enEmail, "hex").toString('base64'));

                console.log("enEmail=======>" + enEmail)



                var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                enPasswd = cipher.update(obj.msg.Password, "utf-8", "hex") + cipher.final("hex");
                enPasswd = (Buffer.from(enPasswd, "hex").toString('base64'));


                console.log("enPasswd =========>" + enPasswd)


                var sqlquery = "CALL proc_Panduji_login_v2('-1','-1','" + enEmail + "', '" + enPasswd + "','prelogin')"
                console.log("sqlquery=====>" + sqlquery)
                if (con.state === 'disconnected') {

                    handleDisconnect();
                }
                con.query(sqlquery, true, (err, result) => {
                    if (err) {
                        console.log("Error : " + err);
                    } else {
                        if (result[0].length > 0) {
                            var orgnisation = [];
                            var directurl = [];
                            var logouturl = [];
                            var oid = [];
                            var poid = [];
                            if (result[0].length == 1) {
                                var commonuser = 0;
                            }
                            if (result[0].length != 1) {
                                var commonuser = 1;
                            }
                            for (var i = 0; i < result[0].length; i++) {
                                orgnisation.push('"' + result[0][i].OrganizationName + '"');
                                directurl.push('"' + result[0][i].CS_Login_URL + '?mid=' + result[0][i].MID + '&email=' + result[0][i].M_EmailID + '"')
                                logouturl.push('"' + result[0][i].CS_Logout_URL + '"')
                                oid.push('"' + result[0][i].OID_ + '"')
                                poid.push('"' + result[0][i].POID + '"')
                            }
                            if (result[0][0].M_EmailID != 'undefined' && result[0][0].M_EmailID != null && result[0][0].M_EmailID != 'NA') {
                                // result[0][0].M_EmailID = cryptr.decrypt(result[0][0].M_EmailID);

                                var Cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                                result[0][0].M_EmailID = Cipher.update(Buffer.from(result[0][0].M_EmailID, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8")



                            } else {
                                result[0][0].M_EmailID = "NA";
                            }
                            if (result[0][0].M_Phone != 'undefined' && result[0][0].M_Phone != null && result[0][0].M_Phone != 'NA') {
                                // result[0][0].M_Phone = cryptr.decrypt(result[0][0].M_Phone);
                                var Cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                                result[0][0].M_Phone = Cipher.update(Buffer.from(result[0][0].M_Phone, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");



                            } else {
                                result[0][0].M_Phone = "NA";
                            }
                            if (result[0][0].M_Company_Name != 'undefined' && result[0][0].M_Company_Name != null && result[0][0].M_Company_Name != 'NA') {
                                // result[0][0].M_Company_Name = cryptr.decrypt(result[0][0].M_Company_Name);

                                var Cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                                result[0][0].M_Company_Name = Cipher.update(Buffer.from(result[0][0].M_Company_Name, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");



                            } else {
                                result[0][0].M_Company_Name = "NA";
                            }
                            console.log(result[0].length)

                            var replyPayload = `{"Login":{"MM_ID":"${result[0][0].MID}","M_Name":"","M_Code":"${result[0][0].M_ClientID}","M_Email":"${result[0][0].M_EmailID}","M_Imei":"","M_Phone":"${result[0][0].M_Phone}","OID_name":"${result[0][0].M_Company_Name}","Status":"Success","M_Company_Logo_Url":"${result[0][0].LogoUrl}","M_Selfie_Url":"","M_Login_Time":"${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}","M_Is_Selfie_Required":"0","M_Common_User":"${commonuser}","POID":[${poid}],"OID":[${oid}],"M_Organisations":[${orgnisation}],"M_WebUrl":[${directurl}],"M_LogoutUrl":[${logouturl}]}}`
                            client.publish(sendTopic, replyPayload)
                        } else {
                            var replyPayload = `{"Login":{"MM_ID":"","M_Name":"","M_Code":"","M_Email":"","M_Imei":"","M_Phone":"","POID":[],"OID":[],"OID_name":"","Status":"Fail","M_Company_Logo_Url":"","M_Selfie_Url":"","M_Login_Time":"${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}","M_Is_Selfie_Required":"0","M_Common_User":"","M_Organisations":[],"M_WebUrl":[],"M_LogoutUrl":[]}}`
                            client.publish(sendTopic, replyPayload)
                        }
                    }
                })
            }
            break;




        case "PostLogin": //Login data
            var sendTopic = 'HR/IN/Login/' + split[3] + '/MOB/' + split[5] + '/Suno/' + split[7] + '/' + split[8] + '/panduji/PostLogin';
            if (payload != '') {
                var obj = JSON.parse(payload);
                // enEmail = cryptr.encrypt(obj.msg.UserName);
                var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                enEmail = cipher.update(obj.msg.UserName, "utf-8", "hex") + cipher.final("hex");
                enEmail = (Buffer.from(enEmail, "hex").toString('base64'));

                console.log("Email =>" + enEmail)

                if (obj.msg.Password == null) {
                    var enPasswd = 0
                } else {
                    var passwd = obj.msg.Password
                }
                // enPasswd = cryptr.encrypt(passwd);
                var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                enPasswd = cipher.update(passwd, "utf-8", "hex") + cipher.final("hex");
                enPasswd = (Buffer.from(enPasswd, "hex").toString('base64'));

                console.log("enPasswd => " + enPasswd)


                var sqlquery = "CALL proc_Panduji_login_v2('" + obj.msg.POID + "','" + obj.msg.OID + "','" + enEmail + "', '" + enPasswd + "','postlogin')"
                console.log("sqlquery============>" + sqlquery)

                if (con.state === 'disconnected') {

                    handleDisconnect();
                }
                con.query(sqlquery, true, (err, result) => {
                    console.log("result[1][0].CS_staticurl===>" + result[1][0].CS_staticurl)
                    if (err) {
                        console.log("Error : " + err);
                    } else {
                        var url = result[1][0].CS_staticurl + 'api/getnavbar';
                        console.log(url) //https://beverlypark.smart24x7.com/api/getnavbar
                        var concern_setting = []

                        console.log("result[4].length===>" + JSON.stringify(result[4]))
                        for (var i = 0; i < result[4].length; i++) {

                            concern_setting.push(`{"CSM_ID":"${result[4][i].CSM_ID}","CSM_NAME":"${result[4][i].Concern_Name}"}`)
                        }
                        request(url, (err, response, body) => {
                            if (err) {
                                console.log(err)
                                var NavBar = '""';
                            } else {
                                try {
                                    JSON.parse(body)
                                    var NavBar = body;
                                } catch (e) {
                                    console.log(e)
                                    var NavBar = '""';
                                }
                                console.log(NavBar)
                            }
                            callMain(" NavBar======> " + NavBar);
                        })

                        function callMain(NavBar) {
                            if (result[0].length > 0) {
                                var enEmailID = result[0][0].M_EmailID;
                                if (result[0][0].M_EmailID != 'undefined' && result[0][0].M_EmailID != null && result[0][0].M_EmailID != 'NA') {
                                    // result[0][0].M_EmailID = cryptr.decrypt(result[0][0].M_EmailID);

                                    var Cipher = crypto.createDecipheriv(Algorithm, Securitykey, initVector);
                                    result[0][0].M_EmailID = Cipher.update(Buffer.from(result[0][0].M_EmailID, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");

                                    console.log(" result[0][0].M_EmailID==> " + result[0][0].M_EmailID)



                                } else {
                                    result[0][0].M_EmailID = "NA";
                                }
                                if (result[0][0].M_Phone != 'undefined' && result[0][0].M_Phone != null && result[0][0].M_Phone != 'NA') {
                                    // result[0][0].M_Phone = cryptr.decrypt(result[0][0].M_Phone);

                                    var Cipher = crypto.createDecipheriv(Algorithm, Securitykey, initVector);
                                    result[0][0].M_Phone = Cipher.update(Buffer.from(result[0][0].M_Phone, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");
                                    console.log("result[0][0].M_Phone" + result[0][0].M_Phone)

                                } else {
                                    result[0][0].M_Phone = "NA";
                                }
                                if (result[0][0].M_Company_Name != 'undefined' && result[0][0].M_Company_Name != null && result[0][0].M_Company_Name != 'NA') {
                                    // result[0][0].M_Company_Name = cryptr.decrypt(result[0][0].M_Company_Name);

                                    var Cipher = crypto.createDecipheriv(Algorithm, Securitykey, initVector);
                                    result[0][0].M_Company_Name = Cipher.update(Buffer.from(result[0][0].M_Company_Name, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");
                                    console.log("result[0][0].M_Company_Name ===>" + result[0][0].M_Company_Name)


                                } else {
                                    result[0][0].M_Company_Name = "NA";
                                }
                                if (result[0][0].M_name != 'undefined' && result[0][0].M_name != null && result[0][0].M_name != 'NA') {
                                    // result[0][0].M_name = cryptr.decrypt(result[0][0].M_name);
                                    var Cipher = crypto.createDecipheriv(Algorithm, Securitykey, initVector);
                                    result[0][0].M_name = Cipher.update(Buffer.from(result[0][0].M_name, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");
                                    console.log(" result[0][0].M_name===>" + result[0][0].M_name)

                                } else {
                                    result[0][0].M_name = "NA";
                                }
                                if (result[0][0].MIN != 'undefined' && result[0][0].MIN != null && result[0][0].MIN != 'NA') {
                                    // result[0][0].MIN = cryptr.decrypt(result[0][0].MIN);

                                    var Cipher = crypto.createDecipheriv(Algorithm, Securitykey, initVector);
                                    result[0][0].MIN = Cipher.update(Buffer.from(result[0][0].MIN, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");
                                    console.log("result[0][0].MIN===>" + result[0][0].MIN)

                                } else {
                                    result[0][0].MIN = "NA";
                                }

                                if (result[5][0].PolicyValue != 'Denied') {

                                    var admintool = `[{ "url": "/membershipAdmin", "name": "Membership Admin" },{ "url": "/broadcastmail", "name": "Broadcast Mail" },{ "url": "/events/eventmanagement", "name": "Event Management" },{ "url": "/InviteeManagement", "name": "Invitee Management" },{ "url": "/banneradmin", "name": "Banner Admin" },{ "url": "/commiteeadmin", "name": "Community Admin" },{ "url": "/groupadmin", "name": "Group Admin" },{ "url": "/logs/browselogs", "name": "View Site logs " },{ "url": "/ads_admin", "name": "Ads Admin" },{ "url": "/press_admin?type=press", "name": "Press Release & Media"},{"url":"/contact/contactAdmin","name":"Contact Admin"}]`

                                    result[3][0].Role_Type = 'Admin'; //comment after change in application
                                } else if (result[3][0].MID == 4736 || result[3][0].MID == 4694 || result[3][0].MID == 2922 || result[3][0].MID == 4704 || result[3][0].MID == 4757 || result[3][0].MID == 4885 || result[3][0].MID == 4651 || result[3][0].MID == 4758 || result[3][0].MID == 4759 || result[3][0].MID == 4629 || result[3][0].MID == 4642 || result[3][0].MID == 4807 || result[3][0].MID == 4786 || result[3][0].MID == 4904 || result[3][0].MID == 4874 || result[3][0].MID == 4752 || result[3][0].MID == 4914 || result[3][0].MID == 4883) {
                                    var admintool = `[{"url":"/contact/contactAdmin","name":"Contact Admin"}]`
                                    result[3][0].Role_Type = 'Admin';
                                } else {
                                    var admintool = '[]';
                                }
                                //	console.log(admintool); 
                                // https://192.168.1.165:4001/data_files/257/257/logo_header.png
                                var replyPayload = `{ "Login": { "MM_ID":"${result[0][0].MID}", "Member_ID":"${result[0][0].MIN}", "M_Name":"${result[0][0].M_name}", "M_Code":"${result[0][0].M_ClientID}", "M_Email":"${result[0][0].M_EmailID}", "Role_Type":"${result[3][0].Role_Type}", "admintool":${admintool}, "M_Imei":"", "M_Phone":"${result[0][0].M_Phone}", "POID":"${result[0][0].POID}", "OID":"${result[0][0].OID_}", "OID_name":"${result[0][0].M_Company_Name}", "Status":"Success", "M_Company_Logo_Url":"${result[0][0].CS_Login_URL}data_files/${result[0][0].POID}/${result[0][0].OID_}/logo_header.png", "M_Selfie_Url":"", "M_Login_Time":"${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}", "M_Is_Selfie_Required":"0", "M_Common_User":"0", "M_Organisations":"${result[0][0].OrganizationName}", "M_WebUrl":"${result[0][0].CS_Login_URL}?mid=${result[0][0].MID}&email=${enEmailID}", "M_LogoutUrl":"${result[0][0].CS_Logout_URL}", "M_Selfi_Logo":"${result[0][0].CS_Login_URL}uploads/${obj.msg.POID}/${obj.msg.OID}/${result[0][0].M_Selfi_Logo.replace('public/', '').replace('uploads/', '')}", "totalpoints":"${result[2][0].totalpoints}"}, "NavBar": ${NavBar},"Concern_Setting":[${concern_setting}]} `

                                client.publish(sendTopic, replyPayload)
                                console.log("sendTopic===>" + sendTopic)
                                console.log("replyPayload====>" + replyPayload)

                            } else {
                                var replyPayload = `{ "Login": { "MM_ID": "", "Member_ID": "", "M_Name": "", "M_Code": "", "M_Email": "","Role_Type":"","admintool":[], "M_Imei": "", "M_Phone": "", "POID": "", "OID": "", "OID_name": "", "Status": "Fail", "M_Company_Logo_Url": "", "M_Selfie_Url": "", "M_Login_Time": "${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}", "M_Is_Selfie_Required": "0", "M_Common_User": "", "M_Organisations": "", "M_WebUrl": "", "M_LogoutUrl": "", "M_Selfi_Logo": "", "totalpoints": "" }, "NavBar": ${NavBar} ,"Concern_Setting":[${concern_setting}]} `

                                client.publish(sendTopic, replyPayload)
                            }
                        }
                    }
                })
            }

            break;
        case "CommunityRequest": //Forget Password
            var sendTopic = 'ER/IN/Login/' + split[3] + '/MOB/' + split[5] + '/Suno/' + split[7] + '/' + split[8] + '/panduji/CommunityRequest';
            if (!client.connected) {
                handleMqttDisconnect();
            }

            if (payload != '') {
                var obj = JSON.parse(payload);

                console.log("obj.GetCommunity.UserName===>" + obj.GetCommunity.UserName)

                var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                var encommunity = cipher.update(obj.GetCommunity.UserName, "utf-8", "hex") + cipher.final("hex");
                encommunity = (Buffer.from(encommunity, "hex").toString('base64'));
                console.log(encommunity)



                var Cipher = crypto.createDecipheriv(Algorithm, Securitykey, initVector);
                let decryptedData = Cipher.update(Buffer.from(encommunity, 'base64').toString('hex'), "hex", "utf-8") + Cipher.final("utf-8");;
                // console.log(decryptedData)

                console.log("decrypted data => " + decryptedData)




                var sqlquery = "CALL proc_panduji_validate_user('" + encommunity + "')";
                console.log("Encrypted " + encommunity + "\n" + "Decrypted " + decryptedData);
                console.log(sqlquery)
                if (con.state == 'disconnected') {
                    handleDisconnect();
                }
                con.query(sqlquery, true, (err, result) => {
                    if (err) {
                        console.log("Err in sql:=>" + err);

                        var replyPayload = `{ "GetCommunity": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Fail", "Comment": "user does not Exists or Whatever" } } `
                        setTimeout(function() {
                            client.publish(sendTopic, replyPayload);
                            // console.log("Response" + replyPayload);
                        }, 50);
                    } else {
                        console.log("result[0].length" + result[0].length)
                        if (result[0].length > 0) {
                            console.log("Inside If GetCommunity");
                            var community = [];
                            for (var i = 0; i < result[0].length; i++) {

                                community.push('{"POID":"' + result[0][i].POID + '","OID":"' + result[0][i].OID_ + '","MID":"' + result[0][i].MID + '","OrgName":"' + result[0][i].OrganizationName + '"}')
                            }


                            if (result[0].length == 1) {
                                var commonuser = 0;
                            } else {
                                var commonuser = 1;
                            }
                            var replyPayload = `{ "GetCommunity": { "DateTime": "", "Status": "Success", "M_Common_User": "${commonuser}", "Community": [${community}] } } `
                            setTimeout(function() {
                                client.publish(sendTopic, replyPayload);
                            }, 50);
                        } else {
                            var replyPayload = `{ "GetCommunity": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Fail", "M_Common_User": "${commonuser}", "Comment": "user does not Exists " } } `
                            setTimeout(function() {
                                console.log("Inside Else GetCommunity");
                                console.log("replyPayload=====>" + replyPayload)
                                client.publish(sendTopic, replyPayload);
                            }, 50);
                        }
                    }

                })
            }

            break;
        case "OtpRequest": //Forget Password
            var sendTopic = 'ER/IN/Login/' + split[3] + '/MOB/' + split[5] + '/Suno/' + split[7] + '/' + split[8] + '/panduji/OtpRequest';
            if (!client.connected) {
                handleMqttDisconnect();
            }

            if (payload != '') {
                var obj = JSON.parse(payload);




                console.log("obj.GetOtp.UserName====>" + obj.GetOtp.UserName)

                var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                var OtpRequest = cipher.update("vijaypalvijju@yahoo.com", "utf-8", "hex")
                OtpRequest += cipher.final("hex");
                OtpRequest = (Buffer.from(OtpRequest, "hex").toString('base64'));



                // console.log("new encrypted data is " + OtpRequest)
                // var OtpRequest = cryptr.encrypt(obj.GetOtp.UserName)
                console.log(" otp request =====>" + OtpRequest)



                var sqlquery = "CALL proc_panduji_validate_user('" + OtpRequest + "')";
                console.log("SQL Query Triggered " + sqlquery)
                if (con.state == 'disconnected') {
                    handleDisconnect();
                }
                con.query(sqlquery, true, (err, result) => {
                    if (err) {
                        console.log("Err in sql:=>" + err);

                        var replyPayload = `{ "GetOtp": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Fail", "Comment": "user does not Exists or Whatever" } } `
                        setTimeout(function() {
                            client.publish(sendTopic, replyPayload);
                            // console.log("Response" + replyPayload);
                        }, 50);
                    } else {
                        console.log(result[0].length)
                        if (result[0].length > 0) {
                            // Genrate OTP
                            var OTP = Math.floor((Math.random() * 1000000) + 1);
                            console.log("OTP=====>" + OTP)

                            RedisClient.select('4', function(err, res) {
                                console.log(" selecting DB");
                                if (err) console.log("Error in Selecting DB " + err);
                                console.log("redis database=====>" + res);
                            });

                            // Check if the Key has been generated and exits in DB
                            RedisClient.hGetAll("Panduji_Node_wale_Forgetpass:Test:Best:").then((promise) => {
                                console.log(promise);
                                if (promise = {}) {
                                    console.log("Key not present");
                                    RedisClient.hSet("Panduji_Node_wale_Forgetpass:Test:Best:" + obj.GetOtp.UserName, obj.GetOtp.UserName, OTP).then((hSet) => {
                                        console.log(hSet)

                                        RedisClient.expire("Panduji_Node_wale_Forgetpass:Test:Best:" + obj.GetOtp.UserName, 400).then((expire) => {
                                            console.log(expire);
                                            sendOTPEmail(OTP, obj.GetOtp.UserName, obj.GetOtp.OrgName);
                                            console.log("OTP Mail Sent to user  >> " + obj.GetOtp.UserName, OTP)
                                            var community = '{"POID":"","OID":"","MID":"","OrgName":"' + obj.GetOtp.OrgName + '"}';
                                            var replyPayload = `{ "GetOtp": { "DateTime": "", "Status": "Success", "OTP": "${OTP}", "M_Common_User": "0", "Community": [${community}] } } `;
                                            setTimeout(function() {
                                                client.publish(sendTopic, replyPayload);
                                            }, 50);
                                            console.log("Published the same on Mqtt");
                                        })
                                    })
                                } else {
                                    console.log("Key present");
                                    console.log("No Action will be taken\n\n\n\n");
                                }
                                // Send Mail to Client

                            })

                        } else {
                            var replyPayload = `{ "GetOtp": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Fail", "M_Common_User": "0", "Comment": "user does not Exists " } } `
                            setTimeout(function() {
                                client.publish(sendTopic, replyPayload);
                            }, 50);
                        }
                    }

                })
            }

            break;
        case "OtpVerify": //veryfy otp
            var sendTopic = 'HR/IN/Login/' + split[3] + '/MOB/' + split[5] + '/Suno/' + split[7] + '/' + split[8] + '/panduji/OtpVerify';
            if (payload != '') {

                if (payload != "") {
                    var obj = JSON.parse(payload);
                    var PasswdVerifyOTP = obj.verifyOtp.OTP;
                    var PasswdVerifyUsername = obj.verifyOtp.UserName;
                    /************************************************************************************************ */
                    RedisClient.select("4", function(err, res) {
                        if (err)
                            console.log(err);
                        RedisClient.hGet("Panduji_Node_wale_Forgetpass:Test:Best:" + PasswdVerifyUsername, PasswdVerifyUsername).then((result) => {
                            if (err) console.log(err);
                            console.log(result);
                            if (result == PasswdVerifyOTP) {
                                var replyPayload = '{"verifyOtp":{"Status":"Success","Comment":"OTP Verified","UserName":"' + obj.verifyOtp.UserName + '"}}'
                                setTimeout(function() {
                                    client.publish(sendTopic, replyPayload);
                                    // console.log("Response" + replyPayload);
                                }, 50);
                            } else {
                                var replyPayload = '{"verifyOtp":{"Status":"Fail","UserName":"' + obj.verifyOtp.UserName + '","Comment":"OTP not verified or Whatever"}}'
                                setTimeout(function() {
                                    client.publish(sendTopic, replyPayload);
                                    // console.log("Response" + replyPayload);
                                }, 50);
                            }
                        });
                    });
                }
            }
            break;

            /*         case "NewPassSave": //Forget Password
                        var sendTopic = 'ER/IN/Login/' + split[3] + '/MOB/' + split[5] + '/Suno/' + split[7] + '/' + split[8] + '/panduji/NewPassSave';
                        if (!client.connected) {
                            handleMqttDisconnect();
                        }

                        if (payload != '') {
                            var obj = JSON.parse(payload);
                            var sqlquery = "CALL Forgot_Password_Reset('" + obj.SavePass.newPassword + "','" + obj.SavePass.Application + "','" + obj.SavePass.userId + "')";
                            console.log(sqlquery)
                            if (con.state == 'disconnected') {
                                handleDisconnect();
                            }
                            con.query(sqlquery, true, (err, result) => {
                                if (err) {
                                    console.log("Err in sql:=>" + err);
                                    var replyPayload = `{ "SavePass": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Fail", "Comment": "password Not saved " } } `
                                    setTimeout(function () {
                                        client.publish(sendTopic, replyPayload);
                                    }, 50);

                                } else {
                                    var replyPayload = `{ "SavePass": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Success", "Comment": "password saved" } } `
                                    setTimeout(function () {
                                        client.publish(sendTopic, replyPayload);
                                    }, 50);
                                }

                            })
                        }

                        break; */
        case "changePassword":
            var sendTopic = 'HR/IN/Login/' + split[3] + '/MOB/' + split[5] + '/Suno/' + split[7] + '/' + split[8] + '/panduji/changePassword';
            if (!client.connected) {
                handleMqttDisconnect();
            }

            if (payload != '') {
                var obj = JSON.parse(payload);

                // var enNewpasswd = cryptr.encrypt(obj.changepassword.newpassword);

                var cipher = crypto.createCipheriv(Algorithm, Securitykey, initVector);
                var enNewpasswd = cipher.update(obj.changepassword.newpassword, "utf-8", "hex") + cipher.final("hex");
                enNewpasswd = (Buffer.from(enNewpasswd, "hex").toString('base64'));
                console.log(enNewpasswd)


                // var enCurrentPasswd = cryptr.encrypt(obj.changepassword.currentpassword);
                var sqlquery = "CALL pro_panduji_reset_passwd('" + enNewpasswd + "','" + obj.changepassword.MID + "')";
                console.log(sqlquery)
                if (con.state == 'disconnected') {
                    handleDisconnect();
                }
                con.query(sqlquery, true, (err, result) => {
                    if (err) {
                        console.log("Err in sql:=>" + err);
                        var replyPayload = `{ "changepassword": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Fail", "Comment": "password Not saved may be payload is wrong" } } `
                        setTimeout(function() {
                            client.publish(sendTopic, replyPayload);
                        }, 50);

                    } else {
                        var replyPayload = `{ "changepassword": { "DateTime": "` + date.format(new Date(), 'MM/DD/YYYY') + `", "Status": "Success", "Comment": "password saved" } } `
                        setTimeout(function() {
                            client.publish(sendTopic, replyPayload);
                        }, 50);
                    }

                })
            }



            break;
    }
})


function sendOTPEmail(otp, email, orgName) {
    var server = new SMTPClient({


        host: '192.168.2.99',
        ssl: false,
    });
    // server = emailjs.server.connect({
    //     host: "192.168.2.99",
    //     port: "25",
    //     // ssl: false
    // });
    server.send({
        from: "community<tmsnew@smart24x7.com>",
        to: email,
        subject: "New Connect OTP generated ",
        attachment: [{
            data: `Dear User <br/>
                                        We have a request to generate OTP for your  ${email} in Connect  ${orgName}.
                                    Your OTP is ${otp} <br/>
                                        In case you have not generated the OTP, please escalate this to your account manager.<br/>

                                            Team Connect`,
            alternative: true,
            alternative: true
        }]
    }, function(err, message) {

        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }

    });
}