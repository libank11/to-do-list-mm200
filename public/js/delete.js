function deleteListElement(postvalue) {
    console.log(postvalue);
    let listide = localStorage.getItem("listid");
    let data = JSON.stringify({

        postid: postvalue

    });

    fetch('/app/posts', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser,
            "postid": postvalue
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            fetchPosts(listide);

        } else {
            // TODO: MESSAGE
            console.log('Did not load presentation :(');
        }
    }).catch(err => console.error(err));


}