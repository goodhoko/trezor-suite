import React, { useRef } from 'react';
import { Dropdown, Icon, useTheme, DropdownRef, variables } from '@trezor/components';
import { Translation } from '@suite-components';
import styled from 'styled-components';
import NotificationsCard from './components/NotificationsCard';

const Wrapper = styled.div`
    display: flex;
    z-index: 10;
    background-color: #ccccdd;
`;

const IconWrapper = styled.div`
    margin: 16px;
`;

const NotificationsDropdown = () => {
    const dropdownRef = useRef<DropdownRef>();
    const theme = useTheme();
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
                                key: 'feedback',
                                label: (
                                    <NotificationsCard
                                        onCancel={() => dropdownRef.current!.close()}
                                    />
                                ),
                                noPadding: true,
                                noHover: true, // no hover effect
                                callback: () => false, // don't close Dropdown on mouse click automatically
                            },
                        ],
                    },
                ]}
            >
                <IconWrapper>
                    <Icon
                        icon="NOTIFICATION"
                        size={24}
                        color={theme.TYPE_DARK_GREY}
                        useCursorPointer
                    />
                </IconWrapper>
            </Dropdown>
        </Wrapper>
    );
};

export default NotificationsDropdown;
