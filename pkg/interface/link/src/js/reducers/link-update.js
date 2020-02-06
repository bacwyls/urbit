import _ from 'lodash';

const PAGE_SIZE = 25;

export class LinkUpdateReducer {
  reduce(json, state) {
    this.submissionsPage(json, state);
    this.submissionsUpdate(json, state);
    this.discussionsPage(json, state);
    this.discussionsUpdate(json, state);
  }

  submissionsPage(json, state) {
    let data = _.get(json, 'initial-submissions', false);
    if (data) {
      //  { "initial-submissions": {
      //    "/~ship/group": {
      //      page: [{ship, timestamp, title, url}]
      //      page-number: 0
      //      total-items: 1
      //      total-pages: 1
      //    }
      //  } }

      for (var path of Object.keys(data)) {
        const here = data[path];
        const page = "page" + here.pageNumber;

        // if we didn't have any state for this path yet, initialize.
        if (!state.links[path]) {
          state.links[path] = {};
        }

        // since data contains an up-to-date full version of the page,
        // we can safely overwrite the one in state.
        state.links[path][page] = here.page;
        state.links[path].totalPages = here.totalPages;
        state.links[path].totalItems = here.totalItems;
      }
    }
  }

  submissionsUpdate(json, state) {
    let data = _.get(json, 'submissions', false);
    if (data) {
      //  { "submissions": {
      //    path: /~ship/group
      //    pages: [{ship, timestamp, title, url}]
      //  } }

      const path = data.path;

      // stub in a comment count, which is more or less guaranteed to be 0
      data.pages = data.pages.map(submission => {
        submission.commentCount = 0;
        return submission;
      });

      // add the new submissions to state, update totals
      state.links[path] = this._addNewItems(
        data.pages, state.links[path]
      );
    }
  }

  discussionsPage(json, state) {
    let data = _.get(json, 'initial-discussions', false);
    if (data) {
      //  { "initial-discussions": {
      //    path: "/~ship/group"
      //    url: https://urbit.org/
      //    page: [{ship, timestamp, title, url}]
      //    page-number: 0
      //    total-items: 1
      //    total-pages: 1
      //  } }

      const path = data.path;
      const url = data.url;
      const page = "page" + data.pageNumber;

      // if we didn't have any state for this path yet, initialize.
      if (!state.comments[path]) {
        state.comments[path] = {};
      }
      if (!state.comments[path][url]) {
        state.comments[path][url] = {};
      }
      let here = state.comments[path][url];

      // since data contains an up-to-date full version of the page,
      // we can safely overwrite the one in state.
      here[page] = data.page;
      here.totalPages = data.totalPages;
      here.totalItems = data.totalItems;
    }
  }

  discussionsUpdate(json, state) {
    let data = _.get(json, 'discussions', false);
    if (data) {
      //  { "discussions": {
      //    path: /~ship/path
      //    url: 'https://urbit.org'
      //    comments: [{ship, timestamp, udon}]
      //  } }

      const path = data.path;
      const url = data.url;

      // add new comments to state, update totals
      state.comments[path][url] = this._addNewItems(
        data.comments, state.comments[path][url]
      );
    }
  }

//

  _addNewItems(items, pages = {}, page = 0) {
    //TODO  kinda want to refactor this, have it just be number indexes
    const i = "page" + page;
    //TODO  but if there's more on the page than just the things we're
    //      pushing onto it, we won't load that in. should do an
    //      additional check (+ maybe load) on page-nav, right?
    if (!pages[i]) {
      pages[i] = [];
    }
    pages[i] = items.concat(pages[i]);
    if (pages[i].length <= PAGE_SIZE) {
      pages.totalPages = page + 1;
      pages.totalItems = (page * PAGE_SIZE) + pages[i].length;
      return pages;
    }
    // overflow into next page
    const tail = pages[i].slice(PAGE_SIZE);
    pages[i].length = PAGE_SIZE;
    return this._addNewItems(tail, pages, page+1);
  }

}