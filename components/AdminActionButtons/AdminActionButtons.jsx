import Link from "next/link";
import { Loader2 } from "lucide-react";

const AdminActionButtons = ({ item, actions, loadingActions = {} }) => {
  // Design system colors matching Button component
  const ACCENT = "#6495ED";
  const DANGER = "#DC2626";
  const SUCCESS = "#10B981";
  const GRAY = "#6B7280";

  const getButtonStyle = (actionKey) => {
    const baseClasses = `
      relative p-2 rounded-full transition-all duration-300 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:scale-110 active:scale-95
    `;

    const variantStyles = {
      view: {
        default: `hover:bg-gray-100 focus:ring-gray-400`,
        iconColor: GRAY,
        hoverIconColor: GRAY,
        bgColor: 'transparent',
        hoverBg: '#F3F4F6'
      },
      edit: {
        default: `hover:bg-blue-50 focus:ring-blue-400`,
        iconColor: ACCENT,
        hoverIconColor: ACCENT,
        bgColor: 'transparent',
        hoverBg: `${ACCENT}08` // 8-digit hex for 3% opacity
      },
      delete: {
        default: `hover:bg-red-50 focus:ring-red-400`,
        iconColor: DANGER,
        hoverIconColor: DANGER,
        bgColor: 'transparent',
        hoverBg: `${DANGER}08` // 8-digit hex for 3% opacity
      },
      default: {
        default: `hover:bg-gray-100 focus:ring-gray-400`,
        iconColor: GRAY,
        hoverIconColor: GRAY,
        bgColor: 'transparent',
        hoverBg: '#F3F4F6'
      }
    };

    const style = variantStyles[actionKey] || variantStyles.default;

    return {
      classes: `${baseClasses} ${style.default}`,
      iconColor: loadingActions[actionKey] ? '#9CA3AF' : style.iconColor,
      hoverIconColor: style.hoverIconColor,
      bgColor: loadingActions[actionKey] ? '#F9FAFB' : style.bgColor,
      hoverBg: style.hoverBg
    };
  };

  return (
    <div className="flex justify-end space-x-1">
      {actions.map((action) => {
        const Icon = action.icon;
        const isLoading = loadingActions[action.key];
        const buttonStyle = getButtonStyle(action.key);

        const handleClick = (e) => {
          if (isLoading || !action.onClick) return;

          e.preventDefault();
          action.onClick(item.id);
        };

        const linkProps = action.href ? { href: action.href(item) } : {};
        const Tag = action.href ? Link : "button";

        const content = (
          <>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
          </>
        );

        return (
          <Tag
            key={action.key}
            {...linkProps}
            onClick={handleClick}
            title={action.title}
            className={buttonStyle.classes}
            style={{
              backgroundColor: buttonStyle.bgColor,
              '--hover-bg': buttonStyle.hoverBg
            }}
            disabled={isLoading}
            aria-label={isLoading ? `${action.title} - Loading` : action.title}
            aria-disabled={isLoading}
            role="button"
            tabIndex={isLoading ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                e.preventDefault();
                handleClick(e);
              }
            }}
          >
            {content}
          </Tag>
        );
      })}
    </div>
  );
};

export default AdminActionButtons;
