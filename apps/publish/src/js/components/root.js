import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Mousetrap from 'mousetrap';
import classnames from 'classnames';
import _ from 'lodash';

import { api } from '/api';
import { store } from '/store';
import { Skeleton } from '/components/skeleton';
import { Sidebar } from '/components/sidebar';
import { CollectionList } from '/components/collection-list';
import { Recent } from '/components/recent';
import { Header } from '/components/header';

export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;

    console.log("root.state", this.state);

    store.setStateHandler(this.setState.bind(this));
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Header {...this.state} />
          <Route exact path="/~publish/recent"
            render={ (props) => {
              return (
                  <div className="fl w-100">
                    <Recent
                      {...this.state}
                    />
                  </div>
              );
           }} />
          <Route exact path="/~publish/subs"
            render={ (props) => {
              return (
                  <div className="fl w-100">
                    <Recent
                      {...this.state}
                    />
                  </div>
              );
           }} />
          <Route exact path="/~publish/pubs"
            render={ (props) => {
              return (
                  <div className="fl w-100">
                    <Recent
                      {...this.state}
                    />
                  </div>
              );
           }} />

          <Route exact path="/~publish/:ship/:blog"
            render={ (props) => {
              return (
                <div>
                  blog page
                </div>
              );
           }} />

          <Route exact path="/~publish/:ship/:blog/:post"
            render={ (props) => {
              return (
                <div>
                  post page
                </div>
              );
           }} />
        </BrowserRouter>
      </div>
    );
  }
}

