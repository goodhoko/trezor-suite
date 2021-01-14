import { Image, LayoutContext, Translation } from '@suite-components';
import hocNotification, { ViewProps } from '@suite-components/hocNotification';
import { useSelector } from '@suite-hooks';
import { Button, H2, P, Icon, useTheme } from '@trezor/components';
import React from 'react';
import { FormattedDate } from 'react-intl';
import styled from 'styled-components';
import { getNotificationIcon } from '@suite-utils/notification';
import { AppState } from '@suite-types';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: 100%;
`;

// this gives "Error: Cannot create styled-component for component" error
// const StyledCard = styled(Card)`
//     display: flex;
//     flex-direction: column;
// `;

const DateP = styled(P)`
    display: flex;
    flex-direction: column;
    font-variant-numeric: tabular-nums;
`;

const Item = styled.div`
    display: flex;
    padding: 16px 0px;

    & + & {
        border-top: 1px solid ${props => props.theme.STROKE_GREY};
    }
`;

const Text = styled.div`
    flex: 1;
    padding: 0px 16px;
`;

const EmptyWrapper = styled.div``;

const ActionButton = styled(Button)`
    min-width: 80px;
    align-self: center;
`;

const NotificationView = (props: ViewProps) => {
    const defaultIcon = props.icon ?? getNotificationIcon(props.variant);
    const { seen } = props.notification;
    console.log('props', props);
    return (
        <Item>
            {defaultIcon && (
                <Icon
                    size={20}
                    icon={defaultIcon}
                    style={{ marginTop: '4px', opacity: seen ? 0.7 : 1 }}
                />
            )}
            <Text>
                <P
                    size="small"
                    weight={seen ? 'normal' : 'bold'}
                    style={{ opacity: seen ? 0.7 : 1 }}
                >
                    {/* <Translation id={props.message} values={props.message.values} /> */}

                    {typeof props.message === 'string' ? (
                        <Translation id={props.message} />
                    ) : (
                        <Translation {...props.message} />
                    )}
                </P>
                <DateP size="tiny" style={{ opacity: seen ? 0.7 : 1 }}>
                    <FormattedDate
                        value={props.notification.id}
                        year="numeric"
                        month="2-digit"
                        day="2-digit"
                        hour="2-digit"
                        minute="2-digit"
                    />
                </DateP>
            </Text>
            {props.actionLabel && props.action && (
                <ActionButton variant="tertiary" onClick={props.action}>
                    <Translation id={props.actionLabel} />
                </ActionButton>
            )}
        </Item>
    );
};

interface Props {
    notifications: AppState['notifications'];
}

const NotificationList = (props: Props) => {
    const { notifications } = props;

    if (notifications.length < 1) {
        return (
            <EmptyWrapper>
                <H2>
                    <Translation id="NOTIFICATIONS_EMPTY_TITLE" />
                </H2>
                <P size="small">
                    <Translation id="NOTIFICATIONS_EMPTY_DESC" />
                </P>
            </EmptyWrapper>
        );
    }

    return (
        <>
            <Wrapper>{notifications.map(n => hocNotification(n, NotificationView))}</Wrapper>
        </>
    );
};

export default NotificationList;
