import React from "react";
import { motion } from "framer-motion";
import { Card } from "flowbite-react";
import PropTypes from "prop-types";

/**
 * Unified StatCard component supporting multiple variants
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element or component
 * @param {string} props.color - Color class (e.g., 'text-blue-500', 'bg-blue-50')
 * @param {string} props.title - Card title
 * @param {number|string} props.value - Main value to display
 * @param {string} [props.description] - Optional description text
 * @param {number} [props.trend] - Optional trend percentage
 * @param {string} [props.style] - Style variant: 'simple' | 'detailed' | 'compact'
 * @param {Object} [props.containerProps] - Additional props for motion.div
 */
const StatCard = ({
  icon,
  color = "text-blue-500",
  title,
  value,
  description,
  trend,
  style = "detailed",
  containerProps = {},
  backgroundColor,
  textColor,
}) => {
  // Handle style = 'simple' (original style for backward compatibility)
  if (style === "simple") {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 relative"
      >
        {/* Envelope flap */}
        <div className={`h-2 ${color.replace("text-", "bg-")}`}></div>

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                {title}
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {value}
              </p>
            </div>
            <div
              className={`${color} p-3 rounded-full bg-opacity-20 dark:bg-opacity-20 ${color.replace(
                "text-",
                "bg-"
              )}`}
            >
              {icon}
            </div>
          </div>

          {/* Envelope stamp-like decoration */}
          <div className="absolute bottom-2 right-2 opacity-10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 12H16M12 8V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </motion.div>
    );
  }

  // Handle style = 'compact' (for OPD dashboard variant)
  if (style === "compact") {
    return (
      <motion.div variants={containerProps.variants} className={containerProps.className}>
        <Card className={`${backgroundColor} border-0 shadow-sm hover:shadow transition-shadow duration-300`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {title}
              </p>
              <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
              {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            <div className={`p-2 rounded-full ${backgroundColor}`}>{icon}</div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Default style = 'detailed' (modern variant with trend support)
  return (
    <motion.div variants={containerProps.variants}>
      <Card className="w-full min-w-0 hover:shadow-lg transition-all duration-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 rounded-full bg-${color.split("-")[1]}-100 dark:bg-${color
                  .split("-")[1]
                  .split("-")[0]}-900/30`}
              >
                {icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {title}
                </p>
                <p
                  className={`text-2xl font-bold text-${color.split("-")[1]}-600 dark:text-${color
                    .split("-")[1]
                    .split("-")[0]}-400`}
                >
                  {value}
                </p>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {trend != null && (
              <div className="text-right">
                <div
                  className={`flex items-center ${
                    trend > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L13.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">{Math.abs(trend)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  description: PropTypes.string,
  trend: PropTypes.number,
  style: PropTypes.oneOf(["simple", "detailed", "compact"]),
  containerProps: PropTypes.object,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default StatCard;
