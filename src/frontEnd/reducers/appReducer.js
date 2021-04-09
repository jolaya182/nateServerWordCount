/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/**
 * title: appReducer.js
 *
 * date: 3/22/2020
 *
 * author: javier olaya
 *
 * description: theses reducers processes the incoming data from the
 * server
 */

/**
 * using the number totalchunks and the
 * newpaginators position, this function determines
 * which positions are disabled and enabled
 *
 * @param {*} totalChunks
 * @param {*} newPaginatorObject
 */
const updatePageIndex = (
  totalChunks,
  newPaginatorObject = { leftIndex: -1, pageIndex: 0, rightIndex: 1 }
) => {
  const newerPaginatorObject = {
    ...newPaginatorObject,
    isLeftDisabled: true,
    isMiddleDisabled: true,
    isRightDisabled: true,
    totalChunks
  };

  // initial to paginator in the begining
  if (totalChunks < 0) {
    newerPaginatorObject.isLeftDisabled = true;
    newerPaginatorObject.isMiddleDisabled = true;
    newerPaginatorObject.isRightDisabled = true;
  } else if (totalChunks === 1) {
    newerPaginatorObject.isLeftDisabled = true;
    newerPaginatorObject.isMiddleDisabled = false;
    newerPaginatorObject.isRightDisabled = true;
  } else if (totalChunks >= 2) {
    newerPaginatorObject.isLeftDisabled = true;
    newerPaginatorObject.isMiddleDisabled = false;
    newerPaginatorObject.isRightDisabled = false;
  }

  // readjust to the indices if they have moved more than three spaces
  if (newerPaginatorObject.leftIndex <= -1) {
    newerPaginatorObject.isLeftDisabled = true;
  } else {
    newerPaginatorObject.isLeftDisabled = false;
  }

  if (newerPaginatorObject.rightIndex >= totalChunks) {
    newerPaginatorObject.isRightDisabled = true;
  } else {
    newerPaginatorObject.isRightDisabled = false;
  }

  return newerPaginatorObject;
};

/**
 * processes the response object and updates the
 * state variables, newHistory, Words, currentSelectedUrl,
 * paginator
 *
 * @param {obj} serverDataResponse
 * @param {obj} newPaginatorObject
 */
const updateForm = (serverDataResponse, newPaginatorObject, state) => {
  // no destructure due initial state name conflicts
  const newHistory = serverDataResponse.historyUrl.map((elem) => {
    return { urlId: elem.urlId, urlString: elem.urlString };
  });

  //   newHistory.unshift({ urlId: 0, urlString: 'Select a Url' });
  const final = {
    words: serverDataResponse.words,
    paginatorObject: updatePageIndex(
      serverDataResponse.totalChunks,
      newPaginatorObject
    ),
    historyUrl:
      newHistory.length < 1 ? state.formObjectData.historyUrl : newHistory,
    currentSelectedUrl: serverDataResponse.currentSelectedUrl
  };
  console.log('final', final);
  return final;
};

const retrieveFormObjectDataReducer = (state, action) => {
  switch (action.type) {
    case 'RETRIEVE_FORM_OBJECT_DATA':
      return updateForm(
        action.serverDataResponse,
        action.newPaginatorObject,
        state
      );
    default:
      return state;
  }
};

const updateMessgeReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ERROR':
      return {};
    default:
      return state;
  }
};

export default function appReducer(state, action) {
  return {
    message: updateMessgeReducer(state, action),
    formObjectData: retrieveFormObjectDataReducer(state, action)
  };
}
