// frontend/data/questionsData.js

// Utility to generate dummy questions
const generateQuestions = (subject, count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${subject.charAt(0).toLowerCase()}${i + 1}`, // e.g., m1, m2, ...
      question: `Question ${i + 1} for ${subject}: What is a sample question?`,
      options: ["Option 1", "Option 2", "Option 3"],
      subject,
    }));
  };
  
  const questionsData = {
    Maths: generateQuestions("Maths", 30),
    Physics: generateQuestions("Physics", 30),
    Chemistry: generateQuestions("Chemistry", 30),
  };
  
  export default questionsData;
  