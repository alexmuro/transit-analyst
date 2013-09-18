var http = require("http");
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

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
                        else console.log('hooray!')
                    });

                    //mkdirp('')
                    console.log( "Agency id:  " + agency['dataexchange_id'],"File URL:  " + parseAgent(JSON.parse(data).data,agency['dataexchange_id'])) 
                });
            })
            .on('error', function(e) {
              console.log(e);
              console.log("Got error: " + e);
            });

        }
    })
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

var parseAgent = function(agent,house){
    var fileNameOrig = agent["datafiles"][0].file_url;
    var nameSplit = fileNameOrig.substr(29)

    var destinationStream = path.resolve(__dirname,"../gtfs/" + house + "/" + nameSplit);
    download(agent["datafiles"][0].file_url,destinationStream,function(){});

    return agent["datafiles"][0].file_url;


}