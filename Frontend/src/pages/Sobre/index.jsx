import React from 'react';
import './sobre.css';

const equipe = [
  {
    nome: 'Carlos',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/carlosdqlima',
    linkedin: 'https://www.linkedin.com/in/carlos-daniel-de-queiroz-lima/',
    imagem: 'src/assets/imagens/meninos/carlos.JPG', 
  },
  {
    nome: 'Gustavo',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    imagem: 'src/assets/imagens/meninos/gustavo.JPG', 
  },
  {
    nome: 'José Carlos',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/CarlosVigna',
    linkedin: 'https://www.linkedin.com/in/carlos-garcia-jose/',
    imagem: 'src/assets/imagens/meninos/josecarlos.JPG', 
  },
  {
    nome: 'Victor',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com',
    linkedin: 'https://www.linkedin.com/in/victor-hugo-bernardino-ramos/',
    imagem: 'src/assets/imagens/meninos/victor.JPG', 
  },
  {
    nome: 'Welinton',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/Welinton-Rodrigues',
    linkedin: 'https://www.linkedin.com/in/welinton-rodrigues-38324a1b9/',
    imagem: 'src/assets/imagens/meninos/wel.JPG', 
  },
  {
    nome: 'GPT',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com',
    linkedin: 'https://www.linkedin.com/company/openai/',
    imagem: 'src/assets/imagens/meninos/gpt.JPG', 
  },
];

const Sobre = () => {
  return (
    <div className="sobre-container" style={{ marginTop: '40px' }}>

      <section className="sobre-introducao" style={{ marginBottom: '40px' }}>
        <h2>Sobre o Projeto</h2><br></br>
        <p>
          O FinHawk nasceu com a missão de unir aprendizado e inovação,
          aproveitando as ferramentas que exploramos na FATEC. Escolhemos o tema
          de controle financeiro porque acreditamos que ele é essencial para
          todos: quem nunca quis organizar suas finanças de forma simples,
          rápida e eficiente?
        </p>
        <p>
          Assim, o FinHawk não é apenas um exercício acadêmico; é um passo rumo
          a um futuro mais organizado e seguro financeiramente. 🦅💰
        </p>
      </section>

      <section className="sobre-tecnologias" style={{ marginBottom: '40px' }}>
        <h2>Tecnologias Utilizadas</h2><br></br>
        <ul>
          <li>Java - Para o back-end, utilizando o framework Spring Boot.</li>
          <li>React - Para a criação do front-end.</li>
          <li>SQL Server - Banco de dados utilizado para gerenciar informações.</li>
          <li>CSS - Para o design e a personalização da interface.</li>
        </ul>
      </section>

      <section className="sobre-contatos">
        <h2>Equipe</h2><br></br>
        <div className="equipe-container">
          {equipe.map((membro, index) => (
            <div key={index} className="equipe-membro">
              <img src={membro.imagem} alt={`Foto de ${membro.nome}`} />
              <div className="membro-info">
                <p>
                  <strong>{membro.nome}</strong> - {membro.descricao}
                </p>
                <ul>
                  <li>
                    <a
                      href={membro.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href={membro.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sobre;
