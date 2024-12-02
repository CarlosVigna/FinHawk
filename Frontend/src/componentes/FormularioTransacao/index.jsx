import React, { useState, useEffect } from 'react';
import ListaTitulo from '../../pages/ListaTitulo';
import CampoTexto from '../CampoTexto';
import Botao from '../Botao';
import './formularioTransacao.css';

const FormularioTransacao = () => {
    const [titulos, setTitulos] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [tipoTransacao, setTipoTransacao] = useState('Recebimento');
    const [valorTitulo, setValorTitulo] = useState(0);
    const [dataEmissao, setDataEmissao] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [statusTransacao, setStatusTransacao] = useState('Em Aberto');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [error, setError] = useState(null);
    const [tituloEditando, setTituloEditando] = useState(null);

    
    const formatarDataParaInput = (dataArray) => {
        if (dataArray && dataArray.length === 3) {
            const [ano, mes, dia] = dataArray;
            return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        }
        return ''; 
    };

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token não encontrado. Faça login novamente.');
                }

                const response = await fetch('http://localhost:8080/categorias', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar categorias: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Categorias recebidas:', data);
                if (Array.isArray(data)) {
                    setCategorias(data);
                } else {
                    throw new Error('Categorias não retornaram como um array.');
                }
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
                setError(error.message);
            }
        };

        fetchCategorias();
    }, []);

    useEffect(() => {
        const fetchTitulos = async () => {
            try {
                const response = await fetch('http://localhost:8080/titulos');
                if (!response.ok) {
                    throw new Error('Erro ao buscar títulos');
                }
                const data = await response.json();
                console.log('Títulos recebidos:', data);
                setTitulos(data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchTitulos();
    }, []);

    const adicionarOuAtualizarTitulo = async (e) => {
        e.preventDefault();


        const idConta = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        if (!idConta) {
            alert('Nenhuma conta selecionada.');
            return;
        }

        if (!valorTitulo || !dataEmissao || !dataVencimento || !categoria) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const tituloData = {
            descricao: descricao,
            valor: valorTitulo,
            emissao: dataEmissao,
            vencimento: dataVencimento,
            categoriaId: categoria,
            status: statusTransacao,
            contaId: idConta,
        };

        console.log('Dados do título a serem enviados:', tituloData);

        try {
            let response;
            if (tituloEditando) {
                response = await fetch(`http://localhost:8080/titulos/${tituloEditando.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(tituloData),
                });
            } else {
                response = await fetch(`http://localhost:8080/contas/${idConta}/titulos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(tituloData),
                });
            }

            if (response.ok) {
                const resultado = await response.json();
                console.log('Resposta da API:', resultado);
                if (!tituloEditando) {
                    setNumeroDocumento(resultado.numeroDocumento);
                }
                alert(tituloEditando ? 'Título atualizado com sucesso!' : 'Título cadastrado com sucesso');
                resetarCamposTitulo();
                fetchTitulos(); 
                setError(null);
            } else {
                throw new Error('Erro ao salvar título');
            }
        } catch (error) {
            console.error('Erro ao salvar o título:', error);
            setError(error.message);
        }
    };

    const resetarCamposTitulo = () => {
        setDescricao('');
        setValorTitulo(0);
        setTipoTransacao('Recebimento');
        setDataEmissao('');
        setDataVencimento('');
        setCategoria('');
        setStatusTransacao('Em Aberto');
        setNumeroDocumento('');
        setError(null);
        setTituloEditando(null);
    };

    const cancelarEdicao = () => {
        
        resetarCamposTitulo();
    };

    const statusOptions = tipoTransacao === 'Recebimento' ? ['Em Aberto', 'Recebido'] : ['Em Aberto', 'Pago'];

    const handleEditar = (titulo) => {
        console.log('Editando título:', titulo);

        const dataEmissaoFormatada = formatarDataParaInput(titulo.emissao);
        const dataVencimentoFormatada = formatarDataParaInput(titulo.vencimento);

        
        setTituloEditando(titulo);
        setDescricao(titulo.descricao);
        setTipoTransacao(titulo.categoria.tipo);
        setValorTitulo(titulo.valor);
        setDataEmissao(dataEmissaoFormatada); 
        setDataVencimento(dataVencimentoFormatada);
        setCategoria(titulo.categoria.id);
        setStatusTransacao(titulo.status);
    };

    return (
        <div className='container-transacao'>
            <form onSubmit={adicionarOuAtualizarTitulo}>
                <div className='titulo-transacao'>
                    <h2>{tituloEditando ? 'Editar Título' : 'Lançamentos'}</h2>
                </div>

                <CampoTexto
                        label="Descrição"
                        placeholder="Digite uma breve descrição"
                        type="text"
                        onChange={(e) => {
                            console.log('Alterado descricao do título:', e.target.value);
                            setDescricao(e.target.value);
                        }}
                        valor={descricao}
                        name="descricao"
                    />

                <div className='grid-container'>
                    <div className='tipo-transacao'>
                        <label>Tipo de Transação:</label>
                        <select
                            name="tipoTransacao"
                            value={tipoTransacao}
                            onChange={(e) => {
                                console.log('Alterado tipo de transação:', e.target.value);
                                setTipoTransacao(e.target.value);
                            }}
                        >
                            <option value="Recebimento">Recebimento</option>
                            <option value="Pagamento">Pagamento</option>
                        </select>
                    </div>

                    <CampoTexto
                        label="Data de Emissão"
                        placeholder="DD/MM/AAAA"
                        type="date"
                        onChange={(e) => {
                            console.log('Alterado data de emissão:', e.target.value);
                            setDataEmissao(e.target.value);
                        }}
                        valor={dataEmissao}  
                        name="dataEmissao"
                    />

                    <CampoTexto
                        label="Data de Vencimento"
                        placeholder="DD/MM/AAAA"
                        type="date"
                        onChange={(e) => {
                            console.log('Alterado data de vencimento:', e.target.value);
                            setDataVencimento(e.target.value);
                        }}
                        valor={dataVencimento}  
                        name="dataVencimento"
                    />
                    <div className='categoria-transacao'>
                        <label>Categoria:</label>
                        <select
                            name="categoria"
                            value={categoria}
                            onChange={(e) => {
                                console.log('Alterada categoria:', e.target.value);
                                setCategoria(e.target.value);
                            }}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categorias && categorias.length > 0 ? (
                                categorias
                                    .filter((cat) => cat.tipo === tipoTransacao)
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nome}
                                        </option>
                                    ))
                            ) : (
                                <option value="" disabled>Carregando categorias...</option>
                            )}
                        </select>
                    </div>

                    <CampoTexto
                        label="Valor Título"
                        placeholder="Digite o valor do título"
                        type="number"
                        onChange={(e) => {
                            console.log('Alterado valor título:', e.target.value);
                            setValorTitulo(parseFloat(e.target.value));
                        }}
                        valor={valorTitulo}
                        name="valorTitulo"
                    />

                    <div className='status-transacao'>
                        <label>Status:</label>
                        <select
                            name="statusTransacao"
                            value={statusTransacao}
                            onChange={(e) => {
                                console.log('Alterado status de transação:', e.target.value);
                                setStatusTransacao(e.target.value);
                            }}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='botao-container'>
                    <Botao
                        texto={tituloEditando ? "ATUALIZAR TÍTULO" : "SALVAR TÍTULO"}
                        className="botao-padrao botao-salvar"
                        type="submit"
                    />
                    {tituloEditando && (
                        <Botao
                            texto="CANCELAR EDIÇÃO"
                            className="botao-padrao botao-cancelar"
                            onClick={cancelarEdicao}  
                        />
                    )}
                    <Botao
                        texto="SAIR"
                        className="botao-padrao botao-sair"
                        onClick={resetarCamposTitulo}
                    />
                </div>
            </form>

            <div className="lista-titulo">
                <ListaTitulo onEdit={handleEditar} />
            </div>
        </div>
    );
};

export default FormularioTransacao;
