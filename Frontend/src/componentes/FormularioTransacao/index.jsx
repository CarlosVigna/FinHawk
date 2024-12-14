import React, { useState, useEffect } from 'react';
import Formulario from '../Formulario';
import './formularioTransacao.css';

const FormularioTransacao = ({ tituloParaEditar, onSave }) => {
    const [categorias, setCategorias] = useState([]);
    const [valores, setValores] = useState({
        descricao: '',
        valor: '',
        emissao: '',
        vencimento: '',
        categoriaId: '',
        status: 'Pendente'
    });
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    // Carregar categorias
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
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                setErro('Erro ao carregar categorias');
            }
        };

        fetchCategorias();
    }, []);

    // Atualizar useEffect para manipular título para edição
    useEffect(() => {
        if (tituloParaEditar) {
            console.log('Carregando título para edição:', tituloParaEditar);
            setValores({
                descricao: tituloParaEditar.descricao || '',
                valor: tituloParaEditar.valor || '',
                emissao: tituloParaEditar.emissao ? tituloParaEditar.emissao.split('T')[0] : '',
                vencimento: tituloParaEditar.vencimento ? tituloParaEditar.vencimento.split('T')[0] : '',
                categoriaId: tituloParaEditar.categoria?.id || '',
                status: tituloParaEditar.status || 'Pendente'
            });
        }
    }, [tituloParaEditar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValores(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
        
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                throw new Error('Dados de autenticação não encontrados');
            }

            // Validação dos campos obrigatórios
            if (!valores.descricao || !valores.valor || !valores.emissao || !valores.vencimento || !valores.categoriaId) {
                throw new Error('Todos os campos são obrigatórios');
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

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao processar operação');
            }

            setSucesso(data.message);
            if (onSave) onSave();

            if (!tituloParaEditar) {
                setValores({
                    descricao: '',
                    valor: '',
                    emissao: '',
                    vencimento: '',
                    categoriaId: '',
                    status: 'Pendente'
                });
            }
        } catch (error) {
            console.error('Erro na operação:', error);
            setErro(error.message || 'Erro ao processar operação');
        }
    };

    const camposTransacao = [
        { label: "Descrição:", type: "text", name: "descricao", placeholder: "Descrição da transação" },
        { label: "Valor:", type: "number", name: "valor", placeholder: "0.00" },
        { label: "Data de Emissão:", type: "date", name: "emissao" },
        { label: "Data de Vencimento:", type: "date", name: "vencimento" },
        {
            label: "Categoria:",
            type: "select",
            name: "categoriaId",
            options: categorias.map(cat => ({
                value: cat.id,
                label: cat.nome
            }))
        },
        {
            label: "Status:",
            type: "select",
            name: "status",
            options: [
                { value: "Pendente", label: "Pendente" },
                { value: "Pago", label: "Pago" },
                { value: "Cancelado", label: "Cancelado" }
            ]
        }
    ];

    return (
        <div className="container-transacao">
            <Formulario
                titulo={tituloParaEditar ? "Editar Transação" : "Nova Transação"}
                campos={camposTransacao}
                botaoTexto={tituloParaEditar ? "Atualizar" : "Cadastrar"}
                handleInputChange={handleInputChange}
                valores={valores}
                onSubmit={handleSubmit}
                erro={erro}
                sucesso={sucesso}
            />
        </div>
    );
};

export default FormularioTransacao;