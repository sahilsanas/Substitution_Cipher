export const vermanEncrypt = (plaintext, key) => {
    if (!plaintext) return { success: false, error: 'Please enter a message to encrypt' };
    if (!key) return { success: false, error: 'Please enter a key' };
    if (key.length < plaintext.length) return { success: false, error: 'Key must be at least as long as the message' };
  
    let result = '';
    for (let i = 0; i < plaintext.length; i++) {
      const charCode = plaintext.charCodeAt(i) ^ key.charCodeAt(i);
      result += String.fromCharCode(charCode);
    }
    return { success: true, ciphertext: btoa(result) }; 
  };
  
  export const vermanDecrypt = (ciphertext, key) => {
    if (!ciphertext) return { success: false, error: 'Please enter ciphertext to decrypt' };
    if (!key) return { success: false, error: 'Please enter the key' };
  
    try {
      const decoded = atob(ciphertext); 
      if (key.length < decoded.length) return { success: false, error: 'Key must be at least as long as the decoded message' };
  
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i);
        result += String.fromCharCode(charCode);
      }
      return { success: true, decryptedText: result };
    } catch (e) {
      return { success: false, error: 'Invalid base64 encoded ciphertext' };
    }
  };
  
  export const generatePlayfairMatrix = (key) => {
    if (!key) {
      return { success: false, error: 'Please enter a key for the Playfair matrix' };
    }
  
    let processedKey = key.toUpperCase().replace(/J/g, 'I');
    let matrixChars = '';
    
    for (let char of processedKey) {
      if (/[A-Z]/.test(char) && !matrixChars.includes(char)) {
        matrixChars += char;
      }
    }
    
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i);
      if (char !== 'J' && !matrixChars.includes(char)) {
        matrixChars += char;
      }
    }

    const matrix = [];
    for (let i = 0; i < 5; i++) {
      matrix.push(matrixChars.substr(i * 5, 5).split(''));
    }
    
    return { success: true, matrix };
  };
  
  export const findPositionInMatrix = (char, matrix) => {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (matrix[row][col] === char) {
          return { row, col };
        }
      }
    }
    return null;
  };
  
  export const playfairEncrypt = (plaintext, matrix) => {
    if (!plaintext) return { success: false, error: 'Please enter a message to encrypt' };
    if (!matrix || matrix.length === 0) return { success: false, error: 'Matrix not generated' };
  
    let prepared = plaintext.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let pairs = [];
    for (let i = 0; i < prepared.length; i += 2) {
      if (i + 1 >= prepared.length) {
        pairs.push(prepared[i] + 'X');
      } else if (prepared[i] === prepared[i + 1]) {
        pairs.push(prepared[i] + 'X');
        i--; 
      } else {
        pairs.push(prepared[i] + prepared[i + 1]);
      }
    }
  
    let result = '';
    for (let pair of pairs) {
      const pos1 = findPositionInMatrix(pair[0], matrix);
      const pos2 = findPositionInMatrix(pair[1], matrix);
  
      let char1, char2;
  
      if (pos1.row === pos2.row) {
        char1 = matrix[pos1.row][(pos1.col + 1) % 5];
        char2 = matrix[pos2.row][(pos2.col + 1) % 5];
      } else if (pos1.col === pos2.col) {
        char1 = matrix[(pos1.row + 1) % 5][pos1.col];
        char2 = matrix[(pos2.row + 1) % 5][pos2.col];
      } else {
        char1 = matrix[pos1.row][pos2.col];
        char2 = matrix[pos2.row][pos1.col];
      }
  
      result += char1 + char2;
    }
  
    return { success: true, ciphertext: result };
  };
  
  export const playfairDecrypt = (ciphertext, matrix) => {
    if (!ciphertext) return { success: false, error: 'Please enter ciphertext to decrypt' };
    if (!matrix || matrix.length === 0) return { success: false, error: 'Matrix not generated' };
  
    let prepared = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (prepared.length % 2 !== 0) {
      return { success: false, error: 'Ciphertext must have an even number of characters' };
    }
  
    let pairs = [];
    for (let i = 0; i < prepared.length; i += 2) {
      pairs.push(prepared.substr(i, 2));
    }

    let result = '';
    for (let pair of pairs) {
      const pos1 = findPositionInMatrix(pair[0], matrix);
      const pos2 = findPositionInMatrix(pair[1], matrix);
  
      let char1, char2;
  
      if (pos1.row === pos2.row) {
        char1 = matrix[pos1.row][(pos1.col + 4) % 5]; 
        char2 = matrix[pos2.row][(pos2.col + 4) % 5];
      } else if (pos1.col === pos2.col) {
        char1 = matrix[(pos1.row + 4) % 5][pos1.col];
        char2 = matrix[(pos2.row + 4) % 5][pos2.col];
      } else {
        char1 = matrix[pos1.row][pos2.col];
        char2 = matrix[pos2.row][pos1.col];
      }
  
      result += char1 + char2;
    }
  
    return { success: true, decryptedText: result };
  };