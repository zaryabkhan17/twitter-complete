const url = "http://localhost:3000";
var socket = io(url);

socket.on('connect', function () {
    console.log("connected");
});
function signUp() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value.toLowerCase();
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;

    let user = {
        name: name,
        email: email,
        phone: phone,
        password: password
    }


    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/auth/signup");
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(user));

    Http.onreadystatechange = (e) => {

        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText)
            if (Http.status === 200) {
                alert(jsonRes.message);
                window.location.href = "login.html";
            }
            else {
                alert(jsonRes.message);
            }

        }
    }
    return false;


  
}

function logIn() {

    var email = document.getElementById("email").value.toLowerCase();
    var password = document.getElementById("password").value;

    user = {
        email: email,
        password: password,
    }

    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/auth/login");
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(user));

    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText);
            

            if (Http.status === 200) {
                alert(jsonRes.message);
                localStorage.setItem('current_user', JSON.stringify(jsonRes.user))
                window.location.href = "dashboard.html";
            }
            else {
                alert(jsonRes.message);
            }

        }
    }
    return false;
}

function getProfile() {
   
    axios({

        method: 'get',
        url: url + "/profile",

    }).then((response) => {
        
        document.getElementById('resUserName').innerHTML = response.data.profile.name;       
        getTweets();
    }, (error) => {
        
        window.location.href = "./login.html"
       
    });

}

const tweetme = () => {


    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/uploadTweet")
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify({
        userPost: document.getElementById("userPost").value,
    }))


    document.getElementById("userPost").value = "";

}
socket.on("NEW_POST", (newPost) => {
    var eachTweet = document.createElement("li");
    eachTweet.setAttribute("class", "myClass");
    eachTweet.innerHTML =

        `
        <h4 class="userName">
        ${newPost.data.name}
    </h4> 
    <p class="userPost">
        ${newPost.data.userPost}
    </p>`;
    document.getElementById("posts").appendChild(eachTweet)
})


const userTweets = () => {
    document.getElementById("posts").innerHTML = "";
    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/userTweets");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText)
            for (let i = 0; i < jsonRes.tweets.length; i++) {

                var eachTweet = document.createElement("li");
                eachTweet.setAttribute("class", "myClass");

                eachTweet.innerHTML =
                    `
                    
                    <h4 class="userName">
                    ${jsonRes.tweets[i].name}
                </h4> 
            
                <p class="userPost">
                    ${jsonRes.tweets[i].userPost}
                </p>`;

                document.getElementById("posts").appendChild(eachTweet)

            }
        }
    }
}




const getTweets = () => {

    document.getElementById("posts").innerHTML = "";

    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/getTweets");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {

            let data = JSON.parse((Http.responseText));
            for (let i = 0; i < data.tweets.length; i++) {
               
                var eachTweet = document.createElement("li");
                eachTweet.setAttribute("class", "myClass");
                eachTweet.innerHTML =
                    `
                                      
                    <h4 class="userName">
                    ${data.tweets[i].name}
                </h4> 
                <p class="userPost">
                    ${data.tweets[i].userPost}
                </p>`;
                document.getElementById("posts").appendChild(eachTweet)

            }
        }
    }
}






function logout() {

    axios({
        method: "post",
        url: url + "/auth/logout",
    }).then((response) => {
        alert(response.data);
        window.location.href = "login.html";
    })
}