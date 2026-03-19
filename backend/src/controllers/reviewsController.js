const reviewsController = {};

import reviewsModel from "../models/reviews.js";

//SELECT
reviewsController.getReviews = async(req, res) => {
    const reviews = await reviewsModel.find()
    res.json(reviews)
}

//INSERT
reviewsController.insertReviews = async(req, res) => {
    const {idEmployees, idProducts, rating, comment} = req.body;
    const newReview = new reviewsModel({idEmployees, idProducts, rating, comment});
    await newReview.save();
    res.json(newReview);
}

//UPDATE
reviewsController.updateReviews = async(req, res) => {
    const {idEmployees, idProducts, rating, comment} = req.body;
    const updatedReview = await reviewsModel.findByIdAndUpdate(req.params.id, {
        idEmployees, idProducts, rating, comment
    }, {new: true});
    res.json(updatedReview);
}

//DELETE
reviewsController.deleteReviews = async(req, res) => {
    await reviewsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Review deleted"});
}