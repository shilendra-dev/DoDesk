const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

function authMiddleware(auth) {
    if(auth == 'secure') {
        return protect;
    } else return protect;
}

function get(route) {
    return {
        authSecure: (controller) => {
            return router.get(route, authMiddleware('secure'), (req, res) => {
                execute(req, res, controller);
            });
        }
        , noAuth: (controller) => {
            return router.get(route, (req, res) => {
                execute(req, res, controller);
            });
        }
    }
}

function post(route) {
    return {
        authSecure: (controller) => {
            return router.post(route, authMiddleware('secure'), (req, res) => {
                execute(req, res, controller);
            });
        }
        , noAuth: (controller) => {
            return router.post(route, (req, res) => {
                execute(req, res, controller);
            });
        }
    }
}

function put(route) {
    return {
        authSecure: (controller) => {
            return router.put(route, authMiddleware('secure'), (req, res) => {
                execute(req, res, controller);
            });
        }
        , noAuth: (controller) => {
            return router.put(route, (req, res) => {
                execute(req, res, controller);
            });
        }
    }
}

function del(route) {
    return {
        authSecure: (controller) => {
            return router.delete(route, authMiddleware('secure'), (req, res) => {
                execute(req, res, controller);
            });
        }
        , noAuth: (controller) => {
            return router.delete(route, (req, res) => {
                execute(req, res, controller);
            });
        }
    }
}

async function execute(req, res, controller) {
    
    try {
        const response = await controller(req, res);
        
        res.status(response.status).json(response);
    } catch (error) {
        
        // Return error response
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            type: 'error'
        });
    }
}

module.exports.createApi = () => ({
    get, post, put, delete: del
});

module.exports.routes = router;