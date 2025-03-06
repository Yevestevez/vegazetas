function Landing({ onLoginClicked, onRegisterClicked }) {
    const handleLoginLinkClick = event => {
        event.preventDefault()

        onLoginClicked()
    }

    const handleRegisterLinkClick = event => {
        event.preventDefault()

        onRegisterClicked()
    }

    console.log('Landing -> render')

    return <div>
        <h1>Hola Landing!</h1>
        <p><a href="" onClick={handleLoginLinkClick}>Login</a> or <a href="" onClick={handleRegisterLinkClick}>Register</a></p>
    </div>
}

export default Landing