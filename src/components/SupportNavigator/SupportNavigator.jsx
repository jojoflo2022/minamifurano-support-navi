import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { questions } from "../../data/questions";
import { calculateSupportPrograms } from "../../utils/supportCalculator";
import LifeTimelineResults from "./LifeTimelineResults";

const SupportNavigator = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // 最後の質問が終わったら結果を計算
      const supportResults = calculateSupportPrograms({
        ...answers,
        [questionId]: answerId,
      });
      setResults(supportResults);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  // 結果表示中の場合
  if (results) {
    return <LifeTimelineResults results={results} onReset={handleReset} />;
  }

  const currentQuestion = questions[step];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 text-center">
        <h2 className="text-2xl font-bold">南富良野町 支援制度ナビ</h2>
        <p className="text-gray-600">あなたに合った支援制度をご案内します</p>
      </div>
      <div className="p-6 pt-0">
        <div className="mb-6">
          <div className="flex justify-between mb-6">
            {questions.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= step ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                {index < questions.length - 1 && (
                  <div
                    className={`h-1 w-16 ${
                      index < step ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-6">
            {currentQuestion.title}
          </h3>

          {currentQuestion.type === "number" ? (
            <div className="w-full max-w-xs mx-auto">
              <input
                type="number"
                min={currentQuestion.min}
                max={currentQuestion.max}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                onChange={(e) => {
                  const age = parseInt(e.target.value);
                  if (
                    age >= currentQuestion.min &&
                    age <= currentQuestion.max
                  ) {
                    handleSelect(currentQuestion.id, age);
                  }
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(currentQuestion.id, option.id)}
                    className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-start space-x-4"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              前の質問に戻る
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportNavigator;