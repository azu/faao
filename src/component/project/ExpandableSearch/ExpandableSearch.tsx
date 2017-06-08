// MIT © 2017 azu
import * as React from "react";
import { ContextualMenu, DirectionalHint, IconButton, SearchBox } from "office-ui-fabric-react";
import classNames from "classnames";

export interface ExpandableSearchBoxProps {
    value?: string;
    className?: string;
    onChangeValue: (newValue: any) => void;
}

export interface ExpandableSearchBoxState {
    contextTarget?: EventTarget;
    isContextMenuVisible: boolean;
}

export class ExpandableSearch extends React.Component<ExpandableSearchBoxProps, ExpandableSearchBoxState> {
    state = {
        contextTarget: undefined,
        isContextMenuVisible: false
    };

    onClickOpenContextMenu = (event: React.MouseEvent<any>) => {
        this.setState({ contextTarget: event.target, isContextMenuVisible: true });
    };

    render() {
        const contextMenu = this.state.contextTarget && this.state.isContextMenuVisible
            ? <ContextualMenu
                  shouldFocusOnMount={true}
                  target={this.state.contextTarget}
                  gapSpace={16}
                  directionalHint={DirectionalHint.bottomAutoEdge}
                  onDismiss={() => {
                      this.setState({
                          contextTarget: undefined,
                          isContextMenuVisible: false
                      });
                  }}
                  items={[
                      {
                          key: "state:open",
                          name: "state:open",
                          ariaLabel: "set state:open to filer",
                          onClick: (_event: React.MouseEvent<any>) => {
                              this.props.onChangeValue("state:open");
                          }
                      },
                      {
                          key: "state:closed",
                          name: "state:closed",
                          ariaLabel: "set state:closed to filer",
                          onClick: (_event: React.MouseEvent<any>) => {
                              this.props.onChangeValue("state:closed");
                          }
                      },
                      {
                          key: "type:issue",
                          name: "type:issue",
                          ariaLabel: "set type:issue to filer",
                          onClick: (_event: React.MouseEvent<any>) => {
                              this.props.onChangeValue("type:issue");
                          }
                      },
                      {
                          key: "type:pr",
                          name: "type:pr",
                          ariaLabel: "set type:pr to filer",
                          onClick: (_event: React.MouseEvent<any>) => {
                              this.props.onChangeValue("type:pr");
                          }
                      }
                  ]}
              />
            : null;
        return (
            <div className={classNames("ExpandableSearch", this.props.className)}>
                {contextMenu}
                <IconButton
                    className="ExpandableSearchBox-menuButton"
                    iconProps={{ iconName: "CollapseMenu" }}
                    title="Open Menu"
                    ariaLabel="Open Menu"
                    onClick={this.onClickOpenContextMenu}
                />

                <SearchBox
                    className="ExpandableSearchBox"
                    labelText="filter word - state:open"
                    value={this.props.value}
                    onChange={this.props.onChangeValue}
                />
            </div>
        );
    }
}
