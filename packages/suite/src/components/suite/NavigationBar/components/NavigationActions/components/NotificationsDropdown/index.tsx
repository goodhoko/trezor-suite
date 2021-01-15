import { Translation } from '@suite-components';
import { Dropdown, DropdownRef } from '@trezor/components';
import React, { useRef } from 'react';
import styled from 'styled-components';
import Notifications from '../../../../../Notifications';
import ActionItem from '../ActionItem';

const Wrapper = styled.div`
    display: flex;
    z-index: 10;
    background-color: #a2cbf2;
`;

const NotificationsDropdown = () => {
    const dropdownRef = useRef<DropdownRef>();
    return (
        <Wrapper>
            <Dropdown
                ref={dropdownRef}
                alignMenu="right"
                offset={16}
                items={[
                    {
                        key: 'dropdown',

                        options: [
                            {
                                key: 'notifications',
                                label: (
                                    <Notifications onCancel={() => dropdownRef.current!.close()} />
                                ),
                                noPadding: true,
                                noHover: true, // no hover effect
                                callback: () => false, // don't close Dropdown on mouse click automatically
                            },
                        ],
                    },
                ]}
            >
                <ActionItem label={<Translation id="TR_NOTIFICATIONS" />} icon="NOTIFICATION" />
            </Dropdown>
        </Wrapper>
    );
};

export default NotificationsDropdown;
