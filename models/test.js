var Sequelize = require('sequelize'),
    db = new Sequelize('dev_', 'root', '123456');
 
  /**
   * @type {Object}
   * Map all attributes of the registry
   * (Instance method useful to every sequelize Table)
   * @this {SequelizeRegistry}
   * @return {Object} All attributes in a Object.
   */
    var map_attributes = function() {
      var obj = new Object(),
          ctx = this;
      ctx.attributes.forEach(
        function(attr) {
          obj[attr] = ctx[attr];
        }
      );
      return obj;
    };
 
/**
 * @type {Object}
 * All models we have defined over Sequelize, plus the db instance itself
 */
var self = module.exports = {
  'db' : db,
 
  User: db.define('user',
    {
      name: {
              type: Sequelize.STRING,
              defaultValue: 'Not Big Deal',
              allowNull: false
            }
    },
    {
      timestamps: true,
      freezeTableName: true,
 
      classMethods: {
        staticExample: function() { this.name }
      },
      instanceMethods: {
        mapAttributes: map_attributes
      }
    }
  ),
 
  Activity: db.define('activity',
    {
      type: { type: Sequelize.STRING },
      value: { type: Sequelize.STRING }
    },
    {
      timestamps: true,
      freezeTableName: true,
 
      instanceMethods: {
        mapAttributes: map_attributes
      }
    }
  ),
 
  Company: db.define('company',
  {
    name: { type: Sequelize.STRING, defaultValue: 'MegaCorp', allowNull: false }
  },
  {
    timestamps: true,
    freezeTableName: true,
 
    instanceMethods: {
        mapAttributes: map_attributes
      }
  })
 
};
 
self.Activity.belongsTo(self.User, {foreignKey: 'user_id'});
self.User.hasMany(self.Activity, {foreignKey: 'user_id'});
 
self.User.belongsTo(self.Company, {foreignKey: 'company_id'});
self.Company.hasMany(self.User, {foreignKey: 'company_id'});
 
if (GLOBAL.db_seed) {
  console.info('SEED TIME!');
 
  var chainer = new Sequelize.Utils.QueryChainer;
 
  chainer
    .add(self.Company.sync({force: true}))
    .add(self.User.sync({force: true}))
    .add(self.Activity.sync({force: true}))
    .run()
    .on('success', function() {
 
      var seeds = require('./seeds');
      for (var model_name in seeds) {
        console.log('MODEL', model_name);
        for (var i = 0; i < seeds[model_name].length; i++) {
          self[model_name].create(seeds[model_name][i])
            .on('success', function(novo) { })
            .on('failure', function(erro) {
              console.error('DB SEED ERROR!!', erro);
              process.kill();
            });
          console.log('  ', seeds[model_name][i]);
        }
      }
    })
    .on('failure', function(errors) {
 
      console.error('DB schema change FAIL', errors);
      process.kill();
    });
 
}
 
// User.staticExample()
// User.build({}).instanceExample()