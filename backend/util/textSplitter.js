// Utility function to split text according to field limits
function splitTextByCharacterLimits(text, fields) {
    // Ensure `text` is a string, defaulting to an empty string if it's null or undefined
    const safeText = text || ''; 
    const words = safeText.split(' '); // Now `safeText` is guaranteed to be a string
    const fieldTexts = [];
    let currentText = '';
  
    fields.forEach((field) => {
      const maxChars = field.maxChars;
      let fieldText = '';
  
      while (words.length > 0) {
        const word = words[0];
        const testText = fieldText ? `${fieldText} ${word}` : word;
  
        if (testText.length <= maxChars) {
          fieldText = testText;
          words.shift(); // Remove the word from the array
        } else {
          break; // Stop if adding the next word exceeds the character limit
        }
      }
  
      fieldTexts.push(fieldText.trim());
    });
  
    return fieldTexts;
  }
  
  module.exports = splitTextByCharacterLimits;
  