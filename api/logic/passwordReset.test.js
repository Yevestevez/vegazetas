import mongoose from 'mongoose'
import 'dotenv/config'
import passwordReset from "./passwordReset.js";

mongoose.connect(process.env.TEST_MONGO_URL)
    .then(() => {
        try {
            passwordReset('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODQ5OTA0OTg2ZTllZjRiZmNkZTY5NGYiLCJpYXQiOjE3NDk3NDA3MTQsImV4cCI6MTc0OTc0MTYxNH0.9uYZYRsZnG0qTFgXApo7-CZcKe_FW37fQbKXjxeX_h0', 'b123123123')
                .then(() => console.log('password reset'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))