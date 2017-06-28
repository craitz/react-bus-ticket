export const setPassagens = (passagens) => {
  return {
    type: 'SET_PASSAGENS',
    payload: passagens
  }
};

export const setActivePage = (page) => {
  return {
    type: 'SET_ACTIVE_PAGE',
    payload: page
  }
};

