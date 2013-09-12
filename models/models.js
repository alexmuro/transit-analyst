var Sequelize = require('sequelize');
var options = {
				host:'localhost',
				dialect:'mysql'
			  };
var sequelize = new Sequelize('transit_analyst', 'root', 'am1238wk',options);