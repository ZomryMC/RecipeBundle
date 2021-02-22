import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { changeActiveView } from "../../redux/Actions";
import { ReduxModel, ViewType } from "../../redux/Store";
import { MainMenuButton } from '../common/ActionButton';

interface OwnProps {
    loggedIn: boolean;
}

interface ReduxProps {
    changeActiveView: typeof changeActiveView;
}

function mapStateToProps(store: ReduxModel): OwnProps {
    return {
        loggedIn: store.user.loggedIn
    }
}

type Props = OwnProps & ReduxProps;

function MenuPlannerButton(props: Props) {
    if (!props.loggedIn) {
        return <></>;
    }

    return <MainMenuButton linkTo={Paths.PLANNER} 
        icon={faCalendarWeek}
        label={Localisation.MENU_PLANNER} />
}

export default connect(mapStateToProps, { changeActiveView })(MenuPlannerButton);