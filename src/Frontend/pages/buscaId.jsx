import Cards from '../components/buscaId/Card';
import { useEffect, useState } from 'react';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import stylePredio from '../styles/Predios.module.css';
import axios from 'axios';

function BuscaId({ data }) {
  const [text, setText] = useState('');
  const [datas, setData] = useState([]);

  async function chamadaDB() {
    setData(data);
  }

  useEffect(() => {
    chamadaDB();
  }, []);

  const handleOnChange = event => {
    let inputValue = event.target.value;

    if (inputValue) {
      if (text > inputValue.length) {
        setData(data);
        setData(data.filter(e => String(e.patrimonioId).includes(inputValue)));
        setText(text - 1);
      } else {
        setText(text + 1);
        setData(datas.filter(e => String(e.patrimonioId).includes(inputValue)));
      }

      setText(inputValue.length);
    } else {
      setText(0);
      chamadaDB();
    }
  };

  return (
    <div className="flex flex-col items-center pb-24">

      <h1 className="Montserrat font-bold text-2xl md:ml-32">
        Buscar por equipamento
      </h1>


      <div className="relative">
        <FontAwesomeIcon
          className="absolute pt-7 h-7 pl-5"
          icon={faMagnifyingGlass}
        ></FontAwesomeIcon>
        <input
          type="text"
          onChange={handleOnChange}
          className={stylePredio.input}
          placeholder="Digite o ID!"
        />
      </div>

      <Cards mock={datas} />
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  let cookieToken = ctx.req.cookies['token'];

  await axios.get(`${process.env.NEXT_PUBLIC_URL_SANDBOX}/User/Infos`, {
    headers: { Authorization: `Bearer ${cookieToken}` }
  }).then(response => { }).catch(error => {
    ctx.res.writeHead(302, {
      Location: '/'
    });
    ctx.res.end();
  });

  let data;
  await axios.get(`${process.env.NEXT_PUBLIC_URL_SANDBOX}/Device/equipamentosRegistrados`).then(response => {
    data = response.data;
  });

  return { props: { data } };
}

export default BuscaId;
