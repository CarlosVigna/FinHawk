import React from 'react';
import Botao from '../Botao';
import './card.css';
import imagemPadrao from '../../assets/imagens/conta-padrao.png';

const Card = ({ conta, onEntrar, onEditar, onExcluir }) => {
    const handleImageError = (e) => {
        e.target.src = imagemPadrao;
    };

    return (
        <div className='card'>
            <div className="card-header">
                <img
                    className='imagem-card'
                    src={conta.fotoUrl || imagemPadrao}
                    alt='Imagem da conta'
                    onError={handleImageError}
                />
                <h1>{conta.nome}</h1>
            </div>

            <div className="card-content">
                <ul>
                    {Array.isArray(conta.usuarios) && conta.usuarios.length > 0 ? (
                        conta.usuarios.map(usuario => (
                            <li key={usuario.id}>{usuario.nome}</li>
                        ))
                    ) : (
                        <li>Sem usuários associados.</li>
                    )}
                </ul>
            </div>

            <div className="card-botoes">
                <button className="botao-entrar" onClick={() => onEntrar(conta.id)}>Entrar</button>
                <button className="botao-editar" onClick={() => onEditar(conta.id)}>Editar</button>
                <button className="botao-excluir" onClick={() => onExcluir(conta.id)}>Excluir</button>
            </div>
        </div>
    );
};

export default Card;
