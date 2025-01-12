const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    User.create({
        username : username,
        password : password
    })
    res.json({
        msg : "User created Succesfully"
    })
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
    Course.find({})
    .then((value) => {
        res.json({
            courses : value
        })
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.body.username;
    await User.updateOne({
        username : username
    }, {
        "$push" : {
            purchasedCourses : courseId
        }
    })
    res.json({
        msg : "Purchase complete"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username : req.headers.username
    });
    const courses = await Course.find({
        _id : {
            "$in" : user.purchasedCourses
        }
    })
    res.json({
        courses : courses
    })
});

module.exports = router