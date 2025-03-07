import logic from '../logic'

import { errors } from 'com'
const { NotFoundError, SytemError } = errors

function Login({ onRegisterClicked, onUserLoggedIn }) {
    const handleRegisterLinkClick = event => {
        event.preventDefault()

        onRegisterClicked()
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        const form = event.target

        const email = form.email.value
        const password = form.password.value

        try {
            logic.loginUser(email, password)
                .then(() => {
                    form.reset()

                    onUserLoggedIn()
                })
                .catch(error => {
                    if (error instanceof NotFoundError)
                        alert(error.message)
                    else if (error instanceof SytemError)
                        alert('Sorry try again')
                })
        } catch (error) {
            alert(error.message)

            console.error(error)
        }
    }

    console.log('Login -> render')

    return <div>
        <h1>Hola Login!</h1>

        <form className="flex flex-col gap-2 m-5" onSubmit={handleFormSubmit}>
            <label htmlFor="email">Email</label>
            <input className="input" type="text" id="email" />

            <label htmlFor="password">Password</label>
            <input className="input" type="password" id="password" />

            <button type="submit">Login</button>

            <a href="" onClick={handleRegisterLinkClick} >Register</a>
        </form>
    </div>
}

export default Login