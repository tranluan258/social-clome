$(document).ready(() => {
  hideandshowNoti();
  addPost();
  scrollLoadData();
  addUser();
  changePassword();
});

function scrollLoadData() {
  let pathName = window.location.pathname.split("/");
  let check = pathName[pathName.length - 1];
  var start = 1;
  let limit = 10;
  if (check.length >= 21 || check === "") {
    $(window).scroll(function () {
      if (
        Math.abs(
          $(window).scrollTop() - ($(document).height() - $(window).height())
        ) < 1
      ) {
        fetch("/post/load", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start: start,
            limit: limit,
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.code === 0) {
              let id = $("#index_id_user").html();
              start = start + 1;
              let p = json.post;
              let comments = json.comments;
              let user = json.user;
              p.forEach((post) => {
                if (id === post.user.id) {
                  let time = moment(post.time).fromNow()
                  if (post.urlFile.length > 0) {
                    $(".index_body_post").append(` 
                        <div class="card index_poster">
                            <div class="card index_on_the_cmt">
                                <div class="index_post_title_option">
                                  <a href="/account/profile/${p.user.id}" class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</a>
                                    <div class="dropdown edit_and_delete_inpost">
                                        <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        . . .
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                                        <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                                        <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
                                        </div>
                                    </div>
                                    </div>
                                <aside>${time}</aside>
                                <aside>${post.data}</aside>
                                    <img class="index_img_post" src="/${post.user.email}/${post.nameFile}" alt="">
                            </div>
                            <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                            <div class="collapse" id="collapseCmt${post.id}">
                              <div class="index_cmt" id="${post.id}>">
                                <img class="index_avt_cmt" src="${user.img}">
                                <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                                <button id="${post.id}" onclick="addComments(this)">Send</button>
                            </div>
                            </div>
                            `);
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        $(`#collapseCmt${cmt.idPost}`).append(`
                          <div id="${cmt.id}">
                            <a class="profile_da_cmt" href="/account/profile/${c.user.id}"><img class="index_avt_cmt" src="${cmt.user.img}"> ${cmt.user.name} :</a>
                            <div class="index_da_cmt">
                              <p class=" card noidungcmt">${cmt.data}</p>
                                <div class="dropdown edit_and_delete_incmt">
                                  <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                  ...
                                  </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                                    <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                                    </div>
                                </div>
                            </div>
                           </div>`);
                      }
                    });
                  } else if (post.idVideos.length > 0) {
                    $(".index_body_post").append(` 
                          <div class="card index_poster">
                              <div class="card index_on_the_cmt">
                                  <div class="index_post_title_option">
                                  <a href="/account/profile/${p.user.id}" class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</a>
                                      <div class="dropdown edit_and_delete_inpost">
                                          <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                          . . .
                                          </button>
                                          <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                                          <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                                        <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
                                          </div>
                                      </div>
                                      </div>
                                  <aside>${time}</aside>
                                  <aside>${post.data}</aside>
                                      <iframe class="index_video_post"  src="https://www.youtube.com/embed/${post.idVideos}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                              </div>
                              <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                              <div class="collapse" id="collapseCmt${post.id}">
                                <div class="index_cmt" id="${post.id}>">
                                  <img class="index_avt_cmt" src="${user.img}">
                                  <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                                  <button id="${post.id}" onclick="addComments(this)">Send</button>
                              </div>
                              </div>
                              `);
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        $(`#collapseCmt${cmt.idPost}`).append(`
                                  <div id="${cmt.id}">
                                  <a class="profile_da_cmt" href="/account/profile/${c.user.id}"><img class="index_avt_cmt" src="${cmt.user.img}"> ${cmt.user.name} :</a>
                                  <div class="index_da_cmt">
                                      <p class=" card noidungcmt">${cmt.data}</p>
                                          <div class="dropdown edit_and_delete_incmt">
                                              <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                              ...
                                              </button>
                                                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                                                  <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                                                  </div>
                                          </div>
                                  </div>
                                  </div>`);
                      }
                    });
                  } else {
                    $(".index_body_post").append(`
                      <div class="card index_poster">
                          <div class="card index_on_the_cmt">
                              <div class="index_post_title_option">
                              <a href="/account/profile/${p.user.id}" class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</a>              
                                  <div class="dropdown edit_and_delete_inpost">
                                      <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                      . . .
                                      </button>
                                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                                      <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                                      <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
                                      </div>
                                  </div>
                                  </div>
                              <aside>${time}</aside>
                              <aside>${post.data}</aside>
                              <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                              <div class="collapse" id="collapseCmt${post.id}">
                                <div class="index_cmt" id="${post.id}>">
                                  <img class="index_avt_cmt" src="${user.img}">
                                  <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                                  <button id="${post.id}" onclick="addComments(this)">Send</button>
                              </div>
                              </div>
                              `);
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        $(`#collapseCmt${cmt.idPost}`).append(`
                                  <div id="${cmt.id}">
                                  <a class="profile_da_cmt" href="/account/profile/${c.user.id}"><img class="index_avt_cmt" src="${cmt.user.img}"> ${cmt.user.name} :</a>
                                  <div class="index_da_cmt">
                                      <p class=" card noidungcmt">${cmt.data}</p>
                                          <div class="dropdown edit_and_delete_incmt">
                                              <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                              ...
                                              </button>
                                                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                                                  <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                                                      <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
                                                  </div>
                                          </div>
                                  </div>
                                  </div>`);
                      }
                    });
                  }
                } else {
                  if (post.urlFile.length > 0) {
                    $(".index_body_post").append(` 
                    <div class="card index_poster">
                        <div class="card index_on_the_cmt">
                            <div class="index_post_title_option">
                                
                            <a href="/account/profile/${p.user.id}" class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</a>
                                </div>
                            <aside>${time}</aside>
                            <aside>${post.data}</aside>
                                <img class="index_img_post" src="/${post.user.email}/${post.nameFile}" alt="">
                        </div>
                        <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                  <div class="collapse" id="collapseCmt${post.id}">
                    <div class="index_cmt" id="${post.id}>">
                      <img class="index_avt_cmt" src="${user.img}">
                      <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                      <button id="${post.id}" onclick="addComments(this)">Send</button>
                  </div>
                  </div>`);
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        $(`#collapseCmt${cmt.idPost}`).append(`
                      <div id="${cmt.id}">
                      <a class="profile_da_cmt" href="/account/profile/${c.user.id}"><img class="index_avt_cmt" src="${cmt.user.img}"> ${cmt.user.name} :</a>
                      <div class="index_da_cmt">
                          <p class=" card noidungcmt">${cmt.data}</p>
                              <div class="dropdown edit_and_delete_incmt">
                                  <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                  ...
                                  </button>
                                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                                      <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                                         
                                      </div>
                              </div>
                      </div>
                      </div>`);
                      }
                    });
                  } else if (post.idVideos.length > 0) {
                    $(".index_body_post").append(` 
                      <div class="card index_poster">
                          <div class="card index_on_the_cmt">
                              <div class="index_post_title_option">
                              <a href="/account/profile/${p.user.id}" class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</a>
                                  </div>
                              <aside>${time}</aside>
                              <aside>${post.data}</aside>
                                  <iframe class="index_video_post"  src="https://www.youtube.com/embed/${post.idVideos}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                          </div>
                          <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                          <div class="collapse" id="collapseCmt${post.id}">
                            <div class="index_cmt" id="${post.id}>">
                              <img class="index_avt_cmt" src="${user.img}">
                              <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                              <button id="${post.id}" onclick="addComments(this)">Send</button>
                          </div>
                          </div>`);
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        $(`#collapseCmt${cmt.idPost}`).append(`
                              <div id="${cmt.id}">
                              <a class="profile_da_cmt" href="/account/profile/${c.user.id}"><img class="index_avt_cmt" src="${cmt.user.img}"> ${cmt.user.name} :</a>
                              <div class="index_da_cmt">
                                  <p class=" card noidungcmt">${cmt.data}</p>
                                      <div class="dropdown edit_and_delete_incmt">
                                          <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                          ...
                                          </button>
                                              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                                              <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                                              </div>
                                      </div>
                              </div>
                              </div>`);
                      }
                    });
                  } else {
                    $(".index_body_post").append(` 
                      <div class="card index_poster">
                        <div class="card index_on_the_cmt">
                          <div class="index_post_title_option">
                             <a href="/account/profile/${p.user.id}" class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</a>
                            <aside>${time}</aside>
                            <aside>${post.data}</aside>
                            <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                            <div class="collapse" id="collapseCmt${post.id}">
                              <div class=" index_cmt" id="${post.id}>">
                                <img class="index_avt_cmt" src="${user.img}">
                                <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                                <button id="${post.id}" onclick="addComments(this)">Send</button>
                              </div>
                            </div>
                          </div>
                        </div>
                       </div>`);
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        $(`#collapseCmt${cmt.idPost}`).append(`
                          <div id="${cmt.id}">
                            <a class="profile_da_cmt" href="/account/profile/${c.user.id}"><img class="index_avt_cmt" src="${cmt.user.img}"> ${cmt.user.name} :</a>
                            <div class="index_da_cmt">
                                <p class=" card noidungcmt">${cmt.data}</p>
                                    <div class="dropdown edit_and_delete_incmt">
                                        <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        ...
                                        </button>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                                                <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                                            </div>
                                    </div>        
                              </div>
                            </div>
                          </div>`)}});
                  }
                }
              });
            }
          })
          .catch((err) => console.log(err));
      }
    });
  }
}

