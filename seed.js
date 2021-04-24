
const Client = require('./api/models/client');
const Provider = require('./api/models/provider');

const mongoose = require('mongoose');
const ids = [mongoose.Types.ObjectId(),mongoose.Types.ObjectId(),mongoose.Types.ObjectId(),mongoose.Types.ObjectId(),mongoose.Types.ObjectId()]
const seed = {
    clients: [{
                name: "Test",
                email: "test@krfs.com",
                phone: "3055550000",
                providers: [ids[0],ids[1],ids[4]]
            },{
                name: "Test1",
                email: "test1@krfs.com",
                phone: "3055550000",
                providers: [ids[2]]
            },{
                name: "Test2",
                email: "test2@krfs.com",
                phone: "3055550000",
                providers: [ids[3]]
            }],
    providers: [
                {name: "Provider1"},
                {name: "Provider2"},
                {name: "Provider3"},
                {name: "Provider4"},
                {name: "Provider5"},
            ]
}

module.exports = async() =>{
    try {
        let providers = await Provider.find();
        //Seed Provider data if collection is empty
        if(providers && providers.length<=0){
            for(let i=0;i<seed.providers.length;i++){
                let providerData = new Provider({
                    _id: ids[i],
                    name: seed.providers[i].name
                });
                await providerData.save();
            }
            console.log("Provider seed data populated!!!");
        }

        let clients = await Client.find();
        //Seed Clients data if collection is empty
        if(clients && clients.length<=0){
            for(let i=0;i<seed.clients.length;i++){
                let clientData = new Client({
                    _id: mongoose.Types.ObjectId(),
                    ...seed.clients[i]
                });
                await clientData.save();
            }
            console.log("Client seed data populated!!!");
        }

    } catch (error) {
        console.log("Error occurred in seeding: "+error);
    }
}