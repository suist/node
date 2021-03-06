
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
        {file:'./user', path:'/process/modifyUser', method:'modifyUser', type:'post'}
	],
	facebook: {		// passport facebook
		clientID: '468772174046281',
		clientSecret: 'e5576154f3eddc64bdc531b9abf21f6a',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}