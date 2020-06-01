const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const resourseSchema = new Schema({
    resource:{
        type:String,
        default:''
    }
})

const commentSchema = new Schema({
    
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required:true
    }
}, {
    timestamps: true
});

leactureSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    video: {
        type:String,
        required:true
    },
    description:{
        type:String,
        require:true
    },
    resources:[resourseSchema],
    
    completed:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments: [commentSchema]

});

const courseSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''
    },
    leactures: [leactureSchema]
});

module.exports = mongoose.model('Course',courseSchema);