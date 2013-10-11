poverty = {
	census_tracts:[],
	census_variables:['B23025_002E'],//you will have to look up correct variables. Most likely these will be in ACS5
	output:[],
	start:function(){
		
		$.ajax({url:'http://www.gtfs-data-exchange.com/api/agencies',dataType: 'jsonp'})
			.done(function(data){
				//console.log('test',data);
				poverty.parseData(data.data);
			})
			.error(function(e){
				console.log(e.responseText);
			})
	},
	parseData:function(data){
		var i = 0;
		data.forEach(function(agency){
			if(agency.is_official){
				poverty.parseAgency(agency.dataexchange_id);
				if(i >= 1){
					agency.is_official = 1;
					// var temp = new Date(agency.date_last_updated * 1000);
					// agency.date_last_updated = temp;
					// agency.date_added = new Date(agency.date_added * 1000);
					//console.log(agency);
					var trip = {};
					// $.ajax({ 
					//   	type:"GET",
					//   	data:agency,
					//   	url:'http://localhost:1337/agency/create'
					// })
					// .done(function(data){parseAgency
					// 	console.log(data);
					// })
					// .error(function(e){
					// 	console.log(e.responseText);
					// })

				}
				i++;
			}
		})
		console.log('finished');

	},
	parseAgency:function(agencyID){

		$.ajax({url:'http://www.gtfs-data-exchange.com/api/agency?agency='+agencyID,dataType: 'jsonp'})
		.done(function(data){
			//console.log('test',data);
			//console.log(data.data);
			var i = 0;
			data.data.datafiles.forEach(function(datafile){
				 
    			datafile.datafile_id = datafile.file_url.substr(29).split(".")[0];
    			datafile.agency_id = agencyID;
    			datafile.gtfs_loaded = 1;
    			if(i > 0){
    			 	datafile.gtfs_loaded = 0;
    			}else{
					$.ajax({ 
					  	type:"GET",
					  	data:datafile,
					  	url:'http://localhost:1337/datafile/create'
					})
					.done(function(data){parseAgency
						console.log(data);
					})
					.error(function(e){
						console.log(e.responseText);
					})

    			}
    			i++;
    			console.log(datafile);
			})


		})
		.error(function(e){
			console.log(e.responseText);
		})

	}
}