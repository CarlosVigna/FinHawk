import './campoTexto.css';

const CampoTexto = (props) => {
    return (
        <div className="campo-texto form-control no-inner-shadow">
            {props.texto && <h1>{props.texto}</h1>}
            <label htmlFor={props.name}>{props.label}</label>
            <input 
                id={props.name}
                type={props.type || "text"} 
                value={props.valor || ''} 
                placeholder={props.placeholder}
                onChange={props.onChange} 
                name={props.name}
                autoComplete={props.autoComplete || "off"} 
            />
        </div>
    );
};

export default CampoTexto;