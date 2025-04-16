import { useState, useEffect } from 'react';
import { 
  vermanEncrypt, 
  vermanDecrypt, 
  generatePlayfairMatrix, 
  playfairEncrypt, 
  playfairDecrypt 
} from '../utils/cipherLogic';
import { Moon, Sun, Lock, Key, FileText, RefreshCcw } from 'lucide-react';

export default function CipherApp() {
  const [activeTab, setActiveTab] = useState('verman');
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [playfairKey, setPlayfairKey] = useState('');
  const [playfairMatrix, setPlayfairMatrix] = useState([]);
  const [playfairMode, setPlayfairMode] = useState('encrypt');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleVermanEncrypt = () => {
    const result = vermanEncrypt(plaintext, key);
    if (result.success) {
      setCiphertext(result.ciphertext);
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handleVermanDecrypt = () => {
    const result = vermanDecrypt(ciphertext, key);
    if (result.success) {
      setDecryptedText(result.decryptedText);
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handleGeneratePlayfairMatrix = (key) => {
    const result = generatePlayfairMatrix(key);
    if (result.success) {
      setPlayfairMatrix(result.matrix);
      setError('');
      return result.matrix;
    } else {
      setError(result.error);
      return null;
    }
  };

  const handlePlayfairEncrypt = () => {
    const matrix = playfairMatrix.length ? playfairMatrix : handleGeneratePlayfairMatrix(playfairKey);
    if (!matrix) return;
    
    const result = playfairEncrypt(plaintext, matrix);
    if (result.success) {
      setCiphertext(result.ciphertext);
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handlePlayfairDecrypt = () => {
    const matrix = playfairMatrix.length ? playfairMatrix : handleGeneratePlayfairMatrix(playfairKey);
    if (!matrix) return;
    
    const result = playfairDecrypt(ciphertext, matrix);
    if (result.success) {
      setDecryptedText(result.decryptedText);
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handlePlayfairAction = () => {
    if (playfairMode === 'encrypt') {
      handlePlayfairEncrypt();
    } else {
      handlePlayfairDecrypt();
    }
  };

  const baseClasses = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300';
  const matrixCellBg = darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300';
  const primaryBtnBg = darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600';
  const secondaryBtnBg = darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600';
  const tabBg = darkMode ? 'bg-gray-700' : 'bg-gray-200';
  const tabActiveBg = darkMode ? 'bg-indigo-600' : 'bg-indigo-500';
  const resultBg = darkMode ? 'bg-gray-700' : 'bg-gray-100';

  const renderPlayfairMatrix = () => {
    if (playfairMatrix.length === 0) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium flex items-center">
          <Key size={18} className="mr-2" />
          Generated Playfair Matrix
        </h3>
        <div className={`mt-2 p-2 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {playfairMatrix.map((row, i) => (
            <div key={i} className="flex">
              {row.map((cell, j) => (
                <div key={j} className={`w-8 h-8 flex items-center justify-center border ${matrixCellBg}`}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${baseClasses}`}>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center flex items-center">
            <Lock size={32} className={`mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            Substitution Ciphers
          </h1>
          
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <div className={`rounded-lg shadow-lg p-6 mb-8 ${cardBg}`}>
          <div className="mb-6">
            <div className="flex rounded-lg overflow-hidden">
              <button 
                className={`px-6 py-3 flex-1 font-medium ${activeTab === 'verman' ? `${tabActiveBg} text-white` : `${tabBg} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}`}
                onClick={() => setActiveTab('verman')}
              >
                Verman Cipher (One-Time Pad)
              </button>
              <button 
                className={`px-6 py-3 flex-1 font-medium ${activeTab === 'playfair' ? `${tabActiveBg} text-white` : `${tabBg} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}`}
                onClick={() => setActiveTab('playfair')}
              >
                Playfair Cipher
              </button>
            </div>
          </div>

          {error && (
            <div className={`mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 ${darkMode ? 'bg-opacity-20 border-opacity-30' : ''}`}>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                {error}
              </div>
            </div>
          )}

          {activeTab === 'verman' && (
            <div>
              <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-100'}`}>
                <h2 className={`text-xl font-semibold mb-2 flex items-center ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  <FileText size={20} className="mr-2" />
                  About Verman Cipher (One-Time Pad)
                </h2>
                <p className="mb-2">
                  The Verman cipher, also known as Vernam cipher or One-Time Pad, is a type of encryption
                  technique that uses a random key that is at least as long as the plaintext message.
                  It achieves perfect secrecy when implemented correctly with truly random keys used only once.
                </p>
                <p>
                  This implementation uses XOR operations between the plaintext and key characters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-5 rounded-lg shadow-md ${cardBg}`}>
                  <h3 className={`text-lg font-medium mb-4 flex items-center ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    <Lock size={18} className="mr-2" />
                    Encryption
                  </h3>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">Message:</label>
                    <textarea 
                      className={`w-full p-3 rounded-md border ${inputBg}`}
                      rows="4"
                      value={plaintext}
                      onChange={(e) => setPlaintext(e.target.value)}
                      placeholder="Enter message to encrypt"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-medium">Key (must be at least as long as the message):</label>
                    <textarea 
                      className={`w-full p-3 rounded-md border ${inputBg}`}
                      rows="4"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter key"
                    />
                  </div>
                  <button 
                    className={`px-5 py-2 ${primaryBtnBg} text-white rounded-md font-medium flex items-center shadow-md transition-colors duration-200`}
                    onClick={handleVermanEncrypt}
                  >
                    <Lock size={16} className="mr-2" />
                    Encrypt
                  </button>
                </div>

                <div className={`p-5 rounded-lg shadow-md ${cardBg}`}>
                  <h3 className={`text-lg font-medium mb-4 flex items-center ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                    <RefreshCcw size={18} className="mr-2" />
                    Decryption
                  </h3>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">Ciphertext (base64):</label>
                    <textarea 
                      className={`w-full p-3 rounded-md border ${inputBg}`}
                      rows="4"
                      value={ciphertext}
                      onChange={(e) => setCiphertext(e.target.value)}
                      placeholder="Enter ciphertext to decrypt"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-medium">Key:</label>
                    <textarea 
                      className={`w-full p-3 rounded-md border ${inputBg}`}
                      rows="4"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter the same key used for encryption"
                    />
                  </div>
                  <button 
                    className={`px-5 py-2 ${secondaryBtnBg} text-white rounded-md font-medium flex items-center shadow-md transition-colors duration-200`}
                    onClick={handleVermanDecrypt}
                  >
                    <RefreshCcw size={16} className="mr-2" />
                    Decrypt
                  </button>
                  
                  {decryptedText && (
                    <div className="mt-5">
                      <h4 className="font-medium mb-2">Decrypted Result:</h4>
                      <div className={`p-3 ${resultBg} rounded-md mt-1 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {decryptedText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playfair' && (
            <div>
              <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-purple-50 border border-purple-100'}`}>
                <h2 className={`text-xl font-semibold mb-2 flex items-center ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  <FileText size={20} className="mr-2" />
                  About Playfair Cipher
                </h2>
                <p className="mb-2">
                  The Playfair cipher is a manual symmetric encryption technique that encrypts pairs of letters.
                  It uses a 5×5 matrix of letters constructed using a keyword, with the remaining cells filled 
                  with the rest of the alphabet (typically I and J are combined).
                </p>
                <p className="mb-1">The encryption rules are:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>If both letters are in the same row, take the letter to the right of each (wrapping around).</li>
                  <li>If both letters are in the same column, take the letter below each (wrapping around).</li>
                  <li>If neither, form a rectangle and take the letters at the other corners.</li>
                </ol>
              </div>

              <div className={`p-5 rounded-lg shadow-md mb-6 ${cardBg}`}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Playfair Key:</label>
                  <input 
                    type="text"
                    className={`w-full p-3 rounded-md border ${inputBg}`}
                    value={playfairKey}
                    onChange={(e) => {
                      setPlayfairKey(e.target.value);
                      if (e.target.value) handleGeneratePlayfairMatrix(e.target.value);
                    }}
                    placeholder="Enter key for Playfair matrix"
                  />
                </div>

                {renderPlayfairMatrix()}

                <div className="mt-6 mb-4">
                  <div className="flex gap-3 mb-4">
                    <button 
                      className={`px-4 py-2 rounded-md flex-1 font-medium transition-colors duration-200 ${playfairMode === 'encrypt' ? `${tabActiveBg} text-white` : `${tabBg} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}`}
                      onClick={() => setPlayfairMode('encrypt')}
                    >
                      Encrypt Mode
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-md flex-1 font-medium transition-colors duration-200 ${playfairMode === 'decrypt' ? `${tabActiveBg} text-white` : `${tabBg} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}`}
                      onClick={() => setPlayfairMode('decrypt')}
                    >
                      Decrypt Mode
                    </button>
                  </div>
                </div>

                {playfairMode === 'encrypt' ? (
                  <div className="mb-5">
                    <label className="block mb-2 font-medium">Plaintext:</label>
                    <textarea 
                      className={`w-full p-3 rounded-md border ${inputBg}`}
                      rows="4"
                      value={plaintext}
                      onChange={(e) => setPlaintext(e.target.value)}
                      placeholder="Enter message to encrypt"
                    />
                  </div>
                ) : (
                  <div className="mb-5">
                    <label className="block mb-2 font-medium">Ciphertext:</label>
                    <textarea 
                      className={`w-full p-3 rounded-md border ${inputBg}`}
                      rows="4"
                      value={ciphertext}
                      onChange={(e) => setCiphertext(e.target.value)}
                      placeholder="Enter ciphertext to decrypt"
                    />
                  </div>
                )}

                <button 
                  className={`px-5 py-2 ${playfairMode === 'encrypt' ? primaryBtnBg : secondaryBtnBg} text-white rounded-md font-medium flex items-center shadow-md transition-colors duration-200`}
                  onClick={handlePlayfairAction}
                >
                  {playfairMode === 'encrypt' ? (
                    <>
                      <Lock size={16} className="mr-2" />
                      Encrypt
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={16} className="mr-2" />
                      Decrypt
                    </>
                  )}
                </button>

                {playfairMode === 'encrypt' && ciphertext && (
                  <div className="mt-5">
                    <h4 className="font-medium mb-2">Encrypted Result:</h4>
                    <div className={`p-3 ${resultBg} rounded-md mt-1 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      {ciphertext}
                    </div>
                  </div>
                )}

                {playfairMode === 'decrypt' && decryptedText && (
                  <div className="mt-5">
                    <h4 className="font-medium mb-2">Decrypted Result:</h4>
                    <div className={`p-3 ${resultBg} rounded-md mt-1 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      {decryptedText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}