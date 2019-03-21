import React, { Component } from 'react';
import { render } from 'react-dom';

import {
  OrderableListUsage,
  OrderableListUsage2,
  OrderableListUsage3,
  RenderModalUsage,
  BlurOverlayUsage,
  EditableTextUsage,
  EditableTextUsage2,
  LazyInputUsage,
  LazyInputUsage2,
  LoadingSpanUsage,
  PaginationTableUsage,
  PaginationTableUsage2,
  PaginationTableUsage3,
  PaginationTableUsage4,
  PlaceSearchUsage,
  AvatarUsage,
} from '../../src';

const MyDiv = ({ children, title }) => (
  <div style={{ border: '2px solid black', padding: '10px', margin: '10px' }}>
    {title && <h2>{title}</h2>}
    {children}
  </div>
);

class Demo extends Component {
  state = { loading: false };

  handleToggleLoading = () => {
    this.setState({ loading: !this.state.loading });
  };

  render() {
    return (
      <div>
        <MyDiv title={'AvatarUpload'}>
          <AvatarUsage />
        </MyDiv>
        <MyDiv title={'OrderableListUsage'}>
          <OrderableListUsage />
        </MyDiv>

        <MyDiv title={'OrderableListUsage2'}>
          <OrderableListUsage2 />
        </MyDiv>

        <MyDiv title={'OrderableListUsage3'}>
          <OrderableListUsage3 />
        </MyDiv>

        <MyDiv title={'RenderModalUsage'}>
          <RenderModalUsage />
        </MyDiv>

        <MyDiv title={'BlurOverlayUsage'}>
          <BlurOverlayUsage />
        </MyDiv>

        <MyDiv title={'EditableTextUsage'}>
          <EditableTextUsage />
        </MyDiv>

        <MyDiv title={'EditableTextUsage2'}>
          <EditableTextUsage2 />
        </MyDiv>

        <MyDiv title={'LazyInputUsage'}>
          <LazyInputUsage />
        </MyDiv>
        <MyDiv title={'LazyInputUsage2'}>
          <LazyInputUsage2 />
        </MyDiv>

        <MyDiv title={'LoadingSpanUsage'}>
          <LoadingSpanUsage />
        </MyDiv>

        <MyDiv title={'PaginationTableUsage'}>
          <PaginationTableUsage />
        </MyDiv>

        <MyDiv title={'PaginationTableUsage2'}>
          <PaginationTableUsage2 />
        </MyDiv>

        <MyDiv title={'PaginationTableUsage3'}>
          <PaginationTableUsage3 />
        </MyDiv>

        <MyDiv title={'PaginationTableUsage4'}>
          <PaginationTableUsage4 />
        </MyDiv>

        <MyDiv title={'PlaceSearchUsage'}>
          <PlaceSearchUsage />
        </MyDiv>
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));

const appendCssOnHead = () => {
  var cssId = 'myCss'; // you could encode the css path itself to generate id..
  if (!document.getElementById(cssId)) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href =
      '//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css';
    link.media = 'all';
    head.appendChild(link);
  }
};
appendCssOnHead();
