import React from 'react';
import Header from '@/components/Header';
import style from './App.css';

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <h1 id="title">Zero!Zero!</h1>
      <h2 className={style.subtitle}>This is a subtitle</h2>
    </div>
  );
};

export default App;
