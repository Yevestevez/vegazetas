import mongoose from 'mongoose'
import 'dotenv/config'
import passwordReset from "./passwordReset.js";

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        try {
            passwordReset('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODQ5OTA0OTg2ZTllZjRiZmNkZTY5NGYiLCJpYXQiOjE3NDk3NDQ0OTAsImV4cCI6MTc0OTc0NTM5MH0.DdwiSO2ezq5mufICgPaxlC9K3HXH8dMi49bja4QcTJo', 'b123123123')
                .then(() => console.log('password reset'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))