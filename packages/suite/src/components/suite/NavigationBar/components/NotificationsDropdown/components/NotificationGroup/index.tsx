import { NotificationEntry } from '@suite-reducers/notificationReducer';
import { AppState } from '@suite-types';
import { variables } from '@trezor/components';
import React from 'react';
import styled from 'styled-components';
import NotificationList from '../NotificationList';

const Wrapper = styled.div``;

const SectionHeadline = styled.div`
    margin-top: 14px;
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    text-transform: uppercase;
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    height: 16px;
    line-height: 1.33;
    letter-spacing: 0.2px;
    opacity: 0.6;
`;

const getSeenAndUnseenNotifications = (notifications: AppState['notifications']) => {
    const read: Array<NotificationEntry> = [];
    const unread: Array<NotificationEntry> = [];

    // loop over all notifications and check which of there were seen or not
    notifications.forEach(notification => {
        if (notification.seen) {
            read.push(notification);
        } else {
            unread.push(notification);
        }
    });

    return { readNotifications: read, unreadNotifications: unread };
};
interface Props {
    notifications: AppState['notifications'];
}
const NotificationGroup = (props: Props) => {
    const { readNotifications, unreadNotifications } = getSeenAndUnseenNotifications(
        props.notifications,
    );
    const unreadCount = unreadNotifications.length;

    return (
        <Wrapper>
            {unreadCount > 0 && (
                <>
                    <SectionHeadline>{unreadCount} unread</SectionHeadline>
                    <NotificationList notifications={unreadNotifications} />
                </>
            )}

            <SectionHeadline>All read</SectionHeadline>
            <NotificationList notifications={readNotifications} />
        </Wrapper>
    );
};

export default NotificationGroup;
