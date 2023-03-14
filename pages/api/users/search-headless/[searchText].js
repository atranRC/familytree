import * as Realm from "realm-web";
export default async function handler(req, res) {
    const {
        query: { searchText },
        method,
    } = req;

    switch (method) {
        case "GET" /* Get a model by its email */:
            const APP_ID = "users-app-pwqpx";
            const app = new Realm.App({ id: APP_ID });
            const credentials = Realm.Credentials.anonymous();
            try {
                const user = await app.logIn(credentials);
                const allUsers = await user.functions.searchUsers(searchText);

                if (!allUsers) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: JSON.parse(JSON.stringify(allUsers)),
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const user = await Users.findByIdAndUpdate(email, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!user) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedUser = await Users.deleteOne({ email: email });
                if (!deletedPet) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
