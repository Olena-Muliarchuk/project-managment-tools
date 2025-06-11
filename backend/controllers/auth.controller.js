exports.register = (req, res) => {
    // TODO: Додати логіку реєстрації
    res.status(201).json({ success: true, message: 'User registered' });
};

exports.login = (req, res) => {
    // TODO: Додати логіку логіну
    res.status(200).json({ success: true, message: 'User logged in' });
};
