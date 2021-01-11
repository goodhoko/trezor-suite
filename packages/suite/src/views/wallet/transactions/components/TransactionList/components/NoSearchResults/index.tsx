import React from 'react';
import styled from 'styled-components';
import { Card, variables } from '@trezor/components';
import { Translation } from '@suite-components';
import { FormattedDate } from 'react-intl';
import { format } from 'date-fns';

const NoResults = styled(Card)`
    display: flex;
    text-align: center;
    color: ${props => props.theme.TYPE_DARK_GREY};
    font-size: ${variables.FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const Examples = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.SMALL};
    font-style: italic;
`;

interface Props {
    className?: string;
}

const NoSearchResults = (props: Props) => {
    return (
        <NoResults {...props}>
            <Translation id="TR_NO_SEARCH_RESULTS" />

            <Examples>
                <Translation
                    id="TR_TRANSACTIONS_SEARCH_EXAMPLE_1"
                    values={{
                        strong: chunks => <>{chunks}</>, // search string is wrapped in strong tag for additional styling
                        dateYYYYMMDD: format(new Date(2020, 1, 11), 'yyyy-MM-dd'),
                        date: <FormattedDate value={new Date(2020, 1, 11)} />,
                    }}
                />
            </Examples>
        </NoResults>
    );
};

export default NoSearchResults;
