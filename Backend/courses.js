import Courses from './coursemodel.js';
import Cart from './cartmodel.js';

const addCourse = async (req, res) => {
    const { image, title, description, rating, price, author } = req.body;
    const newCourse = await new Courses({ image: image, title: title, description: description, rating: Number(rating), price: Number(price), author: author });
    newCourse.save();
}

const getCourses = async (req, res) => {
    const all_courses = await Courses.find();
    return res.status(200).json({ courses: all_courses });
}

const courseMap = {
    "database": "dbms",
    "object": "oops",
    "web": "web development",
    "python": "python programming",
    "ml": "machine learning"
}

const getCourseAbbreviation = (course) => {
    course = course.toLowerCase();
    for (const [keyword, abbreviation] of Object.entries(courseMap)) {
        const regex = new RegExp(`^${keyword}`, "i");
        if (regex.test(course)) {
            return abbreviation;
        }
    }
    return course;
}

const getCoursesBySearch = async (req, res) => {
    const searchQuery = req.body.searchQuery;
    if (searchQuery === "") {
        const all_courses = await Courses.find();
        return res.status(200).json({ courses: all_courses });
    }
    const abbreviation = getCourseAbbreviation(searchQuery);
    const all_courses = await Courses.find({ title: abbreviation });
    return res.status(200).json({ courses: all_courses });
}

const getCoursesByRating = async (req, res) => {
    let { searchQuery, searchRating } = req.body;
    if (searchRating == "Rating" && searchQuery != "") {
        const abbreviation = getCourseAbbreviation(searchQuery);
        const all_courses = await Courses.find({ title: abbreviation });
        return res.status(200).json({ courses: all_courses });
    }
    else if (searchRating == "Rating" && searchQuery == "") {
        const abbreviation = getCourseAbbreviation(searchQuery);
        const all_courses = await Courses.find();
        return res.status(200).json({ courses: all_courses });
    }
    searchRating = Number(searchRating.substring(0, 1));
    if (searchQuery === "") {
        const all_courses = await Courses.find({ rating: { $gte: searchRating } });
        return res.status(200).json({ courses: all_courses });
    }
    const abbreviation = getCourseAbbreviation(searchQuery);
    const all_courses = await Courses.find({ title: abbreviation, rating: { $gte: searchRating } });
    return res.status(200).json({ courses: all_courses });
}



const addToCart = async(req,res) => {
    const course_id = req.body.course_id;
    const user_email = req.rootUser[0].email;
    console.log(user_email);
    console.log(course_id);
    const newCartItem = new Cart({user_email : user_email , course_id : course_id});
    newCartItem.save();
    
    return res.status(200).json({cart_message : "Course added successfully"});
}

export { addCourse, getCourses, getCoursesBySearch, getCoursesByRating , addToCart };