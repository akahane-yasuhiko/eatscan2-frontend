import React, { useState } from 'react';
import { analyzeWithVision, analyzeWithGemini } from './utils/api';

function App() {
  const [ocrText, setOcrText] = useState('');
  const [nutrients, setNutrients] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setOcrText('');
    setNutrients('');

    try {
      // const visionResult = await analyzeWithVision(file);
      // const text = visionResult.text || visionResult.ocrText || ''; // 応答の形式に応じて調整
      // setOcrText(text);

      const geminiResult = await analyzeWithGemini(file);
      // setNutrients(geminiResult.nutrients || geminiResult); // 形式に応じて柔軟に
      console.log(typeof(geminiResult));
      console.log(geminiResult);
      console.log('');
      console.log(geminiResult.extracted_components);
      console.log(typeof(geminiResult.extracted_components));
      setNutrients(geminiResult.extracted_components)
      console.log('');
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
      {ocrText && (
        <>
          <h3>OCR結果</h3>
          <pre>{ocrText}</pre>
        </>
      )}
      {nutrients && (
        <>
          <h3>Gemini解析結果</h3>
          <pre>{nutrients}</pre>
        </>
      )
      }
      {/* {nutrients && (
        <>
          <h3>栄養成分（Gemini構造化結果）</h3>
          <table>
            <tbody>
              {Object.entries(nutrients).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )} */}
    </div>
  );
}

export default App;



// import { useState } from 'react';
// import ImageUploader from './components/ImageUploader';
// import { extractTextFromImage } from './utils/visionApi';
// import { parseNutritionText } from './utils/parseNutrition';
// import { saveToHistory, getHistory, clearHistory } from './utils/storage';
// import { aggregateByDate } from './utils/aggregate';
// import { readBarcodeFromImage } from './utils/barcodeFromImage';
// import { normalizeNutritionText } from './utils/normalizeText';
// import ImageCropper from './components/ImageCropper';

// function App() {
//   const [rawText, setRawText] = useState('');
//   const [ocrText, setOcrText] = useState('');
//   const [parsed, setParsed] = useState({});
//   const [history, setHistory] = useState(getHistory());
//   const aggregated = aggregateByDate(history);
//   const [barcode, setBarcode] = useState('');
//   const [uploadedBase64, setUploadedBase64] = useState(null);

//   const handleImageSelected = async (base64Image) => {
//     setRawText('読み取り中...');
//     setOcrText('読み取り中...');
//     const rawText = await extractTextFromImage(base64Image);
//     setRawText(rawText);

//     // 解析結果を整形
//     const normalizedText = normalizeNutritionText(rawText);
//     setOcrText(normalizedText);

//     // 画像から成分表を読む
//     const parsedResult = parseNutritionText(normalizedText);
//     setParsed(parsedResult);

//     // 画像からバーコードを読む
//     const scannedCode = await readBarcodeFromImage(base64Image);
//     if (scannedCode) {
//       setBarcode(scannedCode);
//     }
//   };

//   const handleSave = () => {
//     const timestamp = new Date().toISOString();
//     saveToHistory({ timestamp, parsed, barcode });
//     setHistory(getHistory());
//     setBarcode(''); // 入力欄リセット
//   };


//   const handleClear = () => {
//     clearHistory();
//     setHistory([]);
//   };

//   return (
//     <div style={{ padding: '1em', fontFamily: 'sans-serif' }}>
//       <h1>eatscan2</h1>
//       <p>食品ラベルを撮影して成分を読み取ります。</p>

//       {/* <ImageUploader onImageSelected={handleImageSelected} /> */}
//       <ImageUploader
//         onImageSelected={(base64Image) => {
//           setUploadedBase64(base64Image);
//           // OCR はここでは実行しない → 切り抜き後に実行する
//         }}
//       />

//       {uploadedBase64 && (
//         <ImageCropper
//           imageSrc={uploadedBase64}
//           onCrop={async (croppedBase64) => {
//             const text = await extractTextFromImage(croppedBase64);
//             const normalized = normalizeNutritionText(text);
//             setOcrText(normalized);
//             setParsed(parseNutritionText(normalized));
//           }}
//         />
//       )}



//       <h2>OCR結果</h2>
//       <pre style={{ whiteSpace: 'pre-wrap' }}>{rawText}</pre>
      
//       <pre style={{ whiteSpace: 'pre-wrap' }}>{ocrText}</pre>

//       {Object.keys(parsed).length > 0 && (
//         <div>
//           <h2>栄養成分の抽出結果</h2>
//           <ul>
//             {Object.entries(parsed).map(([key, val]) => (
//               <li key={key}>{key}: {val}</li>
//             ))}
//           </ul>

//           <div>
//             <label>バーコード（任意）：</label>
//             <input
//               type="text"
//               value={barcode}
//               onChange={(e) => setBarcode(e.target.value)}
//               placeholder="例: 4901234567890"
//             />
//           </div>

//           <button onClick={handleSave}>この結果を保存</button>
//         </div>
//       )}

//       {history.length > 0 && (
//         <div style={{ marginTop: '2em' }}>
//           <h2>履歴</h2>
//           <ul>
//             {history.map((entry, index) => (
//               <li key={index}>
//                 <strong>{new Date(entry.timestamp).toLocaleString()}:</strong>
//                 {entry.barcode && <div>バーコード: {entry.barcode}</div>}
//                 <ul>
//                   {Object.entries(entry.parsed).map(([key, val]) => (
//                     <li key={key}>{key}: {val}</li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//           <button onClick={handleClear}>履歴をすべて削除</button>
//         </div>
//       )}

//       {Object.keys(aggregated).length > 0 && (
//         <div style={{ marginTop: '2em' }}>
//           <h2>日別の栄養素合計</h2>
//           <ul>
//             {Object.entries(aggregated).map(([date, nutrients]) => (
//               <li key={date}>
//                 <strong>{date}:</strong>
//                 <ul>
//                   {Object.entries(nutrients).map(([key, val]) => (
//                     <li key={key}>{key}: {val.toFixed(1)}</li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}



//     </div>
//   );
// }

// export default App;
