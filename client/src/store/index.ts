import { createStore } from 'redux';
import { ArtistReducer } from './reducers/artist.reducer';



export const store = createStore(ArtistReducer);
