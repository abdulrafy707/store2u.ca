// ./src/app/store/middleware.js
export const localStorageMiddleware = store => next => action => {
    const result = next(action);
    
    if (action.type.startsWith('cart/')) {
      const cart = store.getState().cart.items;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return result;
  };
  