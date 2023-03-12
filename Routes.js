const express = require('express')
const mongoose = require('mongoose')
const Routes = express.Router()

const People = mongoose.model('Person',{
    UserName: String,
    Password: String
})

const Likes = mongoose.model('Likes',{
    Ref: String,
})
const Comentary = mongoose.model('Comentario',{
    ComentID : Number,
    Name: String,
    Text: String,
    Data: String,
    isReply: Boolean,
    Replyfor: Number,
    Ref: String
})
Routes.get('/Person', async (req, res) => {
    let db = []
    const person = await People.find()
    person.forEach(element => {
        db.push(element)
    });
    const uniqueDB = [... new Set(db.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
    return res.json(uniqueDB)
})

Routes.post('/Person', async (req, res) => {
    const person = await People.find()
    const {UserName, Password} = req.body
    if (!UserName || !Password ) {
        return res.status(202).json({error: 'Você não preencheu os dois campos.'})
    } 

let jaexiste;

    person.forEach((item) => {
        if (item.UserName === UserName) {
            jaexiste = true
        }
    })

    if (jaexiste) {
        return res.status(202).json({error: 'A pessoa já existe no sistema.'})
    }
    
    let User = {
        UserName,
        Password
    }
    
    try {
        await People.create(User)
        return res.status(201).json({message: 'Usuário criado.'})
    } catch (error) {
        res.status(500).json({error: error})
    }
})
    // Routes.post('/Login', async (req, res) => {
    //     const people = await People.find()
    //     let {UserName, Password} = req.body
    //     people.forEach(item => {
    //         if (item.UserName ===  UserName) {
    //             if (item.Password === Password) {
    //                 return 
    //             }
    //         }
    //     })
    // })

    Routes.post('/Comentary',async (req, res) => {
        const Reply = await Comentary.find()
        const {ComentID, Name, Text, Data, isReply, Replyfor, Ref} = req.body
        
        if (!Name || !Text || !ComentID && !ComentID !== 0) {
            console.log(!!Name, !!Text, !!Data, !!ComentID)
            return res.status(202).json({error: req.body})
        }

        let Comentario = {
            ComentID,
             Name,
             Text,
             Data,
             isReply,
             Replyfor,
             Ref 
        }

        try {
            await Comentary.create(Comentario)
         return res.status(201).json({message: 'Comentário criado.'})
        }
        catch (err) {
        res.status(500).json({error: err})
        }
    })

    Routes.get('/Comentary', async (req, res) => {
        let db = []
        const coments = await Comentary.find()
        coments.forEach(item => db.push(item))
        const uniqueDB = [... new Set(db.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
        return res.json(uniqueDB)
    })

    Routes.delete('/Admin/Deleteall/Person',async (req, res) => {
        try {
            await People.deleteMany()
            res.status(200).json({message: 'Tudo deletado.'})
        } catch (error) {
            res.status(404).json({error: error})  
        }
    })

    module.exports = Routes