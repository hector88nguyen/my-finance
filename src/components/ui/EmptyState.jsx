import './EmptyState.css';

const EmptyState = ({ title, description, icon: Icon, actionButton }) => {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionButton && <div className="empty-state-action">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
