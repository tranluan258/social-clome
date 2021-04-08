const express = require("express");
const uuid = require("short-uuid");
const bcrypt = require("bcrypt");
const fs = require("fs");
const accountModel = require("../models/accounts");
const postModel = require("../models/posts");
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const validatorLogin = require("../middleware/validatorLogin");
const validatorRole = require("../middleware/validatorRole");
const router = express.Router();
const passport = require("passport");
const commentsModel = require("../models/comments");
const facultyModel = require("../models/faculty");
const moment = require("moment")

router.get("/login", (req, res) => {
  var error = req.flash("error");
  if (error[0] === "Missing credentials") {
    error[0] = "Vui lòng nhập đầy đủ thông tin";
  }
  if (req.session.passport) {
    res.redirect("../");
  } else {
    res.render("login", { email: "", password: "", error: error });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
    failureFlash: true,
  })
);

router.get("/profile/:id", validatorLogin, async (req, res) => {
  let id = req.params.id;
  let idCurrent = req.session.passport.user;
  let userCurrent = await accountModel.findById(idCurrent);
  let user = await accountModel.findOne({ id: id });
  let post = await postModel.find({ "user.email": user.email });
  let comments = await commentsModel.find();
  let faculty = await facultyModel.find();
  res.render("profile", { user, userCurrent, post, comments, faculty,moment });
});

router.post( "/update", validatorLogin, upload.single("image"), async (req, res) => {
    const { name } = req.body;
    const id = req.session.passport.user
    const file = req.file;
    const user = await accountModel.findById(id)
    const { root } = req.vars;
    const currentPath = `${root}/users/${user.email}`;
    if (user) {
      if (!file && !name) {
        return res.json({ code: 1, message: "Không thay đổi gì cả" });
      }
      if (file && name) {
        if (!fs.existsSync(currentPath)) {
          res.json({ code: 2, message: "Duong dan hong hop le" });
        }

        let nameFile = file.originalname;
        let newPath = currentPath + "/" + nameFile;
        fs.renameSync(file.path, newPath);

        accountModel
          .findOneAndUpdate(
            {
              id: user.id,
            },
            {
              name: name,
              img: "/" + user.email + "/" + nameFile,
            },
            {
              new: true,
              runValidators: true,
            }
          )
          .then(doc=> {
            postModel.updateMany(
              {
                "user.id": doc.id,
              },
              {
                  "user.name": doc.name,
                  "user.img": doc.img
              }
            ).then(() => {
              commentsModel.updateMany(
                  {
                    "user.id": doc.id,
                  },
                  {
                      "user.name": doc.name,
                      "user.img": doc.img
                  }
                ).then(() => res.json({ code: 0, message: "Thành công", acc: doc }) )
            })
          })
          .catch((err) => console.log(err));
      }else {
        if (file) {
          if (!fs.existsSync(currentPath)) {
            res.json({ code: 2, message: "Duong dan hong hop le" });
          }

          let nameFile = file.originalname;
          let newPath = currentPath + "/" + nameFile;
          fs.renameSync(file.path, newPath);

          accountModel
            .findOneAndUpdate(
              {
                id: user.id,
              },
              {
                img: "/" + user.email + "/" + nameFile,
              },
              {
                new: true,
                runValidators: true,
              }
            )
            .then(doc => {
              postModel.updateMany(
                {
                  "user.id": doc.id,
                },
                {
                  "user.img": doc.img,
                }
              )
              .then(() => {
                commentsModel.updateMany(
                    {
                      "user.id": doc.id,
                    },
                    {
                        "user.img": doc.img
                    }
                  ).then(() => res.json({ code: 0, message: "Thành công", acc: doc }) )
              })
            })
            .catch((err) => console.log(err));
        } else {
          accountModel
            .findOneAndUpdate(
              {
                id: user.id,
              },
              {
                name: name,
              },
              {
                new: true,
                runValidators: true,
              }
            )
            .then(doc => {
              postModel.updateMany(
                {
                  "user.id": doc.id,
                },
                {
                    "user.name": doc.name,
                }
              )
              .then(() => {
                commentsModel.updateMany(
                    {
                      "user.id": doc.id,
                    },
                    {
                        "user.name": doc.name,
                    }
                  ).then(() => res.json({ code: 0, message: "Thành công", acc: doc }) )
              })
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("login");
  });
});

router.post("/updatePassword", validatorLogin, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.session.passport.user;
  if (!oldPassword || !newPassword) {
    return res.json({ code: 1, message: "Du lieu khong hop le" });
  }
  const user = await accountModel.findById(id);
  let match = bcrypt.compareSync(oldPassword, user.password);
  if (!match) {
    res.json({ code: 2, message: "Sai mat khau" });
  } else {
    let hashPass = bcrypt.hashSync(newPassword, 10);
    accountModel
      .findOneAndUpdate(
        {
          email: user.email,
        },
        {
          password: hashPass,
        }
      )
      .then(() => {
        res.json({ code: 0, message: "Thanh cong" });
      })
      .catch((err) => res.json({ code: 1, message: "That bai" }));
  }
});

router.post("/add", async (req, res) => {
  const { email, name, password, arrFaculty } = req.body;
  if (!email || !name || !password || !arrFaculty) {
    res.json({ code: 1, message: "Du lieu khong hop le" });
  } else {
    let user = await accountModel.findOne({ email: email });
    if (user) {
      res.json({ code: 2, message: "Tồn tại" });
    } else {
      let hashPassword = bcrypt.hashSync(password, 10);
      new accountModel({
        id: uuid.generate(),
        name: name,
        email: email,
        password: hashPassword,
        img: "/images/user.png",
        type: 1,
        arrFaculty: arrFaculty,
      })
        .save()
        .then(() => {
          res.json({ code: 0, message: "Thanh cong" });
        })
        .catch((err) => {
          res.json({ code: 2, message: "That bai" });
        });
    }
  }
});

module.exports = router;
