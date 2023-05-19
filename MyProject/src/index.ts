import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
const express = require('express');
const app = express();
const cors = require('cors');

AppDataSource.initialize().then(async () => {
    // middlewares
    app.use(express.json())
    app.use(cors())
    const user = new User()
    const userRepository = AppDataSource.getRepository(User)

    // APIs

    app.post("/users", async (req,res) => {
    
    const {firstName, lastName, age} = req.body
    user.firstName = firstName
    user.lastName = lastName
    user.age = age

    const isUserThere = await userRepository.findOneBy({
        firstName : firstName
    }) 
    if(isUserThere === null){
        const newUser = await userRepository.save(user)
        res.send(newUser)
    }
    else {
        res.send("user already exists!")
    }


    
   
   
})

    app.get('/users', async (req,res) => {
        const allUsers = await userRepository.find()
        res.send(allUsers)
    })

    app.get("/users/:id", async (req,res) => {
        const {id} = req.params
        const getUser = await userRepository.findOneBy({
            id : id
        })
        res.send(getUser)
    })

    app.put('/users/:id', async (req,res) => {
        const {id} = req.params
        const {firstName, lastName, age} = req.body
        const updateUser = await userRepository.findOneBy({
            id : id
        })
        updateUser.firstName = firstName,
        updateUser.lastName = lastName,
        updateUser.age = age

        await userRepository.save(updateUser)

        res.send("details updated !!")
    })

    app.delete("/users/:id" , async (req, res) => {
        const {id} = req.params
        const deleteUser = await userRepository.findOneBy({
            id : id
        })
        await userRepository.remove(deleteUser)
        res.send("user Deleted !!")
    })

    

 app.listen(5003, () => console.log("server running on port 5003.."))
}).catch(error => console.log(error))

