import { useState, useEffect } from 'react'

import logic from '../../logic'

import { errors } from 'com'
const { NotFoundError, SystemError } = errors

function Home() {
    const [name, setName] = useState(null)

    useEffect(() => {
        console.log('Home -> "componentDidMount" (useEffect)')

        try {
            logic.getUserName()
                .then(name => setName(name))
                .catch(error => {
                    if (error instanceof NotFoundError)
                        alert(error.message)
                    else if (error instanceof SystemError)
                        alert('sorry, try again')
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }, [])

    console.log('Home -> render')

    return <div>
        <h1>Hola Home!</h1>
        <h2>{name}</h2>
    </div>
}

export default Home