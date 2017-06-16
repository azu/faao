import * as React from "react";
import { Modal } from "office-ui-fabric-react/lib/components/Modal";
import { ProfileJSONEditor } from "./ProfileJSONEditor/ProfileJSONEditor";
import { CommandButton, CompoundButton, MessageBar, MessageBarType } from "office-ui-fabric-react";
import { ProfileJSON } from "../../../domain/Profile/Profile";

export interface ProfileModalProps {
    isOpen: boolean;
    code: string;
    onDismiss: () => void;
    onClickExportButton: (event: React.MouseEvent<any>) => void;
    onClickImportButton: (event: React.MouseEvent<any>, json: ProfileJSON) => void;
}

export interface ProfileModalState {
    editorJSON: ProfileJSON | undefined;
    validateJSONError: Error | undefined;
}

export class ProfileModal extends React.Component<ProfileModalProps, ProfileModalState> {
    state = {
        editorJSON: undefined,
        validateJSONError: undefined
    };
    onChangeEditorValue = (value: string) => {
        try {
            const json = JSON.parse(value);
            this.setState({
                editorJSON: json,
                validateJSONError: undefined
            });
        } catch (error) {
            this.setState({
                editorJSON: undefined,
                validateJSONError: error
            });
        }
    };
    onClickImportButton = (event: React.MouseEvent<any>) => {
        const editorJSON = this.state.editorJSON;
        if (editorJSON !== undefined) {
            this.props.onClickImportButton(event, editorJSON);
        }
    };

    render() {
        const validateJSONError = this.state.validateJSONError;
        const errorMessageJSON = validateJSONError !== undefined
            ? <MessageBar messageBarType={MessageBarType.error} className="ProfileModal-messageBar">
                  {String(validateJSONError)}
              </MessageBar>
            : null;
        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.props.onDismiss}
                isBlocking={false}
                containerClassName="ProfileModal"
            >
                <div className="ProfileModal-left">
                    <h2 className="ms-font-xxl ProfileModal-leftTitle">Current Profile(JSON)</h2>
                    <ProfileJSONEditor
                        className="ProfileModal-editor"
                        code={this.props.code}
                        onChange={this.onChangeEditorValue}
                    />
                    {errorMessageJSON}
                </div>
                <div className="ProfileModal-right">
                    <div className="ProfileModal-description ms-Grid">
                        <h2 className="ms-font-xxl ProfileModal-title">Profile</h2>
                        <p>A "Profile" contains following sensitive data:</p>
                        <ul>
                            <li>GitHubSettings - includes token</li>
                            <li>GitHubSearchLists - includes Queries</li>
                        </ul>
                    </div>
                    <div className="ms-Grid">
                        <h2 className="ms-font-xxl">Exports</h2>
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2 u-height-44">
                                <CommandButton
                                    className="ProfileModal-exportButton"
                                    description="You can export data to JSON"
                                    iconProps={{
                                        iconName: "PageLeft"
                                    }}
                                    onClick={this.props.onClickExportButton}
                                >
                                    Export to JSON
                                </CommandButton>
                            </div>
                            <div className="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10 u-height-44">
                                <p className="u-height-44">
                                    You can export data to JSON.
                                    Left editor is current data as JSON.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid">
                        <h2 className="ms-font-xxl">Imports</h2>
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2 u-height-44">
                                <CommandButton
                                    className="ProfileModal-importButton u-height-44"
                                    description="You can import data from JSON"
                                    iconProps={{
                                        iconName: "PageRight"
                                    }}
                                    onClick={this.onClickImportButton}
                                >
                                    Import from JSON
                                </CommandButton>
                            </div>
                            <div className="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10 u-height-44">
                                <p className="u-height-44">
                                    You can import data from JSON.
                                </p>
                            </div>
                            <MessageBar
                                className="ProfileModal-messageBar"
                                messageBarType={MessageBarType.warning}
                                ariaLabel="Warning on import"
                            >
                                Warning - Import data and it overwrite exist data.
                                It means that current profile will be deleted.
                            </MessageBar>
                        </div>
                    </div>
                </div>

            </Modal>
        );
    }
}
