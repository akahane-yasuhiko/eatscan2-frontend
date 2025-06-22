import { useState } from 'react';
import { analyzeWithGemini } from './utils/api';

function App() {
  const [nutrients, setNutrients] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setNutrients('');

    try {
      const geminiResult = await analyzeWithGemini(file);

      console.log(geminiResult.raw_gemini_output);
      setNutrients(geminiResult.raw_gemini_output)
      console.log('');

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>EatScan 2</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {loading && <p>読み取り中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {nutrients && (
        <>
          <h3>成分表読み取り解析結果</h3>
          <pre>{nutrients}</pre>
        </>
      )
      }
    </div>
  );
}

export default App;
