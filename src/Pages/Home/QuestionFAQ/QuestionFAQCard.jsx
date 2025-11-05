const QuestionFAQCard = ({ item }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-4 px-4 sm:px-0">
      <div
        tabIndex={0}
        className="collapse collapse-arrow bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="collapse-title text-lg sm:text-xl font-semibold text-gray-800  cursor-pointer">
          {item.question}
        </div>

        <div className="collapse-content text-gray-600 text-sm sm:text-base ">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

export default QuestionFAQCard;

// px-6 py-4 sm:px-8 sm:py-5
// sm:px-8 sm:py-5
