const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')


const app = express()
const port = process.env.Port || 3000


app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password: '',
    database: 'disenio'
})

//LEER
app.get('', (req, res) => {
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`conexionid ${connection.threadId}`)
        connection.query('SELECT * from products', (err, rows)=>{
            connection.release()

            if(!err){
                res.send(rows)
            } else {
                console.log(err)

            }
        })
    })
})


//OBTENER RESULTADOR POR ID
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`conexiond ${connection.threadId}`)
        connection.query('SELECT * from products WHERE id = ?', [req.params.id], (err, rows)=>{
            connection.release()

            if(!err){
                res.send(rows)
            } else {
                console.log(err)

            }
        })
    })
})

//ADICIONAR
app.post('/adicionar', (req, res) => {
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`conexionid ${connection.threadId}`)

        const params = req.body

        connection.query('INSERT INTO products SET ?', params, (err, rows)=>{
            connection.release()

            if(!err){
                res.send(`El producto: ${[params.id]} ha sido agregado`)
            } else {
                console.log(err)

            }
        })
        console.log(req.body)
    })
})

//DELETE
app.delete('/delete/:id', (req, res) => {
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`conexionid ${connection.threadId}`)
        connection.query('DELETE from products WHERE id = ?', [req.params.id], (err, rows)=>{
            connection.release()

            if(!err){
                res.send(`El producto ${[req.params.id]} ha sido eliminado`)
            } else {
                console.log(err)

            }
        })
    })
})





//ACTUALIZAR
app.put('/actualizar/:id', (req, res) => {
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        
        const {id, title, price, description, category, image} = req.body

        connection.query('UPDATE products SET title = ?, price = ?, description = ?, category = ?, image = ? WHERE id = ?', [title, price, description, category, image, id], (err, rows)=>{
            connection.release()

            if(!err){
                res.send(`El producto ha sido actualizado`)
            } else {
                console.log(err)

            }
        })
        console.log(req.body)
    })
})






app.listen(port, () => console.log(`Escuchando en el puerto ${port}`))