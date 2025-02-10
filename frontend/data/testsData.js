const testsData = Array.from({ length: 100 }, (_, i) => ({
  id: `test${i + 1}`,
  title: `Test ${i + 1}`,
  subject: [
    "Maths", "Physics", "Chemistry", "Biology", "History", "Geography",
    "English", "Computer Science", "Economics", "Psychology"
  ][i % 10],
  description: `Challenge your knowledge in ${[
    "Maths", "Physics", "Chemistry", "Biology", "History", "Geography",
    "English", "Computer Science", "Economics", "Psychology"
  ][i % 10]} with this test.`
}));

export default testsData;
