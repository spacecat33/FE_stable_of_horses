//this is service class to help make app more dynamic (i.e. reuable code)

class Api {
    static baseUrl = "http://localhost:3000"
   
    static headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }

    static async get(path) {
      let resp = await fetch(Api.baseUrl + path, {
        method: "GET",
        headers: Api.headers
      })
  
      let data = await resp.json();
  console.log ("fetching the data in the API.get function")
      return data;
    }

    static async post(path, params) {
        let resp = await fetch(Api.baseUrl + path, {
            method: "POST",
            headers: Api.headers,
            body: JSON.stringify(params)  // .stringify is a serializer - enables us to save the state of the object and recreate the object in a new location.
        })
        let data = await resp.json();

        return data;
    }

    static async patch(path, params) {
        let resp = await fetch(Api.baseUrl + path, {
            method: "PATCH",
            headers: Api.headers,
            body: JSON.stringify(params)
        })
        let data = await resp.json();

        return data;
    }

    static async delete(path) {
        let resp = await fetch(Api.baseUrl + path, {
            method: "DELETE",
            headers: Api.headers
        })
        
        let data = await resp.json();

        return data;
    }
}

  
