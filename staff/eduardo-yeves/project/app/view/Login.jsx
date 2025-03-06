function Login({ onRegisterClicked }) {
    const handleRegisterLinkClick = event => {
        event.preventDefault()

        onRegisterClicked()
    }

    const handleFormSubmit = event => {
        event.preventDefault()

        alert('form sent')
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