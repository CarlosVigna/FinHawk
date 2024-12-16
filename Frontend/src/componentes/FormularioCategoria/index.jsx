import React from 'react';
import './formularioCategoria.css';

const FormularioCategoria = ({ valores, handleInputChange, onSubmit, erro, sucesso }) => {
    return (
        <form className="formulario-horizontal" onSubmit={onSubmit}>
            {erro && <div className="error-message">{erro}</div>}
            {sucesso && <div className="success-message">{sucesso}</div>}

            <div className="linha-formulario">
                <div className="campo-formulario">
                    <label htmlFor="nome">Nome da Categoria</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={valores.nome}
                        onChange={handleInputChange}
                        placeholder="Digite o nome da categoria"
                        required
                    />
                </div>

                <div className="campo-formulario">
                    <label htmlFor="tipo">Tipo</label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={valores.tipo}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Recebimento">Recebimento</option>
                        <option value="Pagamento">Pagamento</option>
                    </select>
                </div>
            </div>

            <div className="botoes-formulario">
                <button type="submit" className="botao-salvar">
                    Cadastrar
                </button>
            </div>
        </form>
    );
};

export default FormularioCategoria;
