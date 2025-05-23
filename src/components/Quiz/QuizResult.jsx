import { useEffect } from "react";
import jsPDF from "jspdf";
import { useTheme } from "../../context/ThemeContext";

const QuizResult = ({ quizEnded, score, questions, selectedAnswers }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (quizEnded && score / questions.length >= 0.4) {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background Color
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(4);
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor(30, 144, 255);
      doc.text("Certificate of Achievement", pageWidth / 2, 120, {
        align: "center",
      });

      // Subtitle
      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.text("This certificate is proudly presented to", pageWidth / 2, 170, {
        align: "center",
      });

      const userName = "Participant"; // replace with a prop if you have the name

      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(28);
      doc.setTextColor(0, 102, 204);
      doc.text(userName, pageWidth / 2, 220, { align: "center" });

      // Text about passing
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text(
        `For successfully passing the quiz with a score of ${score} out of ${questions.length}.`,
        pageWidth / 2,
        270,
        { align: "center", maxWidth: pageWidth - 100 }
      );

     

      // Signature Line
      doc.line(
        pageWidth - 220,
        pageHeight - 100,
        pageWidth - 20,
        pageHeight - 100,
      );
      doc.text("Authorized Signature", pageWidth - 120, pageHeight - 70, {
        align: "center",
      });

       // Date
      const date = new Date().toLocaleDateString();
      doc.setFontSize(14);
      doc.text(`Date: ${date}`, pageWidth - 120, pageHeight - 50, {
        align: "center",
      });
      // // Date
      // const today = new Date().toLocaleDateString();
      // doc.setFontSize(16);
      // doc.text(`Date: ${today}`, pageWidth / 2, pageHeight - 100, { align: "center" });

      // // Signature line
      // doc.setLineWidth(1);
      // const sigStartX = pageWidth / 2 - 100;
      // const sigEndX = pageWidth / 2 + 100;
      // const sigY = pageHeight - 130;
      // doc.line(sigStartX, sigY, sigEndX, sigY);
      // doc.setFontSize(14);
      // doc.text("Authorized Signature", pageWidth / 2, sigY + 20, { align: "center" });

      // Save/download PDF
      doc.save("Quiz_Certificate.pdf");
    }
  }, [quizEnded, score, questions]);
  return (
    <div className={`result-list ${theme}`}>
      {quizEnded && (
        <>
          <h2>
            Your Score: {score} / {questions.length}
          </h2>
          {score / questions.length >= 0.4 ? (
            <p>🎉 Congratulations! You passed the quiz!</p>
          ) : (
            <p>😢 Better luck next time!</p>
          )}
          <h3>Quiz Results</h3>
          {questions.map((q, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            const isNotAttempted = userAnswer === undefined;

            return (
              <div className={`question-item ${theme}`} key={idx}>
                <p>
                  <strong>Q{idx + 1}:</strong> {q.question}
                </p>
                <p>
                  <strong>Correct Answer: </strong>
                  <span className="correct">{q.correctAnswer}</span>
                </p>
                {isNotAttempted ? (
                  <p className="not-attempted">Your Answer: Not Attempted</p>
                ) : isCorrect ? (
                  <p>
                    <strong>Your Answer:</strong>
                    <span className="correct"> {userAnswer}</span>
                  </p>
                ) : (
                  <p>
                    <strong>Your Answer: </strong>
                    <span className="wrong">{userAnswer}</span>
                  </p>
                )}
                <p>
                  <strong>Explanation: </strong>
                  <span>{q.explanation}</span>
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default QuizResult;
