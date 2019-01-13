import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Segment, Input, List, Message } from "semantic-ui-react";

import LazyInput from "../LazyInput";
import { defaultTotalHeight } from "./constants";
import { filterByMultiProperties } from "../utils";
class LeftItems extends Component {
  state = {
    searchKeyword: ""
  };
  onInputChange = value => {
    this.setState({ searchKeyword: value });
  };

  onClickPlusIcon = (item, index) => {
    const { items } = this.props;
    const updatedItems = items.slice(0, index).concat(items.slice(index + 1));
    this.props.onItemsChanged(updatedItems);
    this.props.onItemMoved(item);
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
      searchProperties
    } = this.props;
    const { searchKeyword } = this.state;
    const searchedItems = filterByMultiProperties(
      items,
      searchKeyword,
      searchProperties
    );

    const totalHeight = this.props.totalHeight || defaultTotalHeight;

    const listItems = searchedItems.map((item, i) => (
      <List.Item key={i} style={{ cursor: "default" }}>
        <List.Content floated="left" style={{ cursor: "pointer" }}>
          <List.Header>
            <Icon
              name="plus"
              onClick={() => {
                this.onClickPlusIcon(item, i);
              }}
              style={{ cursor: "pointer" }}
              circular
            />
            {itemValuePropertyName && item[itemValuePropertyName]}
            {renderItem && renderItem(item)}
          </List.Header>
        </List.Content>
      </List.Item>
    ));

    return (
      <div style={{ flex: 1 }}>
        <Segment attached textAlign="left" style={{ borderRight: 0 }}>
          {title && title}
          {renderTitle && renderTitle(searchedItems)}
        </Segment>

        <LazyInput
          as={Input}
          onChange={this.onInputChange}
          value={this.state.searchKeyword}
          fluid
          icon="search"
          iconPosition="left"
          placeholder={searchInputPlaceHolder}
          time={200}
        />
        <Segment
          style={{
            marginTop: 0,
            height: `${totalHeight}px`,
            maxHeight: `${totalHeight}px`,
            overflow: "auto"
          }}
        >
          <List selection divided celled animated relaxed>
            {searchedItems.length === 0 && (
              <Message style={{ margin: "20px" }}>
                {"No Matched Category to display"}
              </Message>
            )}
            {listItems}
          </List>
        </Segment>
      </div>
    );
  }
}

LeftItems.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  searchInputPlaceHolder: PropTypes.string,
  itemValuePropertyName: PropTypes.string,
  renderItem: PropTypes.func,
  searchProperties: PropTypes.arrayOf(PropTypes.string),
  onItemsChanged: PropTypes.func.isRequired,
  onItemMoved: PropTypes.func.isRequired
};
LeftItems.defaultProps = {
  items: [],
  searchInputPlaceHolder: "Search...",
  // itemValuePropertyName: '',
  // renderItem: ,
  searchProperties: []
};

export default LeftItems;
