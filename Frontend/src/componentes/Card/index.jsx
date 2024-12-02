import React from 'react';
import Botao from '../Botao';
import './card.css';

const Card = ({ conta, onEntrar, onEditar, onExcluir }) => {
    return (
        <div className='card'>
            <img className='imagem-card' src={conta.fotoUrl} alt='Imagem da conta' />
            <h1>{conta.nome}</h1>
            <ul>
                {Array.isArray(conta.usuarios) && conta.usuarios.length > 0 ? (
                    conta.usuarios.map(usuario => (
                        <li key={usuario.id}>{usuario.nome}</li>
                    ))
                ) : (
                    <li>Sem usuários associados.</li>
                )}
            </ul>
            <div className='botao-container'>
                <Botao 
                    className="botao-padrao botao-card" 
                    texto="Entrar" 
                    onClick={() => onEntrar(conta.id)} 
                />
                <Botao 
                    className="botao-padrao botao-card" 
                    texto="Editar" 
                    onClick={() => onEditar(conta.id)} 
                />
                <Botao 
                    className="botao-padrao botao-card" 
                    texto="Excluir" 
                    onClick={() => onExcluir(conta.id)} 
                />
            </div>
        </div>
    );
};

export default Card;
