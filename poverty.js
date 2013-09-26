poverty = {
	census_tracts:[],
	census_variables:['B23025_002E'],//you will have to look up correct variables. Most likely these will be in ACS5
	output:[],
	getData:function(tracts){
		poverty.census_tracts = tracts;
		$.ajax({url:createCensusURL()})
			.done(function(data){
				parseData(data);
			})
			.error(function(e){
				console.log(e.responseText);
			})
	}
	createCensusURL:function(){
		var base="http://api.census.gov/somestuff";
		var tracts= "";
		var vars = "";
		poverty.census_tracts.forEach(function(tract){
			tracts += tract;
		});
		poverty.census_variables.forEach(function(var_name){
			vars += var_name;
		})		

		var URL = base+tracts+vars;// this will likely be more complicated than just adding together strings
		return URL;
	}
	parseData:function(data){

		data.forEach(function(tract){
			//careful here I think you get a header row you may have to check for and parse out
			var tractOutput = {};
			tractOutput['geoid'] = tract.geoid;//This is pseudo code, most check against real data
			tractOutput['poverty'] = (tract.povertyCount / tract.totalPopulation)*100;//Again this is sudo code you may be able to get % poverty as a var and not have to do any calculation
			poverty.output.push(tractOutput);
		})
		console.log('finished',poverty.output);

	}
}