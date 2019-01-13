import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Icon,
  Segment,
  Input,
  Message,
  List,
  Button,
  Popup
} from "semantic-ui-react";
import _ from "lodash";
import ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import LazyInput from "../LazyInput";
import { defaultTotalHeight, defaultRightToolBarHeight } from "./constants";

import { filterByMultiProperties, moveArrayElement } from "../utils";

class RightItems extends Component {
  state = {
    searchKeyword: "",
    activeSelectedItemIndex: null
  };
  componentWillReceiveProps = nextProps => {
    // cancel active, for fixing activeSelectedItemIndex bug
    if (this.props.dragAndDropOptions.isDragAndDropOn) {
      
      if (this.props.items.length !== nextProps.items.length) {
        this.setState({ activeSelectedItemIndex: null });
      }
    }
  };
  onInputChange = value => {
    this.setState({ searchKeyword: value });
  };

  onItemSelect = (item, index) => {
    this.setState({ activeSelectedItemIndex: index });
  };
  onItemRemove = (item, index) => {
    const { items, onItemsChanged, onItemRemoved } = this.props;
    const updatedItems = items.slice(0, index).concat(items.slice(index + 1));
    this.setState(
      {
        activeSelectedItemIndex: null
      },
      () => {
        onItemsChanged(updatedItems);
        onItemRemoved(item);
      }
    );
  };
  moveActiveSelectedTo = position => () => {
    const { onItemsChanged } = this.props;
    const { activeSelectedItemIndex: i } = this.state;
    switch (position) {
      case "top": {
        const { items: newItems, itemIndex } = moveArrayElement.top(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      case "up": {
        const { items: newItems, itemIndex } = moveArrayElement.up(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      case "down": {
        const { items: newItems, itemIndex } = moveArrayElement.down(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      case "bottom": {
        const { items: newItems, itemIndex } = moveArrayElement.bottom(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      default:
        return;
    }
  };

  render() {
    const {
      items = [],
      title,
      renderTitle,
      searchInputPlaceHolder = "",
      itemValuePropertyName,
      renderItem,
      onItemsChanged,
      renderSelectedToolBar,
      searchProperties,
      dragAndDropOptions: { isDragAndDropOn, saveGridLayout }
    } = this.props;
    
    const { searchKeyword } = this.state;
    const searchedItems = filterByMultiProperties(
      items,
      searchKeyword,
      searchProperties
    );
    const totalHeight = this.props.totalHeight || defaultTotalHeight;
    const rightToolBarHeight = _.isNumber(this.props.rightToolBarHeight)
      ? this.props.rightToolBarHeight
      : defaultRightToolBarHeight;

    const isSelected = !_.isNil(this.state.activeSelectedItemIndex);
    const moveButtonGroup = (
      <Button.Group fluid>
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("top")}
              icon="angle double up"
              circular
            />
          }
          content="Move to top"
        />
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("up")}
              icon="angle up"
              circular
            />
          }
          content="Move up"
        />
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("down")}
              icon="angle down"
              circular
            />
          }
          content="Move down"
        />
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("bottom")}
              icon="angle double down"
              circular
            />
          }
          content="Move to bottom"
        />
      </Button.Group>
    );
    const listItems = searchedItems.map((item, i) => (
      <List.Item
        key={i}
        active={this.state.activeSelectedItemIndex === i}
        onClick={() => {
          this.onItemSelect(item, i);
        }}
        style={
          isDragAndDropOn
            ? {
                cursor: "pointer",
                borderBottom: "1px solid rgba(34,36,38,.15)",
                background:
                  this.state.activeSelectedItemIndex === i
                    ? "rgba(0,0,0,.05)"
                    : "unset"
              }
            : {}
        } // semantic item style
      >
        <List.Content floated="left">
          <List.Header>
            <Icon
              name="minus"
              circular
              style={{ cursor: "pointer" }}
              onClick={e => {
                e.stopPropagation(); // for prevent event bubbling
                this.onItemRemove(item, i);
              }}
            />
            {itemValuePropertyName && item[itemValuePropertyName]}
            {renderItem && renderItem(item, i)}
          </List.Header>
        </List.Content>
      </List.Item>
    ));

    const gridLayout = (
      <ReactGridLayout
        layout={this.props.items.map((item, index) => ({
          x: 0,
          y: index,
          w: 1,
          h: 1
        }))}
        cols={1}
        rowHeight={32}
        width={1000}
        autoSize
        verticalCompact
        compactType={"vertical"}
        isResizable={false}
        preventCollision={false}
        onLayoutChange={layout => {
          saveGridLayout(layout);
        }}
      >
        {listItems}
      </ReactGridLayout>
    );

    return (
      <div style={{ flex: 1 }}>
        <Segment attached textAlign="right" style={{ borderLeft: 0 }}>
          {title && title}
          {renderTitle && renderTitle(searchedItems)}
        </Segment>

        <LazyInput
          as={Input}
          time={200}
          onChange={this.onInputChange}
          value={this.state.searchKeyword}
          fluid
          icon="search"
          iconPosition="left"
          placeholder={searchInputPlaceHolder}
        />

        {isSelected && (
          <div
            style={{
              height: `${rightToolBarHeight}px`,
              borderBottom: 0
            }}
          >
            {renderSelectedToolBar
              ? renderSelectedToolBar({
                  moveButtonGroup,
                  activeItem: this.props.items[
                    this.state.activeSelectedItemIndex
                  ],
                  activeItemIndex: this.state.activeSelectedItemIndex
                })
              : moveButtonGroup}
          </div>
        )}

        <Segment
          style={{
            marginTop: 0,
            height: isSelected
              ? `${totalHeight - rightToolBarHeight}px`
              : `${totalHeight}px`,
            maxHeight: `${totalHeight}px`,
            overflow: "auto"
          }}
        >
          <List selection divided animated>
            {searchedItems.length === 0 && (
              <Message style={{ margin: "20px" }}>
                {"No Matched Item to display"}
              </Message>
            )}
            {isDragAndDropOn ? gridLayout : listItems}
          </List>
        </Segment>
      </div>
    );
  }
}

RightItems.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  searchProperties: PropTypes.arrayOf(PropTypes.string),
  searchInputPlaceHolder: PropTypes.string,
  itemValuePropertyName: PropTypes.string,
  onItemsChanged: PropTypes.func.isRequired,
  onItemRemoved: PropTypes.func,
  renderSelectedToolBar: PropTypes.func,
  dragAndDropOptions: PropTypes.shape({
    isDragAndDropOn: PropTypes.bool.isRequired,
    saveGridLayout: PropTypes.func.isRequired // save layout array
  })
};
RightItems.defaultProps = {
  items: [],
  searchInputPlaceHolder: "Search...",
  // itemValuePropertyName: '',
  searchProperties: [],
  dragAndDropOptions: {
    isDragAndDropOn: false,
    saveGridLayout: () => {}
  }
};

export default RightItems;
