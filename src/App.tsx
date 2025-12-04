import { useState } from 'react';
import Boot from './Boot';
import './App.css';

const App = () => {
  const [booted, setBooted] = useState<boolean>(false);

  return (
    booted
    ? <div className='c-app'></div>
    : <Boot 
        setBooted={setBooted} />
  );
};

export default App;
