import logic from '../logic'

import { errors } from 'com'
const { DuplicityError, SytemError } = errors

function Register({ onLoginClicked, onUserRegisterd }) {
    const handleLoginLinkClick = event => {
        event.preventDefault()

        onLoginClicked()
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value
        const email = form.email.value
        const username = form.username.value
        const password = form.password.value

        try {
            logic.registerUser(name, email, username, password)
                .then(() => {
                    form.reset()

                    onUserRegistered()
                })
                .catch(error => {
                    if (error instanceof DuplicityError)
                        alert(error.message)
                    else if (error instanceof SytemError)
                        alert('Sorry, try again later')
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    console.log('Register -> render')

    return <div>
        <h1>Hola Register!</h1>

        <form className="flex flex-col gap-2 m-5" onSubmit={handleFormSubmit}>
            <label htmlFor="name">Name</label>
            <input className="input" type="text" id="name" />

            <label htmlFor="email">Email</label>
            <input className="input" type="email" id="email" />

            <label htmlFor="username">Username</label>
            <input className="input" type="text" id="username" />

            <label htmlFor="password">Password</label>
            <input className="input" type="password" id="password" />

            <button type="submit">Register</button>
        </form>

        <a href="" onClick={handleLoginLinkClick}>Login</a>
    </div>
}

export default Register