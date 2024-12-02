import React from 'react';
import './sobre.css';

const equipe = [
  {
    nome: 'Carlos',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario',
    imagem: '/imagens/meninas/carlos.JPG', 
  },
  {
    nome: 'Gustavo',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario',
    imagem: '/imagens/meninas/gustavo.JPG', 
  },
  {
    nome: 'José Carlos',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario',
    imagem: '/imagens/meninas/josecarlos.JPG', 
  },
  {
    nome: 'Victor',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario',
    imagem: '/imagens/meninas/victor.JPG', 
  },
  {
    nome: 'Welinton',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario',
    imagem: '/imagens/meninas/wel.JPG', 
  },
  {
    nome: 'GPT',
    descricao: 'Desenvolvimento Geral',
    github: 'https://github.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario',
    imagem: '/imagens/meninas/gpt.JPG', 
  },
];

const Sobre = () => {
  return (
    <div className="sobre-container">

      <section className="sobre-introducao">
        <h2>Sobre o Projeto</h2>
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

      <section className="sobre-tecnologias">
        <h2>Tecnologias Utilizadas</h2>
        <ul>
          <li>Java - Para o back-end, utilizando o framework Spring Boot.</li>
          <li>React - Para a criação do front-end.</li>
          <li>PostgreSQL - Banco de dados utilizado para gerenciar informações.</li>
          <li>CSS - Para o design e a personalização da interface.</li>
        </ul>
      </section>

      <section className="sobre-contatos">
        <h2>Equipe</h2>
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
