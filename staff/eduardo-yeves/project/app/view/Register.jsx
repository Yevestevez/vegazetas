function Register({ onLoginClicked }) {
    const handleLoginLinkClick = event => {
        event.preventDefault()

        onLoginClicked()
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        alert('form sent')
        // implementar lógica registerUser y onUserRegistered() con props para pasar el resultado a App, que cambiará la vista a Login
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