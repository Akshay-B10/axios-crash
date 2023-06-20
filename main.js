// AXIOS GLOBALS
axios.defaults.headers.common['X-Auth-Token'] = "sometoken";

// GET REQUEST
function getTodos() {
  // correct url: https://jsonplaceholder.typicode.com/todos
  axios({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos",
    params: {
      _limit: 5
    }
  })
  /*
  axios
    .get("https://jsonplaceholder.typicode.com/todos", { params: { _limit: 5 }})
  */
    .then((res) => { showOutput(res) })
    .catch((err) => { console.log(err) });
}

// POST REQUEST
function addTodo() {
  /*
  axios({
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "New added Todo",
      completed: false
    }
  })
  */
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "New added Todo",
      completed: false
    })
    .then((res) => { showOutput(res) })
    .catch((err) => { console.log(err) });
}

// PUT/PATCH REQUEST
// Put method replaces where as patch method updates given data

// Note: for both put and patch; id of post is required in url.
function updateTodo() {
  /*
  axios
    .put("https://jsonplaceholder.typicode.com/todos/1", {
      title: "Updated Todo",
      completed: true
    })
  */
  axios
    .patch("https://jsonplaceholder.typicode.com/todos/2", {
      title: "Updated Todo",
      completed: true
    })
    .then((res) => { showOutput(res) })
    .catch((err) => { console.log(err) });
}

// DELETE REQUEST
// Note: delete need id of post to be deleted in url.
function removeTodo() {
  axios
    .delete("https://jsonplaceholder.typicode.com/todos/3")
    .then((res) => { showOutput(res) })
    .catch((err) => { console.log(err) });
}

// SIMULTANEOUS DATA
function getData() {
  axios.all([
    axios.get("https://jsonplaceholder.typicode.com/todos", {params: {_limit: 7}}),
    axios.get("https://jsonplaceholder.typicode.com/posts", {params: {_limit: 5}})
  ])
    /*
    .then((res) => {
      console.log(res[0]);
      console.log(res[1]);
      showOutput(res[1]);
    })
    */
    .then(axios.spread((todos, posts) => {
      console.log(todos);
      console.log(posts);
      showOutput(posts);
    }))
    .catch((err) => { console.log(err) });
    // res[0] is for todo and res[1] is for posts.
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken"
    }
  }

  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "New added Todo",
      completed: false
    }, config)
    .then((res) => { showOutput(res) })
    .catch((err) => { console.log(err) });
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "This is new Title"
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }

  axios(options).then((res) => { showOutput(res) })
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get("https://jsonplaceholder.typicode.com/todoss")
    .then((res) => { showOutput(res) })
    .catch((err) => {
      if (err.response) {
        // Server responded with a status other than 200 range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.error(err.message);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      cancelToken: source.token
    })
    .then((res) => { showOutput(res) })
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("Req canceled", thrown.message);
      }
    });
  
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use((config) => {
  console.log(`${config.method.toUpperCase()} req sent to ${config.url} at ${new Date().getTime()}`);
  return config
}, (error) => {
  return Promise.reject(error);
})

// AXIOS INSTANCES
const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

// axiosInstance.get("/comments").then((res) => { showOutput(res) });

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
