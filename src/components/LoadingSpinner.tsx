import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

function LoadingSpinner({ size = 'md', label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className={`spinner-container spinner-${size}`} role="status" aria-label={label}>
      <div className="spinner" />
    </div>
  );
}

export default LoadingSpinner;
