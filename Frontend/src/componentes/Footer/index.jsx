import './footer.css';

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-links">
                    <a href="#home">Home</a>
                    <a href="#sobre">Sobre</a>
                    <a href="#contato">Contato</a>
                </div>
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagens/facebook-icon.png" alt="Facebook" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagens/twitter-icon.png" alt="Twitter" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagens/instagram-icon.png" alt="Instagram" />
                    </a>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} FinHwak. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
