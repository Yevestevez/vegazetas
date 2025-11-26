import { FaGithub, FaLinkedin } from "react-icons/fa"

function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 bg-black w-screen flex items-center justify-center text-right p-4 gap-6 z-10">
            <div className="anybody-text text-white text-xs sm:text-sm leading-4 sm:leading-5 z-100">
                <p>Desarrollado por <strong>Edu Yeves</strong></p>
                <small className="italic">yevestevez.cg@gmail.com</small>
            </div>

            <nav className="flex items-center gap-4">
                <a
                    href="https://linkedin.com/in/edu-yeves"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaLinkedin className="text-white hover:text-folly size-7 sm:size-8 transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-105 active:scale-95 focus:scale-105" />
                </a>

                <a
                    href="https://github.com/Yevestevez"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub className="text-white hover:text-folly size-7 sm:size-8 transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-105 active:scale-95 focus:scale-105" />
                </a>
            </nav>
        </footer>
    )
}

export default Footer