function addUser() {
  $("#index_create_add_user").click(function () {
    $("#index_modal_add_user").modal();
    $("#btn_add_user").click(() => {
      let input = [...$("input[name='faculty']")];
      let arrFaculty = new Array();
      input.forEach((f) => {
        if (f.checked) {
          let id = f.attributes.id.value;
          let name = f.attributes.value.value;
          let faculty = {
            idFaculty: id,
            name: name,
          };
          arrFaculty.push(faculty);
        }
      });
      let email = $("#email_user").val();
      let password = $("#password_user").val();
      let name = $("#name_user").val();
      fetch("/account/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password,
          arrFaculty: arrFaculty,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.code == 0) {
            alert("Thêm thành công");
            $("#index_modal_add_user").modal();
          } else if (json.code === 1) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Please enter full information!");
          } else if (json.code === 2) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Email already exist!");
          }
        })
        .catch((err) => console.log(err));
    });
  });
}

function changePassword() {
  $("#index_change_password").click(() => {
    $("#index_modal_change_password").modal("show");
    $("#btn_change_password").click(() => {
      let oldPassword = $("#old_password").val();
      let newPassword = $("#new_password").val();
      fetch("/account/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.code === 0) {
            alert("Change Password Success");
            $("#index_modal_change_password").modal("hide");
          } else if (json.code === 2) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Password Incorrect!");
          } else if (json.code === 1) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Please enter full information!");
          }
        });
    });
  });
}

