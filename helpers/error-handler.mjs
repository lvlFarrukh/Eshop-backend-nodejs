
const errorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({message: err.message})
    }

    return res.status(500).json({message: err.message})
}

export default errorHandler