import React from "react";
import PropTypes from "prop-types";
import Griddle, {
  plugins,
  RowDefinition,
  ColumnDefinition
} from "griddle-react";
import { Icon } from "semantic-ui-react";

const palette = ["#6AA744", "#014358", "#F47421", "#FEE111", "#A6CE39"];
// customize griddle grid by Griddle React doc: https://griddlegriddle.github.io/Griddle/docs/customization/

const styleConfig = {
  styles: {
    Table: { width: "100%" },
    Pagination: { marginTop: "10px", float: "right" }
  }
};
const NewLayout = ({ Table, Pagination, Filter, SettingsWrapper }) => (
  <div>
    {/* <Filter /> */}
    <Table style={{ width: "100%" }} />
    <Pagination />
  </div>
);

/**
 *
 * @param {*} data immutable data
 * @param {*} column
 * @param {*} sortAscending
 */
const sortByMethod = (data, column, sortAscending = true) =>
  data.sort((original, newRecord) => {
    if (column === "name") {
      original = (!!original.get(column) && original.get(column)) || "";
      newRecord = (!!newRecord.get(column) && newRecord.get(column)) || "";
    } else {
      // other columns are group0, group1 ... group4
      original =
        (!!original.getIn([column, "percentage"]) &&
          original.getIn([column, "percentage"])) ||
        "";
      newRecord =
        (!!newRecord.getIn([column, "percentage"]) &&
          newRecord.getIn([column, "percentage"])) ||
        "";
    }

    if (original === newRecord) {
      return 0;
    } else if (original > newRecord) {
      return sortAscending ? 1 : -1;
    }
    return sortAscending ? -1 : 1;
  });

const customGroupComponentCreator = i => ({ value }) => {
  if (value && typeof value.count === "function") {
    value = value.toJS();
    return (
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, textAlign: "right", paddingRight: "10px" }}>
          {value.count}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: palette[i] || "blue",
              width: `${value.percentage}%`,
              height: "100%",
              textAlign: "right",
              fontSize: "0.8rem"
            }}
          >
            <span
              style={{ color: "black", position: "absolute" }}
            >{`${value.percentage.toFixed(1)}%`}</span>
          </div>
        </div>
      </div>
    );
  }
};
// const orderColumnWidth = 5;
const nameColumnWidth = 30;
const groupsColumnWidth = 70;

// custom striped table row
// https://github.com/GriddleGriddle/Griddle/issues/641#issuecomment-294674414
const stripedRowClassName = "striped-table-row";
const css = `
    tr:nth-child(even).${stripedRowClassName}{
      background-color: #f7f7f7;
    }
    `;
const PaginatedTableChart = ({
  data,
  title,
  groupNames = [],
  pageSize = 10,
  ...restProps
}) => {
  return (
    <div>
      <style>{css}</style>
      <h2>{title || "Paginated table chart"}</h2>
      <Griddle
        data={data}
        plugins={[plugins.LocalPlugin]}
        pageProperties={{
          pageSize
        }}
        components={{
          Layout: NewLayout,
          NoResults: () => <div>No Data Found.</div>,
          PageDropdown: ({ currentPage, maxPages }) => (
            <div style={{ color: "gray", display: "inline" }}>
              {currentPage} / {maxPages === 0 ? "1" : maxPages}
            </div>
          ),
          PreviousButton: ({ hasPrevious, onClick }) => (
            <Icon
              style={{ cursor: hasPrevious ? "pointer" : "inherit" }}
              disabled={!hasPrevious}
              name={"angle left"}
              onClick={e => {
                if (hasPrevious) {
                  onClick(e);
                }
              }}
            />
          ),
          NextButton: ({ hasNext, onClick }) => (
            <Icon
              style={{ cursor: hasNext ? "pointer" : "inherit" }}
              disabled={!hasNext}
              name={"angle right"}
              onClick={e => {
                if (hasNext) {
                  onClick(e);
                }
              }}
            />
          )
        }}
        styleConfig={styleConfig}
        sortMethod={sortByMethod}
      >
        <RowDefinition cssClassName={stripedRowClassName}>
          <ColumnDefinition
            id="name"
            title="label"
            width={`${nameColumnWidth}%`}
          />
          {groupNames.map((gName, i) => (
            <ColumnDefinition
              key={i}
              id={`group${i}`}
              customComponent={customGroupComponentCreator(i)}
              width={`${groupsColumnWidth / groupNames.length}%`}
              title={groupNames[i]}
            />
          ))}
        </RowDefinition>
      </Griddle>
    </div>
  );
};

PaginatedTableChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      group0: PropTypes.shape({
        count: PropTypes.number,
        percentage: PropTypes.number
      }),
      group1: PropTypes.shape({
        count: PropTypes.number,
        percentage: PropTypes.number
      }),
      group2: PropTypes.shape({
        count: PropTypes.number,
        percentage: PropTypes.number
      })
      // until groupX ...
    })
  ),
  title: PropTypes.string,
  groupNames: PropTypes.array,
  pageSize: PropTypes.number
};

export default PaginatedTableChart;

const sampleData = JSON.parse(
  `[{"name":"College & Scholarships","group0":{"count":9145,"percentage":31.847466480933313},"group1":{"count":36,"percentage":0.754084625052367},"group2":{"count":9006,"percentage":34.07233656174334}},{"name":"Financial Aid","group0":{"count":7587,"percentage":26.421730802716347},"group1":{"count":816,"percentage":17.09258483452032},"group2":{"count":9062,"percentage":34.284200968523}},{"name":"Career Planning","group0":{"count":6787,"percentage":23.635730454466305},"group1":{"count":911,"percentage":19.082530372852954},"group2":{"count":1215,"percentage":4.5967009685230025}},{"name":"Telecommuting","group0":{"count":5196,"percentage":18.09507226188403},"group1":{"count":3011,"percentage":63.07080016757436},"group2":{"count":7149,"percentage":27.046761501210653}}]`
);

export const Usage = class Usage extends React.Component {
  render() {
    return (
      <PaginatedTableChart
        title={"Title ya"}
        data={sampleData}
        groupNames={["name1", "name2", "name3"]}
        pageSize={2}
      />
    );
  }
};
