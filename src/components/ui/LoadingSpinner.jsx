import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 40, color = 'var(--primary-color)', fullScreen = false }) => {
  const spinner = (
    <div className="spinner-container">
      <div 
        className="spinner" 
        style={{ 
          width: size, 
          height: size, 
          borderColor: `${color} transparent transparent transparent` 
        }} 
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
