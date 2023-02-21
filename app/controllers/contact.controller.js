const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

//Create and Save a new Contact
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

//Retrieve all contacts of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        const { email } = req.query;
        const { phone } = req.query;
        if(name && email && phone){
            documents = await contactService.findByAll(name, email, phone);
        }else if (name) {
            documents = await contactService.findByName(name);
        } else if(email){
            documents = await contactService.findByEmail(email);
        } else if(phone){
            documents = await contactService.findByPhone(phone);
        } else {
            documents = await contactService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the contacts")
        );
    }
};

// Find a single contact with an id
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

// Update a contact by the id in the request
exports.update = async(req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next( ApiError(400, "Data to update can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document){
            return new(ApiError(404, "Contact not found"))
        }
        return res.send({message: "Contact was update successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error update contact with id=${req.params.id}`)
        );
    }
};

// Delete a contact with the specified id in the request
exports.delete = async(req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete contact with id=${req.params.id}`)
        );
    }
};

// Find all favorite contacts of a user
exports.findAllFavorite = async(req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite(req.params.id);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
};

// Delete all contacts of a user from a database
exports.deleteAll = async(req, res,next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll(req.params.id);
        return res.send(
            {message: `${deletedCount} contacts were deleted successfully`}
            );
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete contact with id=${req.params.id}`)
        );
    }
};
