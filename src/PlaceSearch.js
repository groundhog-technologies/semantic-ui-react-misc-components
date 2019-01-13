import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import request from "axios";
import ClickOutside from "react-click-outside";

import {
  Search,
  Loader,
  Label,
  Grid,
  Header,
  Segment
} from "semantic-ui-react";

const constants = {
  needApiDataFieldsObj: {
    place_id: "place_id",
    display_name: "display_name",
    lat: "lat",
    lon: "lon"
  },
  searchMoreId: "search_more",
  noMoreId: "no_more"
};

export default class PlaceSearch extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    keyword: "",
    lastSearchedKeyword: "",
    isResultOpen: false,
    isNoMoreSearch: false,
    isLoading: false,
    results: []
  };
  componentWillMount() {
    this.resetComponent();
  }

  getSearchResults = _.throttle(
    async (keyword = "", exclude_place_ids = "") => {
      if (keyword.length === 0) {
        return [];
      }
      const url = `https://nominatim.openstreetmap.org/search.php?format=json&polygon=1&countrycodes=${
        this.props.countryCodes
      }&q=${keyword}&exclude_place_ids=${exclude_place_ids}`;
      this.setState({
        isLoading: true,
        lastSearchedKeyword: keyword,
        isNoMore: false
      });
      const res = await request.get(url);
      this.setState({ isLoading: false });
      const results = _.get(res, "data", []);
      if (results.length === 0 && this.state.lastSearchedKeyword === keyword) {
        this.setState({ isNoMore: true });
        return [];
      }
      const pickedResults = _.map(results, r =>
        _.pick(r, [...Object.values(constants.needApiDataFieldsObj)])
      );
      return pickedResults;
    },
    500
  );

  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      keyword: "",
      isResultOpen: false
    });

  searchMore = async result => {
    // return;
    const placeId = _.get(result, `${constants.needApiDataFieldsObj.place_id}`);

    if (placeId === constants.searchMoreId) {
      try {
        const excludePlaceIds = _.get(this.state, "results", []).map(r =>
          _.get(r, "place_id")
        );
        const newResults = await this.getSearchResults(
          this.state.keyword,
          excludePlaceIds.join(",")
        );
        this.setState({ results: [...this.state.results, ...newResults] });
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  handleSearchChange = async (e, { value }) => {
    this.setState({ keyword: value });
    const results = await this.getSearchResults(value);
    this.setState({
      isResultOpen: true,
      isLoading: false,
      results: value.length === 0 ? [] : results
    });
  };
  fixResults = (results = []) => {
    // semantic needs title field in results
    return _.map(results, r => ({
      ...r,
      title: `${Math.random()}`
    }));
  };

  addSearchMore = (results = []) => {
    const { isNoMore = false, keyword = "" } = this.state;

    if (keyword && results.length > 0) {
      return [
        ...results,
        {
          [constants.needApiDataFieldsObj.place_id]: isNoMore
            ? constants.noMoreId
            : constants.searchMoreId,
          [constants.needApiDataFieldsObj.display_name]: isNoMore
            ? "No More Results"
            : "Search More"
        }
      ];
    }

    return results;
  };
  addResultRenderer = (results = []) => {
    return results.map(r => ({
      ...r,
      renderer: result => {
        const { isLoading = false } = this.state;
        const isSearchMoreItem =
          _.get(result, constants.needApiDataFieldsObj.place_id) ===
          constants.searchMoreId;
        const displayName = _.get(
          result,
          constants.needApiDataFieldsObj.display_name,
          ""
        );
        return (
          <div
            onClick={() => {
              this.onResultSelect(result);
            }}
          >
            {isSearchMoreItem ? (
              isLoading ? (
                <span>
                  Loading...
                  <Loader active={this.state.isLoading} inline size={"mini"} />
                </span>
              ) : (
                displayName
              )
            ) : (
              displayName
            )}
          </div>
        );
      },
      onClick: () => {}
    }));
  };
  onResultSelect = result => {
    const resultPlaceId = _.get(
      result,
      constants.needApiDataFieldsObj.place_id
    );
    const isSearchMoreItem = resultPlaceId === constants.searchMoreId;
    const isNoMoreItem = resultPlaceId === constants.noMoreId;
    if (isSearchMoreItem) {
      this.searchMore(result);
    }
    if (this.props.onResultSelect) {
      return this.props.onResultSelect(
        result,
        this.setIsResultOpen,
        isSearchMoreItem,
        isNoMoreItem
      );
    }
  };
  setIsResultOpen = (bool = false) => {
    this.setState({ isResultOpen: bool });
  };
  onClickOutside = () => {
    if (this.state.isResultOpen) {
      this.setIsResultOpen(false);
    }
  };
  onFocus = () => {
    if (!this.state.isResultOpen) {
      this.setIsResultOpen(true);
    }
  };

  render() {
    const {
      size = "big",
      countryCodes,
      onResultSelect,
      ...otherProps
    } = this.props;
    const {
      isLoading = false,
      keyword = "",
      results = [],
      isResultOpen = false
    } = this.state;

    const patchedResults = _.flow([
      this.addSearchMore,
      this.fixResults,
      this.addResultRenderer
    ])(results);

    return (
      <ClickOutside onClickOutside={this.onClickOutside}>
        <Search
          size={size}
          loading={isLoading}
          onFocus={this.onFocus}
          // onResultSelect={this.onResultSelect}
          onSearchChange={this.handleSearchChange}
          results={patchedResults}
          value={keyword}
          open={isResultOpen}
          {...otherProps}
        />
      </ClickOutside>
    );
  }
}

PlaceSearch.propTypes = {
  //acceptLanguage, currently will base on browser http header, https://wiki.openstreetmap.org/wiki/Nominatim => parameter
  countryCodes: PropTypes.string,
  size: PropTypes.string, //mini, tiny, small, large, big, huge, massive
  onResultSelect: PropTypes.func.isRequired //(result, setIsResultOpen, isSearchMoreItem, isNoMoreItem)=>{}
};
PlaceSearch.defaultProps = {
  countryCodes: "TW", // coulde be multiple, "TW,US"https://wiki.openstreetmap.org/wiki/Nominatim/Country_Codes
  size: "big"
};

export const Usage = () => (
  <PlaceSearch
    size={"big"}
    countryCodes={"TW,US"}
    onResultSelect={(
      result,
      setIsResultOpen,
      isSearchMoreItem,
      isNoMoreItem
    ) => {
      console.log("result", result);
      if (isNoMoreItem) {
        setIsResultOpen(false);
      } else {
        //...
      }
    }}
  />
);
