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
    console.log(`error`)
  }
  console.log(`server listen`)
})

function listenServer(_request, response, url) {
  response.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  });
  
  if (Object.keys(_request.body).length == 0) {
    response.end("good");
  } else {
    console.log('===>','Request', _request.body)
    request({
      method: "POST",
      uri: url,
      auth: {
        user: "gpbu7806",
        password: "Den085317"
      },
      // auth: {
      //   user: "gpbu4405",
      //   password: "2k6ZVrGU4s!!"
      // },
      form: _request.body
    }, (...arr) => {
      console.log('<===','Response', arr[2])
      response.set({
        'Content-Type': 'application/json'
      });
      response.json(arr[2]);
    })
  }
}