const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Courses = require('../models/course');

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Courses.find(req.query, { leactures: 0 })
            .then((courses) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(courses);
            }, (err) => next(err)).catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Courses.create(req.body)
            .then((course) => {
                console.log('Course has been created: ', course);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => next(err)).catch((err) => next(err));
    })

courseRouter.route('/:courseId')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                if (course) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(course);
                }
                else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'plain/text');
                    res.end('no such course');
                }
            }, (err) => next(err)).catch((err) => next(err));
    });
courseRouter.route('/:courseId/:leactureId')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                if (course) {
                    if (course.leactures.id(req.params.leactureId) != null) {
                        req.statusCode = 200;
                        req.setHeader('Content-Type', 'application/json');
                        req.json(course.leactures.id(req.params.leactureId));
                    }
                    else {
                        req.statusCode = 404;
                        req.setHeader('Content-Type', 'plain/text');
                        req.end('No such leacture is present');
                    }
                }
                else {
                    res.statusCode = 404;
                    res.setHeader('Context-Type', 'plain/text');
                    res.end('No such Course');
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                if (course) {
                    if (course.leactures.id(req.params.leactureId) !== null) {
                        if (course.leactures.id(req.params.leactureId).completed.indexOf(req.user._id) === -1) {
                            course.leactures.id(req.params.leactureId).completed.push(req.user._id);
                            course.save()
                                .then((course) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({status:true});
                                }, (err) => next(err)).catch((err) => next(err));
                        }
                        else {
                            res.statusCode = 200;
                            res.json({status:true});
                        }
                    }
                    else {
                        err = new Error("Leacture not present");
                        err.status = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error("Course not present");
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err)).catch((err) => next(err));
    })
courseRouter.route('/:courseId/:leactureId/comments')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                if (course.leactures.id(req.params.leactureId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(course.leactures.id(req.params.leactureId).comments);
                }
                else {
                    req.statusCode = 404;
                    req.setHeader('Content-Type', 'plain/text');
                    req.end('no such leacture');
                }
            })
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                if (course.leactures.id(req.params.leactureId) != null) {
                    course.leactures.id(req.params.leactureId).comments.push({ comment: req.body.comment, author: req.user.username });
                    course.save()
                        .then((course) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(course.leactures.id(req.params.leactureId).comments);
                        }, (err) => next(err)).catch((err) => next(err));
                }
                else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'plain/text');
                    res.end('no such course');
                }
            }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = courseRouter;