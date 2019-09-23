interface IinitialState {
    artists: any[];
};

const initialState: IinitialState = {
    artists: [],
};

const ArtistReducer = (state: IinitialState, action: any) => {
    switch (action.type) {

    }

    return state;
};

export { ArtistReducer };