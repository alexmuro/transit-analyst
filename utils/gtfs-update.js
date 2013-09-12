var http = require("http");

var options = {
    host: 'www.gtfs-data-exchange.com',
    path: '/api/agencies'
};

http.get(options, function (http_res) {
    // initialize the container for our data
    console.log(http_res);
    var data = "";

    // this event fires many times, each time collecting another piece of the response
    http_res.on("data", function (chunk) {
        // append this chunk to our growing `data` var
        data += chunk;
    });

    // this event fires *one* time, after all the `data` events/chunks have been gathered
    http_res.on("end", function () {
        // you can use res.send instead of console.log to output via express
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
            console.log( agency['state']);
            validAgencyCount++
        }
    })
    console.log("Num Agencies:"+validAgencyCount);
}