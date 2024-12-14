import './bodyHome.css';  
import CardHome from '../CardHome'; 

const BodyHome = () => {
  const cardsData = [
    {
      img: 'src/assets/imagens/imagens-body/visao-compartilhada.png',
      title: 'Clareza',
      paragrafo: 'Organize suas finanças, entenda seus gastos e crie processos que funcionam para você.',
    },
    {
      img: 'src/assets/imagens/imagens-body/lucro.png',
      title: 'Rentabilidade',
      paragrafo: 'Reduza despesas, entenda seus custos e defina seus objetivos financeiros de forma inteligente.',
    },
    {
      img: 'src/assets/imagens/imagens-body/expansao.png',
      title: 'Expansão',
      paragrafo: 'Gerencie suas dívidas ou planeje a captação de recursos para realizar seus sonhos.',
    },
    {
      img: 'src/assets/imagens/imagens-body/retorno-de-investimento.png',
      title: 'Retorno',
      paragrafo: 'Garanta que suas escolhas financeiras tragam o retorno que você deseja para sua vida.',
    },
    {
      img: 'src/assets/imagens/imagens-body/marketing-direcionado.png',
      title: 'Direcionamento',
      paragrafo: 'Defina o melhor caminho com um planejamento financeiro estratégico.',
    },
    {
      img: 'src/assets/imagens/imagens-body/estabilidade.png',
      title: 'Estabilidade',
      paragrafo: 'Fortaleça seu caixa pessoal e crie segurança financeira a longo prazo.',
    },
  ];

  return (
    <div className="card-container">
      <div className="card-wrapper">
        {cardsData.map((card, index) => (
          <CardHome
            key={index}
            img={card.img}
            title={card.title}
            paragrafo={card.paragrafo}
          />
        ))}
      </div>
    </div>
  );
};

export default BodyHome;
