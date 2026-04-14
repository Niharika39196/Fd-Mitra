import React, { useState } from 'react';
import LanguagePicker from './components/LanguagePicker';
import ChatUI from './components/ChatUI';
import { LANGUAGES } from './config/languages';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  if (!selectedLanguage) {
    return (
      <LanguagePicker 
        languages={LANGUAGES} 
        onSelectLanguage={setSelectedLanguage} 
      />
    );
  }

  return (
    <ChatUI 
      language={selectedLanguage} 
      languageConfig={LANGUAGES[selectedLanguage]}
      onResetLanguage={() => setSelectedLanguage(null)} 
    />
  );
}

export default App;
