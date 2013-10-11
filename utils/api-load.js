var http = require("http");
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var pg = require('pg'); 
var exec = require('child_process').exec



var options = {
    host: 'www.gtfs-data-exchange.com',
    path: '/api/agencies'
};

http.get(options, function (http_res) {
    //console.log(http_res);
    var data = "";

    http_res.on("data", function (chunk) {
        data += chunk;
    });

    http_res.on("end", function () {
        parseAgencies(JSON.parse(data).data);
    });
})
.on('error', function(e) {
  console.log(e);
  console.log("Got error: " + e);
});

var parseAgencies = function(agencyList){
    var validAgencyCount = 0;
    var conString = "postgres://postgres:am1238wk@localhost/postgres";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
     
        //console.log(result.rows[0].theTime);
        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
        agencyList.forEach(function(agency){
            if(agency['is_official'] && agency['country'] == 'United States'){
                //console.log( agency['dataexchange_id']);
                validAgencyCount++
                var options = {
                    host: 'www.gtfs-data-exchange.com',
                    path: '/api/agency?agency='+agency['dataexchange_id']
                };

                http.get(options, function (http_res) {
                    //console.log(http_res);
                    var data = "";

                    http_res.on("data", function (chunk) {
                        data += chunk;
                    });

                    http_res.on("end", function () {
                        
                        // mkdirp(path.resolve(__dirname,"../gtfs/")+"/"+agency['dataexchange_id'], function(err){
                        //     if (err) console.error(err)
                        //     else console.log('hooray!')
                        // });
                        //console.log( "Agency id:  " + agency['dataexchange_id'],"File URL:  " + )
                        console.log(agency);
                        var body = JSON.stringify(agency);
                        //console.log(body);
                        var post_options = {
                           hostname: "localhost",
                           port: 1337,
                           path: "/agency/create/",
                           method: "POST",
                           headers: {
                               "Content-Type": "application/json",
                               "Content-Length": body.length // Often this part is optional
                            }
                        }
                        var post_req = http.request(post_options, function(res) {
                            res.setEncoding('utf8');
                            res.on('data', function (chunk) {
                                console.log('Response: ' + chunk);
                            });
                        });
                        post_req.write(body);
                        post_req.end(); 
                       

                    });
                })
                .on('error', function(e) {
                  console.log(e);
                  console.log("Got error: " + e);
                });
            }
        })//end for each agency;
        client.end();
      });
    //console.log("Num Agencies:"+validAgencyCount);
}





var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      cb();
    });
  });
}

var parseAgent = function(agent,house, client){
    
    //console.log(agent);
}