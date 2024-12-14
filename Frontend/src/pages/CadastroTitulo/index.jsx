import React, { useState, useCallback } from 'react';
import FormularioTransacao from '../../componentes/FormularioTransacao';
import ListaTitulo from '../ListaTitulo';
import './cadastroTitulo.css';

const CadastroTitulo = () => {
    const [tituloParaEditar, setTituloParaEditar] = useState(null);
    const [refreshList, setRefreshList] = useState(false);

    const handleEdit = useCallback((titulo) => {
        console.log('Iniciando edição do título:', titulo);
        setTituloParaEditar(titulo);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSave = useCallback(() => {
        console.log('Salvando alterações...');
        setTituloParaEditar(null);
        setRefreshList(prev => !prev);
    }, []);

    return (
        <div className="cadastro-titulo">
            <div className="lado-esquerdo">
                <FormularioTransacao 
                    tituloParaEditar={tituloParaEditar} 
                    onSave={handleSave}
                />
            </div>
            <div className="lado-direito">
                <ListaTitulo 
                    onEdit={handleEdit}
                    refresh={refreshList}
                />
            </div>
        </div>
    );
};

export default CadastroTitulo;