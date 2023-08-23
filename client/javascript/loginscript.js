document.getElementById('signin-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const mobile = document.getElementById('signin-mobile').value;
  const password = document.getElementById('signin-password').value;

  const userlogin = {
    mobile: mobile,
    password: password
  }

  const url = `http://localhost:8080/login`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

  xhr.onreadystatechange = () => {
    if (xhr.status == 200 && xhr.readyState == 4) {
      responseData = JSON.parse(xhr.responseText);
      console.log(responseData);

      if (responseData === null) {
        alert(`Wrong Mobile or password`)
      } else {
        const userName = responseData.name; // Access the name property
        console.log(userName);
        localStorage.clear();
        localStorage.setItem("userName", userName);
        document.location.href = `http://127.0.0.1:5500/client/index.html`;
      }
    }
  }

  // Send the userlogin object as JSON in the request body
  xhr.send(JSON.stringify(userlogin));
});