function addPost() {
  $("#index_create_new_post").click(function () {
    $("#index_modal_new_post").modal("show");
    $("#btn-post-ytb").click(() => {
      $("#input-post-ytb").css("display", "block");
    });
    $("#btn-post-img").click(() => {
      $("#input-post-img").click();
      $("#input-post-img").css("display", "block");
    });
  });
  $("#btn-create-post").click((e) => {
    let btn = e.target;
    let email = btn.dataset.email;
    let data = $("#data-post").val();
    let urlYoutube = $("#input-post-ytb").val();
    let inputFile = document.getElementById("input-post-img");
    let file = null;
    var video_id = "";
    if (urlYoutube != "") {
      video_id = urlYoutube.split("v=")[1];
      var ampersandPosition = video_id.indexOf("&");
      if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
    }
    if (inputFile.files.length > 0) {
      file = inputFile.files[0];
    }

    let xhr = new XMLHttpRequest();
    let form = new FormData();
    form.set("email", email);
    form.set("data", data);
    form.set("YoutubeId", video_id);
    form.set("attachment", file);
    xhr.open("POST", "/post/add", true);
    xhr.addEventListener("load", (e) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let json = JSON.parse(xhr.responseText);
        if (json.code === 0) {
          let post = json.post;
          let time = moment(post.time).fromNow()
          if (post.urlFile.length > 0) {
            $(".index_body_post").prepend(`
              <div class="card index_poster">
                  <div class="card index_on_the_cmt">
                      <div class="index_post_title_option"> 
                          <h2 class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</h2>
                          <div class="dropdown edit_and_delete_inpost">
                              <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                              . . .
                              </button>
                              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                              <button class="dropdown-item" id="${p.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                              <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
                              </div>
                          </div>
                          </div>
                      <aside>${time}</aside>
                      <aside>${post.data}</aside>
                          <img class="index_img_post" src="/${post.user.email}/${post.nameFile}" alt="">
                  </div>
                  <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                  <div class="collapse" id="collapseCmt${post.id}">
                    <div class="index_cmt" id="${post.id}>">
                      <img class="index_avt_cmt" src="${post.user.img}">
                      <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                      <button id="${post.id}" onclick="addComments(this)">Send</button>
                  </div>
                  </div>
                  `);
            $("#index_modal_new_post").modal("hide");
            clearDataModal();
          } else if (post.idVideos.length > 0) {
            $(".index_body_post").prepend(` 
                <div class="card index_poster">
                    <div class="card index_on_the_cmt">
                        <div class="index_post_title_option">
                            
                            <h2 class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</h2>
                            
                            <div class="dropdown edit_and_delete_inpost">
                                <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                . . .
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                                <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                                <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
                                    
                                    
                                </div>
                            </div>
                            
                            </div>
                        <aside>${time}</aside>
                        <aside>${post.data}</aside>
                            <iframe class="index_video_post"  src="https://www.youtube.com/embed/${post.idVideos}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>
                    <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                    <div class="collapse" id="collapseCmt${post.id}">
                      <div class=" index_cmt" id="${post.id}>">
                        <img class="index_avt_cmt" src="${post.user.img}">
                        <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                        <button id="${post.id}" onclick="addComments(this)">Send</button>
                    </div>
                    </div>`);
            $("#index_modal_new_post").modal("hide");
            clearDataModal();
          } else {
            $(".index_body_post").prepend(` 
            <div class="card index_poster">
                <div class="card index_on_the_cmt">
                    <div class="index_post_title_option">
                        
                        <h2 class="index_post_avtname"><img class="index_avt_post" src="${post.user.img}">${post.user.name}</h2>
                        
                        <div class="dropdown edit_and_delete_inpost">
                            <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            . . .
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                            <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                              <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
                                
                                
                            </div>
                        </div>
                        
                        </div>
                    <aside>${time}</aside>
                    <aside>${post.data}</aside>
                    <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
                    <div class="collapse" id="collapseCmt${post.id}">
                      <div class=" index_cmt" id="${post.id}>">
                        <img class="index_avt_cmt" src="${post.user.img}">
                        <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
                        <button id="${post.id}" onclick="addComments(this)">Send</button>
                    </div>
                    </div>`);
            $("#index_modal_new_post").modal("hide");
            clearDataModal();
          }
        } else if (json.code === 1) {
          $(".index_alert_post_fail").css("display", "block");
          $(".index_alert_post_fail").html("Please enter the data!");
        } else {
          $(".index_alert_post_fail").css("display", "block");
          $(".index_alert_post_fail").html("Error, Please try again!");
        }
      }
    });
    xhr.send(form);
  });
}

