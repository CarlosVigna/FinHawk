import React, { useState, useEffect } from 'react';
import './formularioTransacao.css';

const FormularioTransacao = ({ tituloParaEditar, onSave, onCancel }) => {
    const [categorias, setCategorias] = useState([]);
    const [valores, setValores] = useState({
        descricao: '',
        valor: '',
        emissao: '',
        vencimento: '',
        categoriaId: '',
        status: 'Pendente',
        tipo: ''
    });
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/categorias', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Falha ao carregar categorias.');
                }
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                setErro(error.message);
            }
        };
        fetchCategorias();
    }, []);


    useEffect(() => {
        if (tituloParaEditar) {
            setValores({
                descricao: tituloParaEditar.descricao || '',
                valor: tituloParaEditar.valor || '',
                emissao: tituloParaEditar.emissao ? tituloParaEditar.emissao.split('T')[0] : '',
                vencimento: tituloParaEditar.vencimento ? tituloParaEditar.vencimento.split('T')[0] : '',
                categoriaId: tituloParaEditar.categoria?.id || '',
                status: tituloParaEditar.status || 'Pendente',
                tipo: tituloParaEditar.tipo || ''
            });
        } else {

            setValores({
                descricao: '',
                valor: '',
                emissao: '',
                vencimento: '',
                categoriaId: '',
                status: 'Pendente',
                tipo: ''
            });
        }
    }, [tituloParaEditar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValores(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                throw new Error('Dados de autenticação não encontrados.');
            }

            const dadosParaEnviar = {
                ...valores,
                valor: parseFloat(valores.valor),
                categoriaId: parseInt(valores.categoriaId),
                emissao: valores.emissao,
                vencimento: valores.vencimento,
                contaId: parseInt(idConta)
            };

            const url = tituloParaEditar
                ? `http://localhost:8080/titulos/${tituloParaEditar.id}`
                : `http://localhost:8080/contas/${idConta}/titulos`;

            const response = await fetch(url, {
                method: tituloParaEditar ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosParaEnviar)
            });

            const data = await response.json();
            if (response.status === 400) {
                throw new Error(data.message || 'Erro de validação do servidor');
            }
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao processar operação');
            }

            setSucesso(data.message);
            if (onSave) onSave();
        } catch (error) {
            setErro(error.message);
        }
    };

    return (
        <form className="formulario-horizontal" onSubmit={handleSubmit}>
            {erro && <div className="error-message">{erro}</div>}
            {sucesso && <div className="success-message">{sucesso}</div>}

            <div className="linha-formulario">
                <div className="campo-formulario tipo-transacao">
                    <label htmlFor="tipo">Tipo de Transação</label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={valores.tipo}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Selecione o tipo</option>
                        <option value="Recebimento">Recebimento</option>
                        <option value="Pagamento">Pagamento</option>
                    </select>
                </div>

                <div className="campo-formulario descricao">
                    <label htmlFor="descricao">Descrição</label>
                    <input
                        type="text"
                        id="descricao"
                        name="descricao"
                        value={valores.descricao}
                        onChange={handleInputChange}
                        placeholder="Digite a descrição"
                    />
                </div>

                <div className="campo-formulario valor">
                    <label htmlFor="valor">Valor R$</label>
                    <input
                        type="number"
                        id="valor"
                        name="valor"
                        value={valores.valor}
                        onChange={handleInputChange}
                        placeholder="0,00"
                        step="0.01"
                    />
                </div>
            </div>

            <div className="linha-formulario">
                <div className="campo-formulario categoria">
                    <label htmlFor="categoriaId">Categoria</label>
                    <select
                        id="categoriaId"
                        name="categoriaId"
                        value={valores.categoriaId}
                        onChange={handleInputChange}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="campo-formulario datas">
                    <label htmlFor="emissao">Data de Emissão</label>
                    <input
                        type="date"
                        id="emissao"
                        name="emissao"
                        value={valores.emissao}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="campo-formulario datas">
                    <label htmlFor="vencimento">Data de Vencimento</label>
                    <input
                        type="date"
                        id="vencimento"
                        name="vencimento"
                        value={valores.vencimento}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="campo-formulario status">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={valores.status}
                        onChange={handleInputChange}
                    >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
            </div>

            <div className="botoes-formulario">
                <button type="submit" className="botao-salvar">
                    {tituloParaEditar ? 'Atualizar' : 'Cadastrar'}
                </button>
                {tituloParaEditar && (
                    <button
                        type="button"
                        className="botao-cancelar"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default FormularioTransacao;