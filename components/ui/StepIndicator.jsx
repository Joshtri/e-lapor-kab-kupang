'use client';

const StepIndicator = ({ step = 1, totalSteps = 3 }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 w-fit mx-auto">
        {Array.from({ length: totalSteps }, (_, index) => {
          const i = index + 1;
          return (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step >= i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {i}
              </div>
              {i < totalSteps && (
                <div
                  className={`h-1 w-8 sm:w-16 ${
                    step > i ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
