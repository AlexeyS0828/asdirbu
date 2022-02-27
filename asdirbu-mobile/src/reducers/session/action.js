import { useApi } from '../../service/api';
import Types from './types';
import { useDispatch } from 'react-redux';

export function setToken(token) {
    return {
        type: Types.SETTOKEN,
        payload: {token}
    }
}

export function setUserType(usertype) {
    return {
        type: Types.SETUSERTYPE,
        payload: {usertype}
    }
}

export function getResult(data) {
    return {
        type: Types.LOGIN,
        payload: {data}
    }
}

export function getResult1(data) {
    return {
        type: "SEARCH",
        payload: {data}
    }
}

export function getCity(data) {
    return {
        type: "CITY",
        payload: {data}
    }
}

export function getMember(data) {
    return {
        type: "MEMBER",
        payload: {data}
    }
}

export function Register() {
    const api = useApi();
    const dispatch = useDispatch();
    return async (data) => {
        const info = await api.signup(data);
        dispatch(getResult(info));
    }
}

export function Login() {
    const api = useApi();
   
    const dispatch = useDispatch();
    return async (data, type) => {
        const info = await api.signin(data);
        dispatch(getResult(info));
    }
}

export function GetProfile(){
    const api = useApi();
    const dispatch = useDispatch();
    return async (data, type) => {
        const info = await api.getprofile(data);
        // dispatch(getResult(info));
    }
}

export function Getresult(){
    const api = useApi();
    const dispatch = useDispatch();
    return async (data, type) => {
        const info = await api.getsearch(data);
        dispatch(getResult(info));
    }
}

export function Getresult1(){
    const api = useApi();
    const dispatch = useDispatch();
    return async (data, type) => {
        const info = await api.getsearch(data);
        dispatch(getResult1(info));
    }
}

export function Getcitys(){
    const api = useApi();
    const dispatch = useDispatch();
    return async (data, type) => {
        const info = await api.getcity();
        dispatch(getCity(info));
    }
}


export function GetMember(){
    const api = useApi();
    const dispatch = useDispatch();
    return async (data, type) => {
        const info = await api.getmember(data);
        dispatch(getMember(info));
    }
}
