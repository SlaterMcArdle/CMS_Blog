const router = require('express').Router();
const { User } = require('../../models');

// Add User Route
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        req.session.save(() =>{
            req.session.loggedIn = true;
            req.session.user = newUser.get({ plain: true });

            res.status(200).json(newUser);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Login as User Route
router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        const invalidLogin = () => { res
            .status(400)
            .json({ message: 'Incorrect email or password. Please try again!' });
        };

        if (!dbUserData) {
            invalidLogin();
            return;
        }

        const validPassword = await dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            invalidLogin();
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.user = dbUserData.get({ plaint: true });
            res
                .status(200)
                .json({user: dbUserData, message: 'Yu are now logged in!'});
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

// Logout as User Route
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

