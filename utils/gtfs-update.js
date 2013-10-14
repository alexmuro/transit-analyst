var http = require("http");
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var pg = require('pg'); 
var exec = require('child_process').exec;
var sh = require("execSync")









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
    var conString = "postgres://postgres:am1238wk@localhost:5432/gtfs";
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
                        
                        mkdirp(path.resolve(__dirname,"../gtfs/")+"/"+agency['dataexchange_id'], function(err){
                            if (err) console.error(err)
                            else console.log('created dir '+agency['dataexchange_id']);
                        });
                        if(agency["is_official"] && agency['country'] === 'United States'){
                           console.log( "Agency id:  " + agency['dataexchange_id'],"File URL:  " + "") 
                        }
                        parseAgent(JSON.parse(data).data,agency['dataexchange_id'],client);
                    });
                })
                .on('error', function(e) {
                  console.log(e);
                  console.log("Got error: " + e);
                });
            }
        })//end for each agency;
        //client.end();
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
    var fileNameOrig = agent["datafiles"][0].file_url;
    var nameSplit = fileNameOrig.substr(29);
    var schemaName = fileNameOrig.substr(29).split(".")[0];
    
    var destinationStream = path.resolve(__dirname,"../gtfs/" + house + "/" + nameSplit);
    //var query = 'CREATE SCHEMA "'+schemaName+'" ';
    //client.query(query, function(err, result) {
    //    if(err) {
    //        return console.error('error running query:',query, err);
    //    }
    var result = sh.exec("gtfsdb-load --database_url postgresql://postgres:am1238wk@localhost/gtfs --schema="+schemaName+" --is_geospatial "+destinationStream);
    console.log('return code ' + result.code);
    console.log('stdout + stderr ' + result.stdout);

    //})
    
    
    
    //download(agent["datafiles"][0].file_url,destinationStream,function(){});

    return agent["datafiles"][0].file_url;
}
