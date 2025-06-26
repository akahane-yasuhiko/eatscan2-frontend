import { useState } from 'react';
import GoogleLoginButton from "./components/GoogleLoginButton";
import { analyzeWithGemini } from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [nutrients, setNutrients] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (idToken) => {
    try {
      const response = await fetch("https://us-central1-eatscan-459714.cloudfunctions.net/verify_token", {
        method: "POST",
        mode: "cors",
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      sessionStorage.setItem("idToken", idToken);
      const data = await response.json();
      setUser(data);  // { userId, email }
      setError("");
    } catch (err) {
      console.error(err);
      setError("認証エラー: " + err.message);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setNutrients('');

    try {
      const idToken = sessionStorage.getItem("idToken");
      const geminiResult = await analyzeWithGemini(file, idToken);

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

      {!user ? (
        <>
          <p>Google アカウントでログインしてください。</p>
          <GoogleLoginButton onLogin={handleLogin} />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <>
          <p>こんにちは、{user.email} さん！</p>
          <p>ユーザーID: {user.userId}</p>
        </>
      )}

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
