import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Icon,
  Label,
  Menu,
  Table,
  Message,
  Segment,
  Input
} from "semantic-ui-react";
import _ from "lodash";
import styles from "../css/PaginationTable.css";
import LazyInput from "./LazyInput";
import { filterByMultiProperties, uuid } from "./utils";

const SortingIcon = ({ asc = false }) =>
  asc ? <Icon name={"caret down"} /> : <Icon name={"caret up"} />;

class PaginationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      sorting: {
        currentSortingFields: this.props.initSortingFields,
        asc: this.props.initSortingOrderAsc
      },
      searchBarText: "",
      accordionViewExpandedUuids: []
    };
    if (!!this.props.accordionRowRender && props.items) {
      props.items.forEach((item, index) => {
        item.uuid = uuid();
        return item;
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentPage &&
      nextProps.currentPage !== this.props.currentPage
    ) {
      this.setState({
        currentPage: nextProps.currentPage
      });
    }

    if (!!this.props.accordionRowRender) {
      if (nextProps.items !== this.props.items) {
        nextProps.items.forEach((item, index) => (item.uuid = uuid()));
      }
    }
  }
  // componentDidUpdate() {
  //   /**
  //    * scoll to table row by pid
  //    * projects/progress/:pid
  //    */
  //   this.props.items.some((item) => {
  //     if (item.isTargetItem) {
  //       const elem = document.getElementById(`project_${item._id}`);
  //       if (elem) {
  //         elem.scrollIntoView(true);
  //         window.scrollBy(0, -100);
  //       }
  //       return true;
  //     }
  //   });
  // }
  paginate = (items = []) => {
    const { itemsPerPage } = this.props;
    const { currentPage } = this.state;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  hasSearchKeys = () => this.props.searchKeyProperties.length > 0;
  onSearchBarTextChange = value => this.setState({ searchBarText: value });

  totalPageNum = () => {
    const { itemsPerPage, isImmutable } = this.props;
    let { items } = this.props;
    if (this.hasSearchKeys) {
      items = filterByMultiProperties(
        items,
        this.state.searchBarText,
        this.props.searchKeyProperties
      );
    }
    return Math.ceil((isImmutable ? items.size : items.length) / itemsPerPage);
  };
  pageNumArray = () => {
    const pageNumArray = [];
    for (let i = 0; i < this.totalPageNum(); ++i) {
      pageNumArray.push(i + 1);
    }
    return pageNumArray;
  };

  nextPage = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1
    }));
  };
  prevPage = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage - 1
    }));
  };
  selectPage = pageNum => {
    this.setState({
      currentPage: pageNum
    });
  };
  hasNextPage = () => this.state.currentPage + 1 <= this.totalPageNum();
  hasPrevPage = () => this.state.currentPage - 1 >= 1;

  render() {
    const {
      currentPage,
      columnOption,
      pagination,
      searchKeyProperties,
      itemsPerPage,
      isImmutable,
      initSortingFields,
      initSortingOrderAsc,
      accordionRowRender,
      customSearchFilterCreator,
      searchBarPlaceholder,
      items,
      ...props
    } = this.props;
    let showingItems = items;
    const { searchBarText, accordionViewExpandedUuids } = this.state;
    const { currentSortingFields, asc } = this.state.sorting;

    if (currentSortingFields) {
      showingItems = _.orderBy(showingItems, currentSortingFields.join("."), [
        asc ? "asc" : "desc"
      ]);
    }
    if (typeof searchBarText === "string" && searchBarText.trim().length > 0) {
      showingItems = this.hasSearchKeys()
        ? (showingItems = filterByMultiProperties(
            showingItems,
            searchBarText,
            searchKeyProperties,
            !!customSearchFilterCreator &&
              customSearchFilterCreator(searchBarText)
          ))
        : showingItems;
    }

    showingItems = pagination ? this.paginate(showingItems) : showingItems;

    const SearchBar = this.hasSearchKeys() && (
      <LazyInput
        as={Input}
        onChange={this.onSearchBarTextChange}
        icon="search"
        iconPosition="left"
        // label={"Search"}
        fluid
        placeholder={
          searchBarPlaceholder || `Search ${searchKeyProperties.join(", ")} ...`
        }
        value={this.state.searchBarText}
      />
    );

    const TableEle = (
      <React.Fragment>
        <Table unstackable style={{ margin: "0.5px 0" }} {...props}>
          <Table.Header>
            <Table.Row>
              {columnOption.map((c, i) => (
                <Table.HeaderCell
                  style={{ cursor: c.sortingFields ? "pointer" : "init" }}
                  onClick={() => {
                    if (!isImmutable && c.sortingFields) {
                      this.setState(prevState => ({
                        sorting: {
                          ...prevState.sorting,
                          currentSortingFields: [...c.sortingFields],
                          asc: !prevState.sorting.asc
                        }
                      }));
                    }
                  }}
                  key={i}
                  {..._.get(c, "headerCellProps", {})}
                >
                  {c.header || ""}
                  {!isImmutable &&
                    c &&
                    c.sortingFields &&
                    _.isEqual(c.sortingFields, currentSortingFields) && (
                      <SortingIcon asc={this.state.sorting.asc} />
                    )}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          {showingItems.length > 0 && (
            <Table.Body>
              {showingItems.map((item, i) => (
                <React.Fragment key={i}>
                  <Table.Row
                    // styleName={item.isTargetItem ? "background-fadeout" : ""}
                    // id={`project_${item._id}`}
                    // positive={!!item.isTargetItem}
                    // key={i}
                    active={
                      accordionRowRender &&
                      accordionViewExpandedUuids.includes(item.uuid)
                    }
                  >
                    {columnOption.map((c, ii) => (
                      <Table.Cell
                        key={ii}
                        style={{ cursor: c.onItemClick ? "pointer" : "auto" }}
                        onClick={() => {
                          if (c.onItemClick) {
                            c.onItemClick(item);
                          }
                          if (accordionRowRender && ii === 0) {
                            if (
                              accordionViewExpandedUuids.includes(item.uuid)
                            ) {
                              this.setState({
                                accordionViewExpandedUuids: accordionViewExpandedUuids.filter(
                                  id => id !== item.uuid
                                )
                              });
                            } else {
                              this.setState({
                                accordionViewExpandedUuids: [
                                  ...accordionViewExpandedUuids,
                                  item.uuid
                                ]
                              });
                            }
                          }
                        }}
                      >
                        {ii === 0 && accordionRowRender ? (
                          accordionViewExpandedUuids.includes(item.uuid) ? (
                            <Icon name={"caret down"} />
                          ) : (
                            <Icon name={"caret right"} />
                          )
                        ) : null}

                        {typeof c.cellValue === "string"
                          ? isImmutable
                            ? item.get(c.cellValue)
                            : item[c.cellValue]
                          : c.cellValue(item)}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                  {accordionRowRender &&
                    accordionViewExpandedUuids.includes(item.uuid) && (
                      <Table.Row>
                        <Table.Cell colSpan={columnOption.length}>
                          {accordionRowRender(item)}
                        </Table.Cell>
                      </Table.Row>
                    )}
                </React.Fragment>
              ))}
            </Table.Body>
          )}
        </Table>

        {showingItems.length === 0 && (
          <Segment style={{ margin: 0 }}>
            {searchBarText ? (
              <Message warning>
                {`No result found for query "${searchBarText}"`}
              </Message>
            ) : (
              <Message>{`No items to display`}</Message>
            )}
          </Segment>
        )}
      </React.Fragment>
    );

    const PaginationBar =
      pagination &&
      (showingItems.length > 0 ? (
        <div style={{ display: "flex" }}>
          <Menu pagination style={{ margin: "0 auto" }}>
            <Menu.Item
              as="a"
              icon
              onClick={this.prevPage}
              disabled={!this.hasPrevPage()}
            >
              <Icon name="chevron left" />
            </Menu.Item>
            {this.pageNumArray().map((num, i) => (
              <Menu.Item
                as="a"
                key={i}
                onClick={() => {
                  this.selectPage(num);
                }}
                active={num === this.state.currentPage}
              >
                {num}
              </Menu.Item>
            ))}
            <Menu.Item
              as="a"
              icon
              onClick={this.nextPage}
              disabled={!this.hasNextPage()}
            >
              <Icon name="chevron right" />
            </Menu.Item>
          </Menu>
        </div>
      ) : null);
    return typeof this.props.children === "function" ? (
      this.props.children({ SearchBar, TableEle, PaginationBar })
    ) : (
      <React.Fragment>
        {SearchBar}
        {TableEle}
        {PaginationBar}
      </React.Fragment>
    );
  }
}
PaginationTable.propTypes = {
  columnOption: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string,
      cellValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      onItemClick: PropTypes.func,
      sortingFields: PropTypes.arrayOf(PropTypes.string),
      headerCellProps: PropTypes.object
    })
  ),
  items: PropTypes.any,
  itemsPerPage: PropTypes.number,
  pagination: PropTypes.bool,
  isImmutable: PropTypes.bool,
  currentPage: PropTypes.number,
  initSortingFields: PropTypes.arrayOf(PropTypes.string),
  initSortingOrderAsc: PropTypes.bool,
  searchKeyProperties: PropTypes.arrayOf(PropTypes.string),
  accordionRow: PropTypes.func,
  customSearchFilterCreator: PropTypes.func, //customSearchFilterCreator(searchBarText) expected return a typical Array.filter function
  searchBarPlaceholder: PropTypes.string
};
PaginationTable.defaultProps = {
  itemsPerPage: 10,
  pagination: false,
  isImmutable: false,
  initSortingFields: [],
  initSortingOrderAsc: true,
  searchKeyProperties: []
};
export default PaginationTable;

// Usage is an example on how to PaginationTable component.
export const Usage = () => (
  <PaginationTable
    items={[
      {
        id: 1,
        name: "test-item-1 ???",
        nestedSortingTestProps: {
          s: 5
        }
      },
      {
        id: 2,
        name: "test-item-2",
        nestedSortingTestProps: {
          s: 3
        }
      },
      {
        id: 3,
        name: "test-item-3",
        nestedSortingTestProps: {
          s: 2
        }
      }
    ]}
    columnOption={[
      {
        header: "idHeader",
        cellValue: "id",
        onItemClick: item => {
          console.log(`onClick qq ${item.id} `);
        },
        sortingFields: ["id"]
      },
      {
        header: "Name~",
        cellValue: item =>
          `*custom text cannot be searched* property can item.name => ${
            item.name
          } `,
        onItemClick: item => {
          alert(item.name);
        },
        sortingFields: ["name"]
      },
      {
        header: "NestingSortTest~",
        cellValue: item => item.nestedSortingTestProps.s,
        sortingFields: ["nestedSortingTestProps", "s"]
      }
    ]}
    initSortingFields={["id"]}
    initSortingOrderAsc={false}
    pagination
    itemsPerPage={5}
    searchKeyProperties={["id", "name"]}
  />
);

//Usage2 render props example
export const Usage2 = () => (
  <PaginationTable
    items={[
      {
        id: 1,
        name: "test-item-1 ???"
      },
      {
        id: 2,
        name: "test-item-2"
      },
      {
        id: 3,
        name: "test-item-3"
      }
    ]}
    columnOption={[
      {
        header: "idHeader",
        cellValue: "id",
        onItemClick: item => {
          alert(item.id);
        },
        sortingFields: ["id"]
      },
      {
        header: "Name~",
        cellValue: item =>
          `*custom text cannot be searched* property can item.name => ${
            item.name
          } `,
        onItemClick: item => {
          alert(item.name);
        },
        sortingFields: ["name"]
      }
    ]}
    initSortingFields={["id"]}
    initSortingOrderAsc={false}
    pagination
    itemsPerPage={2}
    searchKeyProperties={["id", "name"]}
  >
    {({ SearchBar, TableEle, PaginationBar }) => (
      <div>
        {PaginationBar}
        {SearchBar}
        {TableEle}
      </div>
    )}
  </PaginationTable>
);

// Usages3 accordionRowRender example
export const Usage3 = () => (
  <PaginationTable
    items={[
      {
        id: 1,
        name: "item name 1"
      },
      {
        id: 2,
        name: "item name 2"
      },
      {
        id: 3,
        name: "item name 3"
      }
    ]}
    columnOption={[
      {
        header: "idHeader",
        cellValue: "id",
        onItemClick: item => {
          console.log(`PaginationTableUsage3 onItemClick ${item.id}`);
        },
        sortingFields: ["id"]
      },
      {
        header: "Name~",
        cellValue: item =>
          `*custom text cannot be searched* property can item.name => ${
            item.name
          } `,
        sortingFields: ["name"]
      }
    ]}
    initSortingFields={["id"]}
    initSortingOrderAsc={false}
    pagination
    itemsPerPage={2}
    searchKeyProperties={["id", "name"]}
    accordionRowRender={item => (
      <div style={{ border: "red solid 2px " }}>
        item id : {item.id} render anything over here
      </div>
    )}
  >
    {({ SearchBar, TableEle, PaginationBar }) => (
      <div>
        {PaginationBar}
        {SearchBar}
        {TableEle}
      </div>
    )}
  </PaginationTable>
);

// Usages4 customSearchFilterCreator & accordionRowRender example
export const Usage4 = () => {
  const indexNameMap = {
    1: "nestedIndex ohoh index 1 name",
    2: "nestedIndex nono index 2 name",
    3: "nestedIndex yaya index 3 name"
  };
  return (
    <PaginationTable
      items={[
        {
          id: 1,
          name: "item name 1",
          nestedIndexCollections: {
            c1: [1],
            c2: [2]
          }
        },
        {
          id: 2,
          name: "item name 2",
          nestedIndexCollections: {
            c1: [2],
            c2: [3]
          }
        },
        {
          id: 3,
          name: "item name 3",
          nestedIndexCollections: {
            c1: [1, 3],
            c2: [2]
          }
        }
      ]}
      columnOption={[
        {
          header: "idHeader",
          cellValue: "id",
          onItemClick: item => {
            console.log(`PaginationTableUsage3 onItemClick ${item.id}`);
          },
          sortingFields: ["id"],
          headerCellProps: {
            width: 5
          }
        },
        {
          header: "Name~",
          cellValue: item =>
            `*custom text cannot be searched* property can item.name => ${
              item.name
            } `,
          sortingFields: ["name"]
        }
      ]}
      initSortingFields={["id"]}
      initSortingOrderAsc={false}
      pagination
      itemsPerPage={2}
      searchKeyProperties={["id", "name"]}
      accordionRowRender={item => (
        <div style={{ border: "yellow solid 2px " }}>
          <h3>{"item.nestedIndexCollections.c1"}</h3>
          <ol>
            {_.get(item, "nestedIndexCollections.c1", []).map((i, ii) => (
              <li key={ii}>{indexNameMap[i]}</li>
            ))}
          </ol>
          <h4>{"item.nestedIndexCollections.c2"}</h4>
          <ol>
            {_.get(item, "nestedIndexCollections.c2", []).map((i, ii) => (
              <li key={ii}>{indexNameMap[i]}</li>
            ))}
          </ol>
        </div>
      )}
      customSearchFilterCreator={keyword => item => {
        console.log(`customSearchFilterCreator item`, item);
        if (keyword) {
          return _.get(item, "nestedIndexCollections.c1", []).some(index =>
            new RegExp(_.escapeRegExp(keyword), "ig").test(indexNameMap[index])
          );
        }
        return false;
      }}
      searchBarPlaceholder={`Search by collection name, id, name.....`}
    >
      {({ SearchBar, TableEle, PaginationBar }) => (
        <div>
          {PaginationBar}
          {SearchBar}
          {TableEle}
        </div>
      )}
    </PaginationTable>
  );
};
