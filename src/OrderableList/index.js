import React, { Component } from "react";
import PropTypes from "prop-types";
import { Message, Dropdown, Ref } from "semantic-ui-react";
import _ from "lodash";
import LeftItems from "./LeftItems";
import RightItems from "./RightItems";
import { defaultTotalHeight, defaultRightToolBarHeight } from "./constants";

class OrderableList extends Component {
  static gridLayoutToCorrectItems = (layoutItems = [], oldItems = []) => {
    const newItems = [];
    for (let i = 0; i < oldItems.length; ++i) {
      const { y: newIndex } = layoutItems[i];
      newItems[newIndex] = oldItems[i];
    }
    return newItems;
  };
  onLeftItemsChanged = items => {
    const { rightItemsLimitNumber: r } = this.props;
    if (r && this.props.rightItems.length + 1 > r) {
      this.showRightLimitErrorInterval();
    } else {
      this.props.onLeftItemsChanged(items);
    }
  };

  onLeftItemMoved = item => {
    const { rightItemsLimitNumber: r } = this.props;
    if (r && this.props.rightItems.length + 1 > r) {
      this.showRightLimitErrorInterval();
    } else {
      const layoutedRightItems = OrderableList.gridLayoutToCorrectItems(
        this.props.dragAndDropOptions.gridLayout,
        this.props.rightItems
      );
      const updatedRightItems = layoutedRightItems.concat(item);
      this.props.onRightItemsChanged(updatedRightItems);
    }
  };
  onRightItemsChanged = items => {
    this.props.onRightItemsChanged(items);
  };
  onRightItemRemoved = item => {
    this.props.onLeftItemsChanged(this.props.leftItems.concat(item));
  };
  showRightLimitErrorInterval = (intervalMs = 3000) => {
    const { isShowingRightItemsLimitError: s } = this.state;
    if (!s) {
      this.setState({ isShowingRightItemsLimitError: true }, () => {
        setTimeout(() => {
          this.setState({ isShowingRightItemsLimitError: false });
        }, intervalMs);
      });
    }
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <LeftItems
          items={this.props.leftItems}
          // searchProperties={["id", "name"]}
          // title={"title"}
          // renderTitle={() => <div>render title</div>}
          // searchInputPlaceHolder={"placholder...."}
          // renderItem,
          // itemValuePropertyName={"name"}
          {...this.props.leftItemsProps}
          totalHeight={this.props.totalHeight || defaultTotalHeight}
          onItemsChanged={this.onLeftItemsChanged}
          onItemMoved={this.onLeftItemMoved}
        />
        <RightItems
          items={this.props.rightItems}
          // title={"right title"}
          // renderTitle={()=>{}}
          // searchProperties={["id", "name"]}
          // renderTitle={() => <div>render title</div>}
          // searchInputPlaceHolder={"placholder...."}
          // onInputChange={() => alert("on input change")}
          // renderItem,
          // itemValuePropertyName={"name"}
          {...this.props.rightItemsProps}
          renderSelectedToolBar={this.props.renderSelectedToolBar}
          rightToolBarHeight={
            _.isNumber(this.props.rightToolBarHeight)
              ? this.props.rightToolBarHeight
              : defaultRightToolBarHeight
          }
          totalHeight={this.props.totalHeight || defaultTotalHeight}
          onItemsChanged={this.onRightItemsChanged}
          onItemRemoved={this.onRightItemRemoved}
          dragAndDropOptions={this.props.dragAndDropOptions}
        />
      </div>
    );
  }
}

OrderableList.propTypes = {
  leftItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onLeftItemsChanged: PropTypes.func.isRequired,
  leftItemsProps: PropTypes.object, // refer to LeftItems props def
  rightItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRightItemsChanged: PropTypes.func.isRequired,
  rightItemsProps: PropTypes.object, // refer to RightItems props defs,
  totalHeight: PropTypes.number,
  rightToolBarHeight: PropTypes.number,
  renderSelectedToolBar: PropTypes.func, // renderSelectedToolBar={({moveButtonGroup, activeItem, activeItemIndex})=>(<div></div>)}
  dragAndDropOptions: PropTypes.shape({
    isDragAndDropOn: PropTypes.bool.isRequired,
    saveGridLayout: PropTypes.func.isRequired,
    gridLayout: PropTypes.array.isRequired // save layout array
  })
};

