import { useSelector } from '@suite-hooks';
import { AppState } from '@suite-types';
import { Icon, useTheme, variables } from '@trezor/components';
import React, { useState } from 'react';
import styled from 'styled-components';
import NotificationGroup from './components/NotificationGroup';

const Wrapper = styled.div`
    width: 450px;
    cursor: default; // overwrite pointer cursor which is defined on Dropdown element by default
`;

const Header = styled.div`
    display: flex;
    padding: 0 22px;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};
`;
const TabSelector = styled.div`
    display: flex;
    flex-grow: 1;
`;

const TabButton = styled.button<{ selected: boolean }>`
    border: none;
    background-color: inherit;
    font-size: ${variables.NEUE_FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    padding-top: 16px;
    padding-bottom: 12px;
    margin-right: 24px;
    cursor: pointer;
    /* change styles if the button is selected*/
    color: ${props =>
        props.selected ? `${props.theme.TYPE_DARK_GREY}` : `${props.theme.TYPE_LIGHT_GREY}`};
    border-bottom: 2px solid;
    border-color: ${props => (props.selected ? props.theme.TYPE_DARK_GREY : props.theme.BG_WHITE)};
`;

const CloseButtonWrapper = styled.div``;

const Content = styled.div`
    padding: 0 22px 12px 22px;
    max-height: 340px;
    overflow-y: auto;
    overflow-x: hidden;
`;

const getCategorizedNotifications = (notifications: AppState['notifications']) => {
    // TODO Give each notification type one of two categories (tx-notification, all-notifications) and categorized notifications based on that
    return { txNotifications: notifications, allNotifications: [] };
};

interface Props {
    onCancel: () => any;
}
const Notifications = (props: Props) => {
    const notifications = useSelector(state => state.notifications);
    const [selectedTab, setSelectedTab] = useState<'notifications' | 'all-activity'>(
        'notifications',
    );
    const theme = useTheme();

    const { txNotifications, allNotifications } = getCategorizedNotifications(notifications);

    const onCancel = () => {
        props.onCancel();
    };

    return (
        <Wrapper>
            <Header>
                <TabSelector>
                    <TabButton
                        selected={selectedTab === 'notifications'}
                        onClick={() => setSelectedTab('notifications')}
                    >
                        Notifications
                    </TabButton>
                    <TabButton
                        selected={selectedTab === 'all-activity'}
                        onClick={() => setSelectedTab('all-activity')}
                    >
                        All activity
                    </TabButton>
                </TabSelector>
                <CloseButtonWrapper>
                    <Icon
                        icon="CROSS"
                        size={20}
                        color={theme.TYPE_LIGHT_GREY}
                        useCursorPointer
                        onClick={onCancel}
                    />
                </CloseButtonWrapper>
            </Header>
            <Content>
                <NotificationGroup
                    notifications={
                        selectedTab === 'notifications' ? txNotifications : allNotifications
                    }
                />
            </Content>
        </Wrapper>
    );
};

export default Notifications;
