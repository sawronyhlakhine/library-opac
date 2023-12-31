const WebService = require('../services/web.service');
const webService = new WebService();

const home = (req, res, next) => {
    webService
        .home(req)
        .then(data => {
            res.render('index', { title: process.env.APP_NAME || "Express JS", ...data });
        })
        .catch(err => next(err));
    
}

const bookDetails = (req, res, next) => {
    webService
        .bookDetails(req)
        .then(data => {
            console.log(data);
            res.render('details', { title: process.env.APP_NAME || "Express JS", ...data });
        })
        .catch(err => next(err));

}

const borrow = (req, res, next) => {
    webService
        .borrowEntry(req)
        .then(data => { 
            console.log(data);
            res.render('borrow_entry', { title: process.env.APP_NAME || "Express JS", ...data }); 
        })
        .catch(err => next(err));
}
const storeBorrow = (req, res, next) => {
    webService
        .borrowStore(req)
        .then(data => { 
            res.redirect('/')
        })
        .catch(err => next(err));
}

module.exports = {
    home,
    bookDetails,
    borrow,
    storeBorrow
}