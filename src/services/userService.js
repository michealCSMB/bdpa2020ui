import superagent from "superagent";
import Cookies from "universal-cookie";
const baseUserURL = "http://localhost:3535"

export const rememberMe = async (remember = false) => {
    try {
        const cookies = new Cookies()

        console.log(remember)
        if (remember === true) cookies.set('rememberMe', remember)
        if (remember === false) cookies.remove("rememberMe")
    } catch (err) {
        console.log("error", err)
    }
    return false
}
export const createUser = async (user) => {
    // console.log(user)
    const addUrl = baseUserURL + '/user/add'
    try {
        await superagent.post(addUrl, user)
        console.log("User registered")
        return true
    } catch (err) {
        if (err.status === 409) { console.log("Username taken") }
        else console.log("Bad credentials")
    }
    return false
}
export const login = async (user) => {
    const { username, firstName, lastName, password } = user
    const base64String = Buffer.from(`${username}:${firstName}:${lastName}:${password}`, 'ascii').toString("base64")
    console.log(base64String)
    const headers = { Authorization: `Basic ${base64String}` }
    const tokenUrl = baseUserURL + '/token'
    try {
        const response = await superagent.post(tokenUrl, username).set(headers)
        const { token, role } = response.body
        console.log("token", token)
        console.log(username, role)
        const cookies = new Cookies()
        cookies.set('username', username)
        cookies.set('userToken', token)
        cookies.set('role', role)
        return true
    } catch (err) {
        if (err.status === 401) console.log("Bad credentials")
        else console.log("error", err)
    }
    return false
}
export const requestUserInfo = async (username) => {
    console.log("Requesting", username)
    const cookies = new Cookies(), token = cookies.get("userToken")
    const headers = { Authorization: `Bearer ${token}` }
    const tokenUrl = baseUserURL + '/user/update'
    try {
        const response = await superagent.get(tokenUrl, username).set(headers)
        return response.body
    } catch (err) {
        if (err.status === 401) console.log("Bad credentials")
        else console.log("error", err)
    }
    return {}
}