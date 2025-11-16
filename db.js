import mysql from 'mysql2';
const connection = mysql.createConnection({
    host: 'localhost', 
    user:'root',
    password: '',
    database: 'escuela'
});

connection.connect((err)=>{
    if(err){
        console.error('Error de conexión: '+ err);
        return;
    }else{
        console.log("Conexion exitosa mi hermano");

    }


});

export default connection;