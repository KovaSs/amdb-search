const express = require('express');
const request = require('request').defaults({ strictSSL: false });
const url = require("url");
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.all("/cgi-bin/serg/0/6/9/reports/186/report_nalogi_tCIT_Compliance_Cyprus", (_request, response) => {
  listenServer(_request, response, "https://10.2.250.5/cgi-bin/serg/0/6/9/reports/186/report_nalogi_tCIT_Compliance_Cyprus");
});

app.listen(4000, err => {
  if (err) {
    console.log(`Error server listen`)
  }
  console.log(`Server listen`)
})

function listenServer(_request, response, url) {
  response.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  });
  
  if (Object.keys(_request.body).length == 0) {
    console.log('===>','GET Request:', _request._parsedUrl.search)
    console.time("Response answer time")
    request({
      method: "GET",
      uri: `${url}${_request._parsedUrl.search}`,
      auth: {
        user: "gpbu7806",
        password: "Den085317"
      },
      form: _request.body
    }, (...arr) => {
      console.log('<===','GET Response:', arr[2])
      console.timeEnd("Response answer time");
      response.set({
        'Content-Type': 'application/json'
      });
      response.json(arr[2]);
    })
  } else {
    console.log('===>','POST Request', _request.body)
    request({
      method: "POST",
      uri: url,
      auth: {
        user: "gpbu7806",
        password: "Den085317"
      },
      form: _request.body
    }, (...arr) => {
      console.log('<===','POST Response', arr[2])
      response.set({
        'Content-Type': 'application/json'
      });
      response.json(arr[2]);
    })
  }
}