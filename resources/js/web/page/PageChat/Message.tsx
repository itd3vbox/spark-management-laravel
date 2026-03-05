import React from "react";

interface MessageProps {
    data: any;
    showDate?: boolean;
}

export default class Message extends React.Component<MessageProps> {

    render() {
        const { data, showDate } = this.props;

        // Get auth user id from meta
        const userMetaTag = document.querySelector('meta[name="user-id"]');
        const authId = userMetaTag ? Number(userMetaTag.getAttribute('content')) : null;

        // Check if message is from auth user
        const isAuthMessage = authId === data.user_from.id;

        // Format date
        const date = new Date(data.created_at);
        const formattedDate = date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        return (
            <>
                {showDate && (
                    <div className="date">
                        <div className="value">{formattedDate}</div>
                    </div>
                )}

                {/* Auth user message */}
                {isAuthMessage ? (
                    <div className="message-you">
                        <div className="content">{data.content}</div>
                    </div>
                ) : (
                    /* Other user message */
                    <div className="message-other">
                        <div className="user">
                            <img
                                src={data.user_from.avatar_info?.path || '/images/avatar.png'}
                                alt={data.user_from.username}
                            />
                        </div>
                        <div className="content">
                            {data.content}
                        </div>
                    </div>
                )}
            </>
        );
    }
}