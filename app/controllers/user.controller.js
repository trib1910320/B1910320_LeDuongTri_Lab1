const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await userService.findByName(name);
        } else {
            documents = await userService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the users")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving user with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0 ) {
        return next(ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);

        const document = await userService.update(req.params.id, req.body);
        if (!document) {
            return new (ApiError(404, "User not found"))
        }
        return res.send({ message: "User was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete user with id=${req.params.id}`)
        );
    }
};

exports.register = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    } else if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const findUser = await userService.findUserByUsername(req.body.username);
        if (findUser) {
            return next(new ApiError(400, "User already exists"));
        } else {
            const document = await userService.register(req.body);
            return res.send(document);
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
}

exports.logOut = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.logout(req.params.id);
        if(!document){
            return next(new ApiError(400, "User not found"));
        }
        res.send({ message: "Log Out" });
    } catch (error) {
        return next(
            new ApiError(500, `Error logout user with id=${req.user.id}`)
        );
    }
};

exports.logIn = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findUserByUsername(req.body.username);

        if (!user) return next(new ApiError(400, "Wrong username"));

        const validPassword = await userService.validPassword(req.body.password, user.password)
        if (!validPassword) return next(new ApiError(400, "Wrong password"));
        const document = await userService.login(user._id);
        if(!document){
            return next(new ApiError(400, "User not found"));
        }
        res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while logging the user")
        );
    }
}