OrderableList.defaultPropTypes = {
  leftItemsProps: {},
  rightItemsProps: {},
  dragAndDropOptions: {
    isDragAndDropOn: false,
    saveGridLayout: () => {},
    gridLayout: []
  }
};

export default OrderableList;
// Usage: Drag and drop

export const Usage = class Usage extends Component {
  state = {
    leftItems: [
      { id: 1, name: "name1" },
      { id: 2, name: "name2" },
      { id: 3, name: "name3" }
    ],
    rightItems: [
      { id: 5, name: "name5" },
      { id: 6, name: "name6" },
      { id: 7, name: "name7" },
      { id: 8, name: "name8" },
      { id: 9, name: "name9" }
    ],
    gridLayout: [] // if dragAndDropOptions.isDragAndDropOn is true, this is a must for saving items
  };
  saveRightItems = () => {
    console.log(
      OrderableList.gridLayoutToCorrectItems(
        this.state.gridLayout,
        this.state.rightItems
      )
    );
  };
  render() {
    return (
      <React.Fragment>
        <button onClick={this.saveRightItems}>Save right items</button>
        <OrderableList
          dragAndDropOptions={{
            isDragAndDropOn: true,
            saveGridLayout: layout => {
              this.setState({ gridLayout: layout });
            },
            gridLayout: this.state.gridLayout
          }}
          totalHeight={500}
          rightToolBarHeight={100}
          leftItems={this.state.leftItems}
          onLeftItemsChanged={items => {
            this.setState({ leftItems: items }, () => {
              console.log("on left items changed items", items);
            });
          }}
          leftItemsProps={{
            title: "left title",
            itemValuePropertyName: "name"
          }}
          rightItems={this.state.rightItems}
          onRightItemsChanged={items => {
            this.setState({ rightItems: items }, () => {
              console.log("on right items changed items", items);
            });
          }}
          renderSelectedToolBar={({
            moveButtonGroup,
            activeItem,
            activeItemIndex
          }) => (
            <div style={{ padding: "10px" }}>
              <h2>{activeItem.name}</h2>
              <button
                onClick={() => {
                  this.setState(prevState => ({
                    rightItems: [
                      ...prevState.rightItems.slice(0, activeItemIndex),
                      { ...activeItem, name: Math.random() },
                      ...prevState.rightItems.slice(activeItemIndex + 1)
                    ]
                  }));
                }}
              >
                Change name
              </button>
              {/* {moveButtonGroup} */}
            </div>
          )}
          rightItemsProps={{
            renderTitle: () => (
              <span>Total got {`${this.state.rightItems.length}`}</span>
            ),
            renderItem: (item, index) => (
              <span>
                {/* <span>{`No. ${index + 1}`}</span> */}
                {`id: ${item.id} name: ${item.name}`}
              </span>
            )
          }}
        />
      </React.Fragment>
    );
  }
};
// Usage2:  without drag and drop
export const Usage2 = class Usage2 extends Component {
  state = {
    leftItems: [
      { id: 1, name: "name1" },
      { id: 2, name: "name2" },
      { id: 3, name: "name3" }
    ],
    rightItems: [{ id: 5, name: "name5" }, { id: 6, name: "name6" }],
    layout: [] // if turn on drag and drop, state.layout is a must.
  };
  render() {
    return (
      <OrderableList
        // dragAndDropOptions={{
        //   isDragAndDropOn: false,
        //   saveGridLayout: layout => {
        //     this.setState({ layout });
        //   }
        // }}
        totalHeight={500}
        rightToolBarHeight={200}
        leftItems={this.state.leftItems}
        onLeftItemsChanged={items => {
          this.setState({ leftItems: items }, () => {
            console.log("on left items changed items", items);
          });
        }}
        leftItemsProps={{ title: "left title", itemValuePropertyName: "name" }}
        rightItems={this.state.rightItems}
        rightItemsLimitNumber={2}
        onRightItemsChanged={items => {
          this.setState({ rightItems: items }, () => {
            console.log("on right items changed items", items);
          });
        }}
        renderSelectedToolBar={({
          moveButtonGroup,
          activeItem,
          activeItemIndex
        }) => (
          <div style={{ padding: "10px" }}>
            <h2>{activeItem.name}</h2>
            <button
              onClick={() => {
                this.setState(prevState => ({
                  rightItems: [
                    ...prevState.rightItems.slice(0, activeItemIndex),
                    { ...activeItem, name: Math.random() },
                    ...prevState.rightItems.slice(activeItemIndex + 1)
                  ]
                }));
              }}
            >
              Change name
            </button>
            {moveButtonGroup}
          </div>
        )}
        rightItemsProps={{
          renderTitle: () => (
            <span>Total got {`${this.state.rightItems.length}`}</span>
          ),
          renderItem: (item, index) => (
            <span>
              <span>{`No. ${index + 1}`}</span>
              {`@_@ ${item.id} ${item.name} @_@`}
            </span>
          )
        }}
      />
    );
  }
};

