/*
 * 설정 파일
 *
 */

module.exports = {
	server_port: 3000,
	db: {
        connectionLimit : 10, 
        host     : 'localhost',
        user     : 'root',
        password : 'admin',
        database : 'sunny',
        debug    :  false
    },
	db_schemas: [
	    {name:'memo', file:'../database/memo_database'}
	],
	routes: [
	    //===== Memo =====//
	    {file:'./memo', path:'/process/save', method:'saveMemo', type:'post', upload:'photo'}
	]
}

