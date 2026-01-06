interface LegacyButtonProps {
  buttonType: "circleBtn" | "commonBtn";
  buttonSize?: "sm" | "md" | "lg";
  isDarkMode: boolean;
  isDisabled: boolean;
  children: any;
  onClickAction: () => void;
}

export const LegacyButton = ({
  buttonType,
  isDarkMode,
  isDisabled,
  children,
  onClickAction,
}: LegacyButtonProps) => {
  let className = "";

  if (buttonType === "circleBtn") {
    className = `w-8 h-8 rounded-full overflow-hidden`;
  } else if (buttonType === "commonBtn") {
    className = `px-3 py-0 rounded-md ${
      isDisabled
        ? isDarkMode
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
        : isDarkMode
        ? "bg-gray-100 text-gray-700 hover:bg-gray-600"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  }

  return (
    <button
      onClick={() => onClickAction()}
      disabled={isDisabled}
      className={className}
    >
      {children}
    </button>
  );
};
