import {updateObjectInArray} from "../utils/object-helpers";
import {UserType} from "../types/types";
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {Dispatch} from "react";
import {usersAPI} from "../API/users-API";
import {APIResponseType} from "../API/api";


/*const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const SET_USERS = 'SET_USERS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL_USERS_COUNT = 'SET_TOTAL_USERS_COUNT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_FOLLOWING_PROGRESS = 'TOGGLE_IS_FOLLOWING_PROGRESS';*/

let initialState = {
    users: [] as Array<UserType>,
    pageSize: 5, // відображае кількість користувачів на сторінці (яку порцію отримувати)
    totalUsersCount: 0,// скільки пришло юзерів
    currentPage: null as unknown as number,    // номер сторінки
    isFetching: true, // крутилка загрузки
    followingInProgress: [] as Array<number>, //отключает кнопку // Масив id users
    filter: {
        term: '',
        friend: null as any,

    } as any,
}

const usersReducer = (state = initialState, action: ActionTypes): InitialStateType => {

    switch (action.type) {
        case 'FOLLOW':
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userID, "id", {followed: true})
            }
        case 'UNFOLLOW':
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userID, "id", {followed: false})
            }
        case 'SET_USERS': {
            return {...state, users: action.users}
            /* return {...state, users: [...state.users, ...action.users ]}*/
        }
        case 'SET_CURRENT_PAGE': {
            return {...state, currentPage: action.currentPage}
        }
        case 'SET_TOTAL_USERS_COUNT': {
            return {...state, totalUsersCount: action.totalCount}
        }
        case 'TOGGLE_IS_FETCHING': {
            return {...state, isFetching: action.isFetching}
        }
        case 'TOGGLE_IS_FOLLOWING_PROGRESS': {
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userID]
                    : state.followingInProgress.filter(id => id != action.userID)
            }
        }
        case'SN/USERS/SET_FILTER': {
            return {
                ...state, filter: action.payload // filter
            }
        }
        default:
            return state;
    }
}
//---------------------- Action Create -------------------------------//
export const actionsCreate = {
    followSuccess: (userID: number) => ({type: 'FOLLOW', userID} as const),

    unfollowSuccess: (userID: number) => ({type: 'UNFOLLOW', userID} as const),

    setUsers: (users: Array<UserType>) => ({type: 'SET_USERS', users} as const),

    setCurrentPage: (currentPage: number) => ({type: 'SET_CURRENT_PAGE', currentPage} as const),

    setTotalCount: (totalCount: number) => ({type: 'SET_TOTAL_USERS_COUNT', totalCount} as const),

    toggleIsFetching: (isFetching: boolean) => ({type: 'TOGGLE_IS_FETCHING', isFetching} as const),

    toggleFollowingProgress: (isFetching: boolean, userID: number) => ({
        type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
        isFetching,
        userID
    } as const),

    setFilter: (filter: FilterUserType) => ({type: 'SN/USERS/SET_FILTER', payload: filter} as const),

}

//---------------- OLD ----------------------------------------//
/*let followSuccess = (userID: number) => ({type: FOLLOW, userID})
let unfollowSuccess = (userID: number) => ({type: UNFOLLOW, userID})
let setUsers = (users: Array<UserType>) => ({type: SET_USERS, users})
export let setCurrentPage = (currentPage: number) => ({type: SET_CURRENT_PAGE, currentPage})
let setTotalCount = (totalCount: number)=> ({type: SET_TOTAL_USERS_COUNT, totalCount})
export let toggleIsFetching = (isFetching: boolean) => ({type: TOGGLE_IS_FETCHING, isFetching})
let toggleFollowingProgress = (isFetching: boolean, userID: number) => ({type: TOGGLE_IS_FOLLOWING_PROGRESS, isFetching, userID})*/
//----------------------------------------------- Thunk  -----------------------------------------------------------//
type DispatchType = Dispatch<ActionTypes>
// Получение юзеров
export const getUsersThunkCreator = (currentPage: number, pageSize: number, filter: FilterUserType): ThunkType => {// requestUsers
    return async (dispatch: DispatchType) => {
        dispatch(actionsCreate.toggleIsFetching(true));
        dispatch(actionsCreate.setCurrentPage(currentPage))
        dispatch(actionsCreate.setFilter(filter))

        let data = await usersAPI.getUsers(currentPage, pageSize,filter.term,filter.friend )
        dispatch(actionsCreate.toggleIsFetching(false));
        dispatch(actionsCreate.setUsers(data.items));
        dispatch(actionsCreate.setTotalCount(data.totalCount))
    }
};
//---------------------------------------------------------------------------//
const followUnfollowFlow = async (dispatch: DispatchType, userID: number, apiMethod: (userId: number) => Promise<APIResponseType>, actionCreator: (userId: number) => ActionTypes) => {
    dispatch(actionsCreate.toggleFollowingProgress(true, userID));
    let response = await apiMethod(userID);
    if (response.resultCode === 0) {
        dispatch(actionCreator(userID))
    }
    dispatch(actionsCreate.toggleFollowingProgress(false, userID))
};
// Подписывает на юзера
export const follow = (userID: number): ThunkType => {
    return async (dispatch: DispatchType) => {
        let apiMethod = usersAPI.postUsersFollow.bind(usersAPI)
        let actionCreator = actionsCreate.followSuccess;

        await followUnfollowFlow(dispatch, userID, apiMethod, actionCreator);
    }
};

export const unfollow = (userID: number): ThunkType => {
    return async (dispatch: DispatchType) => {
        let apiMethod = usersAPI.deleteUsersUnfollow.bind(usersAPI)
        let actionCreator = actionsCreate.unfollowSuccess;

        await followUnfollowFlow(dispatch, userID, apiMethod, actionCreator);
    }
};
//---------------------------------------------------------------//

export default usersReducer;

export type InitialStateType = typeof initialState
export type FilterUserType = typeof initialState.filter;
type ActionTypes = InferActionsTypes<typeof actionsCreate>
export type ThunkType = BaseThunkType<ActionTypes>  //ThunkAction<Promise<void>, AppStateType, unknown, ActionTypes>



