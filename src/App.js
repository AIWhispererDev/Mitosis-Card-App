import React, { useState } from 'react';
import './App.css';
import CardForm from './components/CardForm';
import CardPreview from './components/CardPreview';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

function App() {
  const [cardData, setCardData] = useState(null);

  const handleFormSubmit = (data) => {
    setCardData(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mitosis Card Creator</h1>
        <p>Create your personalized Mitosis community card</p>
      </header>
      <main>
        <CardForm onFormSubmit={handleFormSubmit} />
        {cardData && <CardPreview cardData={cardData} />}
      </main>
      <footer>
        <p>© {new Date().getFullYear()} MitosisOrg Community</p>
      </footer>
    </div>
  );
}

export default App;
