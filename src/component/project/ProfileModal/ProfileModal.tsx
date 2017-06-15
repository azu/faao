import * as React from "react";
import { Modal } from "office-ui-fabric-react/lib/components/Modal";
import { ProfileJSONEditor } from "./ProfileJSONEditor/ProfileJSONEditor";
import { CommandButton, CompoundButton, MessageBar, MessageBarType } from "office-ui-fabric-react";

export interface ProfileModalProps {
    isOpen: boolean;
    code: string;
    onDismiss: () => void;
    onClickExportButton: (event: React.MouseEvent<any>) => void;
    onClickImportButton: (event: React.MouseEvent<any>) => void;
}

export class ProfileModal extends React.Component<ProfileModalProps, {}> {
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.props.onDismiss}
                isBlocking={false}
                containerClassName="ProfileModal"
            >
                <div className="ProfileModal-left">
                    <h2 className="ms-font-xxl ProfileModal-leftTitle">Current data as JSON</h2>
                    <ProfileJSONEditor className="ProfileModal-editor" code={this.props.code} />
                </div>
                <div className="ProfileModal-right">
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
                                    onClick={this.props.onClickImportButton}
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
                                className="u-height-44"
                                messageBarType={MessageBarType.warning}
                                ariaLabel="Warning on import"
                            >
                                Warning - Import data and it overwrite exist data.
                                It means that current data will be deleted.
                            </MessageBar>
                        </div>
                    </div>
                </div>

            </Modal>
        );
    }
}
