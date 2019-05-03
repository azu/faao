import * as React from "react";
import { ProfileModal } from "../../project/ProfileModal/ProfileModal";
import { ProfileState } from "../../../store/ProfileStore/ProfileStore";
import { BaseContainer } from "../BaseContainer";
import { createExportProfileUseCase } from "../../../use-case/Profile/ExportProfileUseCase";
import { createImportProfileJSONUseCase } from "../../../use-case/Profile/ImportProfileJSONUseCase";
import { ProfileJSON } from "../../../domain/Profile/Profile";
import { CloseProfileWindowUseCase } from "../../../use-case/Profile/ToggleProfileWindowUseCase";

export interface ProfileContainerProps {
    profile: ProfileState;
}

export class ProfileContainer extends BaseContainer<ProfileContainerProps, {}> {
    onDismiss = () => {
        this.useCase(new CloseProfileWindowUseCase()).execute();
    };

    onClickImportButton = (_event: React.MouseEvent<any>, json: ProfileJSON) => {
        this.useCase(createImportProfileJSONUseCase()).execute(json);
    };

    onClickExportButton = () => {
        this.useCase(createExportProfileUseCase()).execute();
    };

    render() {
        return (
            <ProfileModal
                isOpen={this.props.profile.isShow}
                code={JSON.stringify(this.props.profile.exportedJSON, null, 4)}
                onDismiss={this.onDismiss}
                onClickExportButton={this.onClickExportButton}
                onClickImportButton={this.onClickImportButton}
            />
        );
    }
}