function deletePost(e) {
  let id = e.id;
  fetch("/post/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.code === 0) {
        $(`div#${id}`).remove();
      }
    })
    .catch((err) => console.log(err));
}

function addComments(e) {
  let id = e.id;
  let data = $(`#index_data_cmt${id}`).val();
  if (data && id) {
    fetch("/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPost: id,
        data: data,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          let cmt = json.cmt;
          $(`#collapseCmt${cmt.idPost}`).append(`
            <div id="${cmt.id}">
              <a class="profile_da_cmt" href="/account/profile/${c.user.id}"><img class="index_avt_cmt" src="${cmt.user.img}"> ${cmt.user.name} :</a>
              <div class="index_da_cmt">
                  <p class=" card noidungcmt">${cmt.data}</p>
                      <div class="dropdown edit_and_delete_incmt">
                          <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                          ...
                          </button>
                              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                              <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                              </div>
                    </div>
               </div>
            </div>
              `);
          $(`#index_data_cmt${id}`).val("");
        }
      })
      .catch((err) => console.log(err));
  }
}

function deleteComments(e) {
  let id = e.id;
  fetch("/comments/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.code === 0) {
        $(`div#${id}`).remove();
      }
    })
    .catch((err) => console.log(err));
}

function clearDataModal() {
  $("#index_modal_new_post").on("hidden.bs.modal", function () {
    $("#data-post").val("");
    $("#input-post-ytb").css("display", "none");
    $("#input-post-img").css("display", "none");
    $("#input-post-ytb").val("");
    $("#input-post-img").val("");
    $(".index_alert_post_fail").css("display", "none");
  });
}

function hideandshowNoti(){
    $("#bttn").click(()=>{
      let check = $("#bttn").attr('aria-expanded')
      if(check === 'true'){
        $("#phimthongbaoall").css("display","none");
        $("#bttn").attr('aria-expanded',false)
      }else {
        $("#phimthongbaoall").css("display","block");
        $("#bttn").attr('aria-expanded',true)
      }
    });
}
