import mongoose from 'mongoose'
import removeImageFromRecipe from './removeImageFromRecipe.js'

mongoose.connect('mongodb://localhost:27017/vegazetas')
    .then(() => {
        try {
            removeImageFromRecipe(
                '67e2f0919864354a0e646e7e', // userId
                '67e573e9791a96f017b0eebe', // recipeId
                'https://imgs.search.brave.com/ItR0SNtx3ox5u5H5FJtQwY8bpmtgMk2A-Jpn4XcRfio/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJhLzU4/LzI0LzJhNTgyNDE2/YjQ5OGIyZDhiODBj/YjMwNzc5NTYxOWJi/LmpwZw' // image
            )
                .then(result => console.log('image removed from recipe', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })