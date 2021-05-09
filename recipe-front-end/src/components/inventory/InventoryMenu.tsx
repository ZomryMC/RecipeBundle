import { Heading } from '@chakra-ui/react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { ReduxModel } from '../../redux/Store';
import ContentContainer from '../common/ContentContainer';
import { InventoryModal } from './InventoryModal';

interface ReduxProps {
    loggedIn: boolean;
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxModel.user.loggedIn
    };
}

function InventoryMenu(props: ReduxProps) {
    if (!props.loggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    const [modalIsOpened, setModalIsOpened] = useState(false);

    return <ContentContainer>
        <Heading as="h2">{Localisation.INVENTORY}</Heading>
        <div tabIndex={0} style={{ cursor: 'pointer' }} onClickCapture={() => setModalIsOpened(true)}>
            <FontAwesomeIcon icon={faPlus} /> {Localisation.ADD}
        </div>

        <InventoryModal isOpened={modalIsOpened} onConfirm={() => {
            setModalIsOpened(false);
        }} onCancel={() => {
            setModalIsOpened(false);
        }}/>
    </ContentContainer>
}

export default connect(mapStateToProps)(InventoryMenu);