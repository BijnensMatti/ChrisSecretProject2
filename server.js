const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var express = require("express");
var pdf2table = require('pdf2table');
var app = express();
var http = require('http');
var https = require('https');
var mysql = require("mysql");
var dateTime = require('node-datetime');
var dt = dateTime.create();
var klgpath = "";
dt.offsetInDays(1);
if(dt.format('w') == 'Sat'){dt.offsetInDays(2);}
if(dt.format('w') == 'Sun'){dt.offsetInDays(1);}
var formatted = dt.format('d.m.Y');
var weekday = new Array(7);
weekday[0]="Mo";
weekday[1]="Di";
weekday[2]="Mi";
weekday[3]="Do";
weekday[4]="Fr";
weekday[5]="Sa";
weekday[6]="So";
var date = new Date();
if(date.getDay() == 5){date.setDate(date.getDate() + 3);}
if(date.getDay() == 6){date.setDate(date.getDate() + 2);}
if(date.getDay() == 0){date.setDate(date.getDate() + 1);}
var wochentag = weekday[date.getDay()-1];
var finalwochentag = "/new/vplan/vp/H%20"+wochentag+"%20"+formatted+".pdf";
app.set('port', (process.env.PORT || 5000))

//get some json data from hmg
app.get('/gethmgjson', function(request, response) {

    var options = {
        method: 'GET',
        host: 'www.hmg-erfurt.de',
        port: '80',
        path: finalwochentag
    };

    var request = http.request(options, function(response2) {
        var data = [];

        response2.on('data', function(chunk) {
            data.push(chunk);
        });

        response2.on('end', function() {
            data = Buffer.concat(data); // do something with data 
            pdf2table.parse(data, function(err, rows, rowsdebug) {
                if (err) return console.log(err);
                response.set('Content-Type', 'application/json');
                response.send(JSON.stringify(rows));
            });
        });
    });

    request.end();

})


app.get('/getkgsjson', function(request, response) {

    var options = {
        method: 'GET',
        host: 'kgs-erfurt.de',
        port: '80',
        path: "/images/inhalt/download/vplan.pdf"
    };

    var request = http.request(options, function(response2) {
        var data = [];

        response2.on('data', function(chunk) {
            data.push(chunk);
        });

        response2.on('end', function() {
            data = Buffer.concat(data); // do something with data
            pdf2table.parse(data, function(err, rows, rowsdebug) {
                if (err) return console.log(err);
                response.set('Content-Type', 'application/json');
                response.send(JSON.stringify(rows));
            });
        });
    });

    request.end();

})
/*
    get the date
*/
app.get('/getdate', function(request, response) {
     response.send(finalwochentag);
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
    console.log("Node app SHOULD be running at 30000");
    console.log("what if its not");
    console.log("thinking");
})

//test for klg-erfurt
app.get('/test', function(request, response) {
   JSDOM.fromURL("https://www.klg-erfurt.de/de/vertretungsplan__459/").then(dom => {
    response.send(dom.window.document.querySelectorAll('.pdf')[0].getAttribute("href"));
   });
})