// Usage 3 : fixed inline Dropdown style problem and No RightToolBar

const friendOptions = [
  {
    text: "Jenny Hess",
    value: 1,
    image: { avatar: true, src: "https://via.placeholder.com/150" }
  },
  {
    text: "Jenny Hess2",
    value: 2,
    image: { avatar: true, src: "https://via.placeholder.com/150" }
  },
  {
    text: "Jenny Hess3",
    value: 3,
    image: { avatar: true, src: "https://via.placeholder.com/150" }
  }
];
export const Usage3 = class Usage3 extends Component {
  state = {
    dropdowns: [],
    dropdownValue: 1,
    leftItems: [
      { id: 1, name: "name1" },
      { id: 2, name: "name2" },
      { id: 3, name: "name3" }
    ],
    rightItems: [
      { id: 5, name: "name5" },
      { id: 6, name: "name6" },
      { id: 7, name: "name7" },
      { id: 8, name: "name8" },
      { id: 9, name: "name9" }
    ],
    gridLayout: [] // if dragAndDropOptions.isDragAndDropOn is true, this is a must for saving items
  };
  saveRightItems = () => {
    console.log(
      OrderableList.gridLayoutToCorrectItems(
        this.state.gridLayout,
        this.state.rightItems
      )
    );
  };
  render() {
    return (
      <React.Fragment>
        <button onClick={this.saveRightItems}>Save right items</button>
        <OrderableList
          dragAndDropOptions={{
            isDragAndDropOn: true,
            saveGridLayout: layout => {
              this.setState({ gridLayout: layout });
            },
            gridLayout: this.state.gridLayout
          }}
          totalHeight={500}
          rightToolBarHeight={0}
          leftItems={this.state.leftItems}
          onLeftItemsChanged={items => {
            this.setState({ leftItems: items }, () => {
              console.log("on left items changed items", items);
            });
          }}
          leftItemsProps={{
            title: "left title",
            itemValuePropertyName: "name"
          }}
          rightItems={this.state.rightItems}
          onRightItemsChanged={items => {
            this.setState({ rightItems: items }, () => {
              console.log("on right items changed items", items);
            });
          }}
          renderSelectedToolBar={({
            moveButtonGroup,
            activeItem,
            activeItemIndex
          }) => null}
          rightItemsProps={{
            renderTitle: () => (
              <span>Total got {`${this.state.rightItems.length}`}</span>
            ),
            renderItem: (item, index) => (
              <span>
                <Ref
                  innerRef={ref => {
                    if (ref) {
                      this.state.dropdowns[index] = ref;
                    }
                  }}
                >
                  {/* <span>{`No. ${index + 1}`}</span> */}
                  <Dropdown
                    upward={false}
                    inline
                    onOpen={() => {
                      this.state.dropdowns[index].closest(
                        "div.react-grid-item"
                      ).style.zIndex = 3;
                    }}
                    onClose={() => {
                      this.state.dropdowns[index].closest(
                        "div.react-grid-item"
                      ).style.zIndex = 0;
                    }}
                    item
                    options={friendOptions}
                    value={this.state.dropdownValue}
                    onChange={(e, { value }) => {
                      this.setState({ dropdownValue: value });
                    }}
                  />
                </Ref>
                {`id: ${item.id} name: ${item.name}`}
              </span>
            )
          }}
        />
      </React.Fragment>
    );
  }
};
