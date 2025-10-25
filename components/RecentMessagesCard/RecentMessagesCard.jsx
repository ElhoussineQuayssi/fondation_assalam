import React from 'react';
import Link from 'next/link';
import { Mail, Users, ThumbsUp } from 'lucide-react';

// Placeholder for the custom scroll animation component
const ScrollReveal = ({ children, delay }) => {
    const style = { animationDelay: `${delay}s` };
    return <div className="scroll-reveal" style={style}>{children}</div>;
};

/**
 * Renders a card displaying a list of recent messages, utilizing the 'Content Card'
 * and 'Card Components' patterns from the Design System.
 *
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.recentMessages - Array of message objects.
 * @returns {JSX.Element} Transformed Recent Messages Card component.
 */
const RecentMessagesCard = ({ recentMessages }) => {
    // Design Decision: Implementing Content Card pattern (p-8, rounded-xl, shadow-lg, border-top-accent)
    const cardHoverEffect = "transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1";

    // Helper function to get appropriate icon based on message type
    const getMessageIcon = (type) => {
        switch (type) {
            case "donation":
                return ThumbsUp;
            case "volunteer":
                return Users;
            default:
                return Mail;
        }
    };

    // Helper function to get message type label
    const getMessageTypeLabel = (type) => {
        switch (type) {
            case "donation":
                return "Don";
            case "volunteer":
                return "Bénévole";
            default:
                return "Contact";
        }
    };

    return (
        <ScrollReveal delay={0.2}>
            {/* Main Content Card Container */}
            <div
                className={`
                    bg-white p-5 rounded-lg shadow-lg h-full
                    border-t-4
                    ${cardHoverEffect}
                `}
                style={{ borderTopColor: "#6495ED" }}
                aria-labelledby="recent-messages-title"
            >
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                    <div className="flex-1">
                        {/* Title: H2 Section Title adaptation (enhanced font-size for card context) */}
                        <h2
                            id="recent-messages-title"
                            className="text-lg font-bold text-gray-900 mb-1"
                        >
                            Messages récents
                        </h2>
                        {/* Supportive text: Body text scale (text-sm) */}
                        <p className="text-xs text-gray-600 mt-1">
                            Derniers messages reçus
                        </p>
                    </div>

                    {/* View All Link: Secondary CTA Style (Outline Button adaptation) */}
                    <Link
                        href="/admin/messages"
                        className={`
                            bg-[#6495ED] text-white font-semibold py-1.5 px-3 rounded-md text-sm shadow-md
                            hover:bg-[#5a87d4] transition duration-300
                            transform hover:scale-[1.02]
                        `}
                        aria-label="Voir tous les messages"
                    >
                        Voir tous
                    </Link>
                </div>

                {/* List Container with Scrolling Area */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {recentMessages && recentMessages.length > 0 ? (
                        recentMessages.slice(0, 4).map((message, index) => {
                            const MessageIcon = getMessageIcon(message.type);
                            return (
                                <ScrollReveal key={message.id} delay={index * 0.15}>
                                    {/* List Item: Content Card pattern applied to list item */}
                                    <div
                                        className={`
                                            bg-white p-3 rounded-lg shadow-md border border-gray-100
                                            ${cardHoverEffect}
                                        `}
                                        role="listitem"
                                    >
                                        <div className="flex items-start">
                                            {/* Icon Container: Primary Color for background, Accent Color for icon */}
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: "#B0E0E6" }}
                                                aria-hidden="true"
                                            >
                                                <MessageIcon className="h-5 w-5" style={{ color: "#6495ED" }} />
                                            </div>

                                            <div className="ml-3 flex-1 min-w-0">
                                                {/* Message Sender: H3/Card Title adaptation */}
                                                <h3 className="font-medium text-xs text-gray-900 mb-1 truncate">
                                                    {message.name || "Nom non disponible"}
                                                </h3>

                                                {/* Message excerpt */}
                                                <p className="text-xs text-gray-500 mb-1 truncate">
                                                    {message.excerpt || "Extrait non disponible"}
                                                </p>

                                                <div className="flex justify-between items-center text-xs">
                                                    {/* Date: Body text style (text-sm/xs) */}
                                                    <p className="text-gray-500 truncate text-xs">
                                                        {message.date || "Date non disponible"}
                                                    </p>

                                                    {/* Type Badge: Accent Badge */}
                                                    <span
                                                        className="text-xs px-1.5 py-0.5 rounded-full font-medium text-[#6495ED]"
                                                        style={{ backgroundColor: "rgba(176, 224, 230, 0.7)" }}
                                                    >
                                                        {getMessageTypeLabel(message.type)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })
                    ) : (
                        <div className="text-center py-4 text-gray-500 font-medium text-xs">
                            Aucun message récent
                        </div>
                    )}
                </div>
            </div>
        </ScrollReveal>
    );
};

export default RecentMessagesCard;
