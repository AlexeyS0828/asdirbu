import { BASE_URL,ImageUrl } from './types';

export function useApi() {
    async function GET(url,params) {
        const result = await fetch(`${BASE_URL}${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": params
            }
        });
        const data = await result.json();
        return { data }
    }

    async function GET1(url,params) {
        const result = await fetch(`${BASE_URL}${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await result.json();
        return { data }
    }

    async function POST(url, params) {
        const result = await fetch(`${BASE_URL}${url}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: params === null ? void 0 : typeof params === 'string' ? params : JSON.stringify(params)
        });
        const data = await result.json();
        return { data }
    }
    async function POST0(url, params) {     
        const result = await fetch(`${BASE_URL}${url}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        const data = await result.json();
        
        return { data }
    }
    return {
        async signin(params) {
            const {data} = await POST0('/user/login', params);
            return {data}
        },
        async signup(params) {
            const {data} = await POST0('/user/register', params);
            return data
        },
        async getprofile(params) {
            const {data} = await GET('/user/getprofile', params);
            return data
        },
        async getsearch(params) {
            const {data} = await POST('/user/search', params);
            return data
        },
        async getcity() {
            const {data} = await GET1('/getspecialtylist');
            return data
        },
        async getmember(params) {
            const {data} = await POST('/user/newmemberlist', params);
            return data
        }
    }
}