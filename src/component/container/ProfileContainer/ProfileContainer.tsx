import * as React from "react";
import { ProfileModal } from "../../project/ProfileModal/ProfileModal";
import { ProfileState } from "../../../store/ProfileStore/ProfileStore";
import { BaseContainer } from "../BaseContainer";
import { createExportProfileUseCase } from "../../../use-case/Profile/ExportProfileUseCase";

export interface ProfileContainerProps {
    profile: ProfileState;
}

export class ProfileContainer extends BaseContainer<ProfileContainerProps, {}> {
    onDismiss = () => {
        console.log("dissmiss");
    };

    onClickImportButton = () => {
        console.log("import");
    };

    onClickExportButton = () => {
        console.log("export");
        this.useCase(createExportProfileUseCase()).executor(useCase => useCase.execute());
    };

    render() {
        return (
            <ProfileModal
                isOpen={true}
                code={JSON.stringify(this.props.profile.exportedJSON, null, 4)}
                onDismiss={this.onDismiss}
                onClickExportButton={this.onClickExportButton}
                onClickImportButton={this.onClickImportButton}
            />
        );
    }
}
