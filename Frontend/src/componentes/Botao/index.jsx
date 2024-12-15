import './botao.css'

const Botao = ({ texto, onClick, className }) => {
    return (
        <button
        onClick={onClick} 
        className={className}>
            {texto}
        </button>
    );
}

export default Botao;