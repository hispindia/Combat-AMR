export const INITIAL_STATE = {
    follow: true
}

export const MARK_FOLLOW = 'MARK_FOLLOW'

const reducer = (state, action) => {
    switch (action.type) {
        case MARK_FOLLOW: {
            return {
                ...state,
                follow: action.follow,
            }
        }
    }
}