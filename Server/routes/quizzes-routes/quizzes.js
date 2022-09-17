const express = require('express');
const Quizzes = require('../../models/quiz-model/Quiz');
const checkAuth = require('../../middleware/auth');
const Users = require('../../models/users-model/Users');
const Score = require('../../models/scores-model/Scores');

const router = express.Router();

//logical implementation of create a quiz

router.post('/create', checkAuth, (req, res) => {
    let quiz = new Quizzes({
        ...req.body.quiz,
        //createdBy: req.body.createdBy,
        questions: req.body.quiz.questions.map(ques => {
            return {
                ...ques,
                answers: ques.answers.map(ans => {
                    return {
                        name: ans,
                        selected: false
                    }
                })
            }
        })
    });
    quiz.save().then(result => {
        res.status(200).json({ success: true });
    })
});


//logical implementation of fetching all the quiz

router.get('/all-quizzes', checkAuth, (req, res) => {
    Quizzes.find()
        .then(result => {
            res.status(200).json(result);
        })
})

//logical implementation of getting quiz by id
router.get('/get-quiz/:id', checkAuth, (req, res) => {
    Quizzes.findOne({ _id: req.params.id }).then(quiz => {
        res.status(200).json({ quiz });
    }).catch(er => {
        res.status(500).send(er);
    })
})

//logical implementation of adding comment

router.post('/add-comment', checkAuth, (req, res) => {
    Quizzes.updateOne({ _id: req.body.quizId }, {
        $push: {
            comments: {
                sentFromId: req.body.sentFromId,
                message: req.body.message
            }
        }
    }).then(quiz => {
        res.status(200).json({ success: true });
    }).catch(er => {
        res.status(500).send(er);
    })
});

//logical implementation of adding like
router.post('/like-quiz', checkAuth, (req, res) => {
    Users.findOne({ _id: req.body.userId, likedQuizzes: { $in: [req.body.quizId] } }).then(async user => {
        if (!user) {
            await Users.updateOne({ _id: req.body.userId }, {
                $push: {
                    likedQuizzes: req.body.quizId
                }
            });
            await Quizzes.updateOne({ _id: req.body.quizId }, {
                $inc: {
                    likes: 1
                }
            });
            res.status(200).json({ message: 'Added To Liked' });
        } else {
            await Users.updateOne({ _id: req.body.userId }, {
                $pull: {
                    likedQuizzes: req.body.quizId
                }
            });
            await Quizzes.updateOne({ _id: req.body.quizId }, {
                $inc: {
                    likes: -1
                }
            })
            res.status(200).json({ message: 'Removed from liked' })
        }
    })
});

//logical implementation of saving the final result
router.post('/save-results', checkAuth, (req, res) => {
    let score = new Score({
        userId: req.body.currentUser,
        answers: req.body.answers,
        quizId: req.body.quizId
    });
    score.save().then(async resp => {
        await Quizzes.updateOne({ _id: req.body.quizId }, {
            $push: {
                scores: resp._id
            }
        });
        res.status(200).json({ scoreId: resp._id });
    })
});

//logical implementation of fetching result by id
router.get('/results/:id', checkAuth, (req, res) => {
    if (!req.params.id) {
        res.status(500).send("No id provided in params");
    } else {
        Score.findOne({ _id: req.params.id }).then(data => {
            if (!data) {
                res.status(500).send("Error finding score");
            } else {
                Quizzes.findOne({ _id: data.quizId }).then(quiz => {
                    if (!quiz) {
                        res.status(500).send("Error getting quiz");
                    } else {
                        res.status(200).json({ score: data, quiz: quiz });
                    }
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Error finding score");
        })
    }
})

module.exports = router;